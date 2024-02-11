import { Menu } from "@mui/icons-material";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "../../contexts/DashboardContext";

type TTopbarProps = { title: string };

function Topbar({ title }: TTopbarProps) {
    const theme = useTheme();
    const { open, setOpen } = useContext(DashboardContext);

    return (
        <AppBar
            variant="outlined"
            elevation={0}
            color="default"
            position="sticky"
            sx={{
                borderLeft: "none",
            }}
        >
            <Toolbar>
                {!open && (
                    <IconButton onClick={() => setOpen(true)}>
                        <Menu />
                    </IconButton>
                )}

                <Typography variant="h6" color={theme.palette.primary.main}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Topbar;
