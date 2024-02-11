import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

interface Props {
    children: any;
    opName?: string;
    fallback?: JSX.Element | null;
}

export default function Authorize({
    children,
    opName,
    fallback = null,
}: Props) {
    const { permissions } = useContext(UserContext);

    if (permissions && opName && permissions.includes(opName)) return children;
    else if (!opName) return children;
    else return fallback;
}
