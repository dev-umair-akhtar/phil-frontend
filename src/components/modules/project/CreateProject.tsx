import { Add } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { initialFeedback } from "../../../hooks/useUploadTemplate";
import { ProjectService } from "../../../services/ProjectService";

const project = { title: "", background: "", objective: "" };

type TCreateProjectProps = { onSuccess?: () => void };

function CreateProject({ onSuccess }: TCreateProjectProps) {
    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState(project);
    const [feedback, setFeedback] = useState(initialFeedback);
    //
    const theme = useTheme();

    //

    const handleInput = (event: ChangeEvent<HTMLInputElement>) =>
        setNewProject((currProject) => ({
            ...currProject,
            [event.target.name]: event.target.value,
        }));

    //

    async function handlecreateProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setFeedback((f) => ({ ...f, loading: true }));

        const { entity, successMessage, errMessage } =
            await ProjectService.getInstance().createProject(newProject);

        if (entity.isSome()) {
            console.log(successMessage);

            setFeedback({
                loading: false,
                messege: "",
                severity: "success",
                show: true,
            });

            onSuccess && onSuccess();
        } else {
            console.log(errMessage);
            setFeedback({
                loading: false,
                messege: "",
                severity: "error",
                show: true,
            });
        }
    }

    return (
        <>
            <Button
                disableElevation
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowForm(true)}
            >
                create project
            </Button>

            <Dialog open={showForm} maxWidth="xs" fullWidth>
                <DialogTitle>Create Project</DialogTitle>

                <DialogContent>
                    {feedback.show && (
                        <Alert
                            sx={{ mb: 2 }}
                            onClose={() => setFeedback(initialFeedback)}
                        >
                            {feedback.messege}
                        </Alert>
                    )}

                    <form
                        onSubmit={handlecreateProject}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: theme.spacing(2),
                            marginTop: theme.spacing(1),
                        }}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Title"
                            name="title"
                            value={newProject.title}
                            onChange={handleInput}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Background"
                            multiline
                            minRows={4}
                            name="background"
                            value={newProject.background}
                            onChange={handleInput}
                        />

                        <TextField
                            fullWidth
                            required
                            label="Objective"
                            multiline
                            minRows={2}
                            name="objective"
                            value={newProject.objective}
                            onChange={handleInput}
                        />

                        <Box display="flex" gap={2}>
                            <Button
                                variant="outlined"
                                sx={{ flex: 1 }}
                                onClick={() => setShowForm(false)}
                            >
                                close
                            </Button>

                            <Button
                                variant="contained"
                                sx={{ flex: 1 }}
                                type="submit"
                                disableElevation
                                disabled={feedback.loading}
                                startIcon={
                                    feedback.loading && (
                                        <CircularProgress
                                            size={theme.spacing(2)}
                                        />
                                    )
                                }
                            >
                                {feedback.loading ? "creating..." : "create"}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateProject;
