import { AlertProps } from "@mui/material";
import { useState } from "react";
import { S3Service } from "../services/S3Service";

export type Feedback = {
    loading: boolean;
    show: boolean;
    messege: string;
    severity?: AlertProps["severity"];
};

export const initialFeedback: Feedback = {
    loading: false,
    show: false,
    messege: "",
};

export default function useUploadTemplate(key: string, file: File) {
    const [feedback, setFeedback] = useState(initialFeedback);

    //

    async function uploadTemplateToS3() {
        setFeedback((state) => ({ ...state, loading: true }));

        const [messege, err] = await S3Service.uploadToS3(key, file);

        if (err) {
            setFeedback({
                loading: false,
                messege,
                severity: "success",
                show: true,
            });
        }
    }

    return {
        handler: uploadTemplateToS3,
        feedback,
    };
}
