import { Close } from "@mui/icons-material";
import {
    Box,
    Drawer,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { ReactNode, useContext, useMemo } from "react";
import { DashboardContext } from "../../contexts/DashboardContext";

export type TModule = {
    id: number;
    label: string;
    url?: string;
    subModules?: TModule[];
    icon?: ReactNode;
};

const modules: TModule[] = [{ id: 1, label: "Projects", url: "/projects" }];

function Sidebar() {
    //
    const theme = useTheme();
    const bgPrimary = useMemo(() => theme.palette.background.default, []);
    const { open, setOpen } = useContext(DashboardContext);
    const matcheRoute = useMatchRoute();

    //
    const closeSidebar = () => setOpen(false);
    // const openSidebar = () => setOpen(true);

    return (
        <Grid bgcolor={bgPrimary}>
            <Drawer
                open={open}
                variant="persistent"
                onClose={closeSidebar}
                sx={{
                    width: open ? theme.spacing(36) : "auto",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? theme.spacing(36) : "auto",
                        bgcolor: bgPrimary,
                    },
                }}
            >
                <Box color={theme.palette.getContrastText(bgPrimary)}>
                    <ListItem divider sx={{ height: theme.spacing(8.225) }}>
                        <ListItemIcon>
                            <img src="/vite.svg" />
                        </ListItemIcon>

                        <ListItemText>PHIL</ListItemText>

                        <IconButton onClick={closeSidebar}>
                            <Close />
                        </IconButton>
                    </ListItem>

                    {modules.map((module) =>
                        module?.url ? (
                            <Link
                                key={module.id}
                                to={module.url}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <ListItemButton
                                    selected={Boolean(
                                        matcheRoute({ to: module.url })
                                    )}
                                >
                                    <ListItemText>{module.label}</ListItemText>
                                </ListItemButton>
                            </Link>
                        ) : (
                            <ListItemButton key={module.id}>
                                <ListItemText>{module.label}</ListItemText>
                            </ListItemButton>
                        )
                    )}
                </Box>
            </Drawer>
        </Grid>
    );
}

export default Sidebar;
