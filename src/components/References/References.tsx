import { Assignment } from "@mui/icons-material";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { TProjectRow } from "../../services/ProjectService";
import { S3Service } from "../../services/S3Service";
import CreateReferences from "./CreateReferences";

type TAssignTemplateProps = { project: TProjectRow };

const initialTemplates: { [key: string]: { selected: boolean; url: string } } =
    {};

const References = ({ project }: TAssignTemplateProps) => {
    const [open, setOpen] = useState(false);
    const [templates, setTemplates] = useState(initialTemplates);

    const theme = useTheme();

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    function handleTemplateSelection(index: number | string) {
        setTemplates({
            ...templates,
            [index]: {
                ...templates[index],
                selected: !templates[index].selected,
            },
        });
    }

    async function getTemplates() {
        const keys = ["templates/template-3", "templates/template-4"];

        const promises = keys.map((key) => S3Service.getS3ByKey(key));

        Promise.allSettled(promises).then((result) => {
            const urls: string[] = [];
            result.forEach((res) => {
                if (res.status === "fulfilled") {
                    urls.push(res.value as string);
                }
            });

            setTemplates(
                urls.reduce(
                    (prev, url, index) => ({
                        ...prev,
                        [index]: { selected: false, url },
                    }),
                    {}
                )
            );
        });
    }

    useEffect(() => {
        if (open) {
            getTemplates();
        }
    }, [open]);

    return (
        <Box>
            <IconButton onClick={openDialog}>
                <Assignment />
            </IconButton>

            <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="xs">
                <DialogTitle>
                    Create references to project ({project.title})
                </DialogTitle>

                <DialogContent>
                    <Grid2 container>
                        {Object.entries(templates).map(
                            ([index, { selected }]) => (
                                <Grid2 key={index} xs={6}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderColor: selected
                                                ? theme.palette.primary.main
                                                : undefined,
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() =>
                                                handleTemplateSelection(index)
                                            }
                                        >
                                            <CardContent>
                                                <Typography>
                                                    Template {index + 1}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid2>
                            )
                        )}

                        <Grid2 xs={12} mt={2}>
                            <Typography variant="caption">
                                Selected (
                                {
                                    Object.values(templates).filter(
                                        (temp) => temp.selected
                                    ).length
                                }
                                )
                            </Typography>
                        </Grid2>
                    </Grid2>
                </DialogContent>

                <DialogActions>
                    <CreateReferences
                        project={project}
                        templates={Object.values(templates)
                            .filter((temp) => temp.selected)
                            .map((temp) => temp.url)}
                    />
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default References;
