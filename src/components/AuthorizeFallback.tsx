import { Alert, useTheme } from "@mui/material";

export const AuthorizeFallback = ({ message }: { message?: string }) => {
    const theme = useTheme();
    return (
        <Alert severity="error" style={{ margin: theme.spacing(1) }}>
            {message || "You're not authorized!"}
        </Alert>
    );
};
