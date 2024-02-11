export const baseAPI =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8000/api"
        : "/api";

export const notConnectedMessage =
    "You're not connected to the internet. Make sure you have a working connection.";
