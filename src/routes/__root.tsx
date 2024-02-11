import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, UserContext } from "../contexts/UserContext";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);

    return (
        <UserContext.Provider
            value={{ user, setUser, permissions, setPermissions }}
        >
            <Outlet />
        </UserContext.Provider>
    );
}
