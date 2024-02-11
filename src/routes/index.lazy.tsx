import { Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/layout/Dashboard";

export const Route = createLazyFileRoute("/")({
    component: IndexPage,
});

function IndexPage() {
    return (
        <Dashboard>
            <Typography variant="h4">Index Page</Typography>
        </Dashboard>
    );
}
