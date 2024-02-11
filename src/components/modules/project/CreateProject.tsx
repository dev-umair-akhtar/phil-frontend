import { Add } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    useTheme,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { ProjectService } from "../../../services/ProjectService";

const project = { title: "", background: "", objective: "" };

function CreateProject() {
    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState(project);
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

        const res =
            await ProjectService.getInstance().createProject(newProject);

        console.log(res);
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
                            >
                                create
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateProject;
