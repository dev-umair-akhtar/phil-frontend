import { Dispatch, SetStateAction, createContext } from "react";

export type User = { id: number };

export type TUserCtx = {
    user: null | User;
    setUser: Dispatch<SetStateAction<User | null>>;

    permissions: string[];
    setPermissions: Dispatch<SetStateAction<string[]>>;
};

const context = {} as TUserCtx;

export const UserContext = createContext(context);
