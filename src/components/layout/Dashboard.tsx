import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { ReactNode, useState } from "react";
import { DashboardContext } from "../../contexts/DashboardContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type TDashboardProps = { children: ReactNode; title?: string };

function Dashboard({ children, title }: TDashboardProps) {
    const [open, setOpen] = useState(true);
    const [pageTitle, setPageTitle] = useState(title ?? "Dashboard");
    //

    return (
        <DashboardContext.Provider
            value={{ open, setOpen, pageTitle, setPageTitle }}
        >
            <Grid container>
                <Sidebar />

                <Grid flex={1} sx={{ transition: "all 1s ease" }}>
                    <Topbar title={pageTitle} />

                    <Box p={3}>{children}</Box>
                </Grid>
            </Grid>
        </DashboardContext.Provider>
    );
}

export default Dashboard;
