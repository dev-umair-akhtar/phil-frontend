import { Add, Close, Done, Upload } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    useTheme,
} from "@mui/material";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { ChangeEvent, useRef, useState } from "react";
import References from "../../components/References/References";
import { RUDTable } from "../../components/Table/RUDTable";
import Dashboard from "../../components/layout/Dashboard";
import { initialFeedback } from "../../hooks/useUploadTemplate";
import { ProjectService, TProjectRow } from "../../services/ProjectService";
import { S3Service } from "../../services/S3Service";

export const Route = createLazyFileRoute("/project/")({
    component: ProjectsPage,
});

function ProjectsPage() {
    const [feedback, setFeedback] = useState(initialFeedback);
    const [refetchCount, setRefetchCount] = useState(0);

    //
    const theme = useTheme();
    const inputRef = useRef<null | HTMLInputElement>(null);

    //
    async function handleTemplate(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;

        const file = event.target.files[0];

        const key = "templates/template-1";

        setFeedback({ ...feedback, loading: true });

        const res = await S3Service.uploadToS3(key, file);

        console.log(res);

        const [messege, err] = res;

        if (err) {
            setFeedback({
                loading: false,
                show: true,
                messege: err,
                severity: "error",
            });
        } else {
            setFeedback({
                loading: false,
                show: true,
                messege,
                severity: "success",
            });
        }
    }

    return (
        <Dashboard title="Projects">
            <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleTemplate}
                hidden
                ref={inputRef}
            />

            <RUDTable
                getter={(page, limit) => ProjectService.getInstance().readProjects(page,limit)}
                readables={{
                    id: "id",
                    title: "Title",
                    background: "Background",
                    objective: "Objective",
                    assignTemplate: "Create Reference",
                }}
                rowsPreprocessor={(row: TProjectRow) => ({
                    ...row,
                    assignTemplate: <References project={row} />,
                })}
                ops={{ read: "" }}
                actions={[
                    <Box display="flex" gap={theme.spacing(2)}>
                        <Button
                            variant="outlined"
                            color={feedback?.severity ?? "primary"}
                            startIcon={
                                feedback.loading ? (
                                    <CircularProgress size={theme.spacing(2)} />
                                ) : feedback.severity === "success" ? (
                                    <Done />
                                ) : feedback.severity === "error" ? (
                                    <Close />
                                ) : (
                                    <Upload />
                                )
                            }
                            disabled={feedback.loading}
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.click();
                                }
                            }}
                        >
                            {feedback.loading
                                ? "uploading..."
                                : feedback.severity === "error"
                                  ? "failed"
                                  : feedback.severity === "success"
                                    ? "uploaded"
                                    : "upload"}
                        </Button>

                        <Link to="/project/import">
                            <Button variant="outlined">import Projects</Button>
                        </Link>

                        <Link to="/project/create">
                            <Button
                                disableElevation
                                startIcon={<Add />}
                                variant="contained"
                            >
                                create project
                            </Button>
                        </Link>
                    </Box>,
                ]}
                updatingAgents={[refetchCount]}
            />

            <Snackbar
                open={feedback.show}
                onClose={() => setFeedback(initialFeedback)}
                autoHideDuration={5000}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            >
                <Alert severity={feedback.severity}>{feedback.messege}</Alert>
            </Snackbar>
        </Dashboard>
    );
}
