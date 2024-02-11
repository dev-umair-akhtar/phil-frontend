import { Navigate, useRouterState } from "@tanstack/react-router";
import { ReactNode, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { UserService } from "../services/UserService";

type TAuthenticateProps = { children: ReactNode };

export default function Authenticate({ children }: TAuthenticateProps) {
    const [content, setContent] = useState<null | ReactNode>(null);
    const router = useRouterState();

    const { setUser } = useContext(UserContext);

    const loginOrRedirect = async () => {
        const [data, err] = await UserService.getInstance().login({
            username: "",
            password: "",
        });

        if (data?.user) {
            setUser(data.user);
            if (router.location.pathname === "/") {
                Navigate({ to: `/` });
            } else {
                setContent(children);
            }
        } else {
            console.log(err);
            if (err === "Network Error") {
                console.log("Setting offline true");

                // setContent(children);
                Navigate({ to: `/offline` });
            } else {
                Navigate({ to: `/login` });
            }
        }
    };

    useEffect(() => {
        loginOrRedirect();
    }, [router.location.pathname]);

    return content;
}
