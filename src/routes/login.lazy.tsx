import { Copyright, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    Hidden,
    IconButton,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

export const Route = createLazyFileRoute("/login")({ component: LoginPage });

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    //
    const theme = useTheme();

    //
    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <Grid container minHeight="100vh">
            <Grid
                item
                xs={12}
                md={6}
                lg={4}
                px={8}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <form style={{ flex: 1 }} onSubmit={handleLogin}>
                    <Box textAlign="center" mb={4}>
                        <img width={theme.spacing(6)} src="/vite.svg" />
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={theme.spacing(2)}
                        mb={2}
                    >
                        <TextField fullWidth label="Username" type="email" />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>

                    <Button
                        fullWidth
                        disableElevation
                        variant="contained"
                        type="submit"
                    >
                        login
                    </Button>

                    <Box mt={12}>
                        <Typography
                            variant="overline"
                            color={theme.palette.text.disabled}
                            textAlign="center"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Copyright fontSize="small" />
                            &nbsp; Copyrights All rights reserved.
                            {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </form>
            </Grid>

            <Hidden mdDown>
                <Grid
                    item
                    md={6}
                    lg={8}
                    style={{
                        background: `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
                    }}
                    bgcolor={theme.palette.primary.main}
                ></Grid>
            </Hidden>
        </Grid>
    );
}
