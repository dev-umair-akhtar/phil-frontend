import { Dispatch, SetStateAction, createContext } from "react";

export type TDashbaordCtx = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;

    pageTitle: string;
    setPageTitle: Dispatch<SetStateAction<string>>;
};

const context = {} as TDashbaordCtx;
export const DashboardContext = createContext(context);
