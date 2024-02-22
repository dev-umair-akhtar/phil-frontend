import {
    Alert,
    Button,
    Grid,
    LinearProgress,
    TextField,
    Typography,
} from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Dashboard from "../../components/layout/Dashboard";
import { baseAPI } from "../../constants";

export const Route = createLazyFileRoute("/project/import")({
    component: ImportProjectsFromExcel,
});

function ImportProjectsFromExcel() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [feedback, setFeedback] = useState({
        status: "initial",
        loading: false,
        message: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [skipRows, setSkipRows] = useState(0);
    const [skipCols, setSkipCols] = useState(0);
    const [headerCol, setHeaderCol] = useState(0);

    const handleFile = (ev: ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();

        if (!ev.target.files || ev.target.files.length <= 0) {
            setFeedback({
                loading: false,
                status: "error",
                message: "Must select a file to upload",
            });
            return;
        }

        setFile(ev.target.files[0]);
    };

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!file) return;
        setFeedback({
            status: "info",
            loading: true,
            message: "Uploading file",
        });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                baseAPI + "/project/excel-import",
                formData,
                {
                    params: {
                        "skip-cols": skipCols,
                        "data-begin": skipRows,
                        header: headerCol,
                    },
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setFeedback({
                status: "success",
                loading: false,
                message: `Successfully recorded ${response.data.noSuccesses} out of ${response.data.total} entries. ${response.data.noFailures} Failed.`,
            });
        } catch (err: any) {
            setFeedback({
                status: "error",
                message:
                    err.response?.data?.message ??
                    "Failed to import the projects",
                loading: false,
            });
        }
    };

    return (
        <Dashboard>
            <Grid
                container
                spacing={2}
                component={"form"}
                onSubmit={handleSubmit}
            >
                <Grid item xs={12}>
                    {feedback.loading && <LinearProgress />}
                </Grid>
                <Grid item xs={12}>
                    {feedback.status !== "initial" && (
                        <Alert severity={feedback.status as any}>
                            {feedback.message}
                        </Alert>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <input
                        required
                        ref={inputRef}
                        onChange={handleFile}
                        hidden
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <Button
                        variant="outlined"
                        onClick={() => inputRef.current?.click()}
                    >
                        Choose File
                    </Button>
                    {file && (
                        <Typography sx={{ ml: 2 }} variant="caption">
                            {file.name}
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        required
                        value={headerCol}
                        onChange={(ev) =>
                            setHeaderCol(parseInt(ev.target.value ?? "0"))
                        }
                        type="number"
                        label="Header column"
                        placeholder="Header column s.no"
                        fullWidth
                        variant="outlined"
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        required
                        value={skipRows}
                        onChange={(ev) =>
                            setSkipRows(parseInt(ev.target.value ?? "0"))
                        }
                        type="number"
                        label="Skip rows"
                        placeholder="The number of rows to skip"
                        fullWidth
                        variant="outlined"
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        required
                        value={skipCols}
                        onChange={(ev) =>
                            setSkipCols(parseInt(ev.target.value ?? "0"))
                        }
                        type="number"
                        label="Skip columns"
                        placeholder="The number of columns to skip"
                        fullWidth
                        variant="outlined"
                    />
                </Grid>

                <Grid item xs={0} md={9}></Grid>
                <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={feedback.status === "loading"}
                    >
                        Import
                    </Button>
                </Grid>
            </Grid>
        </Dashboard>
    );
}
