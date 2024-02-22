import { Button } from "@mui/material";
import { Paragraph, patchDocument } from "docx";
import { TProjectRow } from "../../services/ProjectService";
type TCreateReferencesProps = { project: TProjectRow; templates: string[] };

function CreateReferences({ project, templates }: TCreateReferencesProps) {
    async function getFiles(temps: string[]) {
        const files: Blob[] = [];

        // let index = 0;

        for (const url of temps) {
            const blob = await fetch(url).then((res) => res.blob());

            files.push(blob);
        }

        for (const blob of files) {
            patchDocument(blob, {
                patches: {
                    reference_title: {
                        type: "paragraph",
                        children: [new Paragraph(project.title)],
                    },
                    reference_background: {
                        type: "paragraph",
                        children: [new Paragraph(project.background)],
                    },
                    reference_objective: {
                        type: "paragraph",
                        children: [new Paragraph(project.objective)],
                    },
                },
                keepOriginalStyles: true,
            }).then((doc) => {
                const blob = new Blob([doc], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });

                const file = new File([blob], "asdf.docx", {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    endings: "native",
                });

                window.open(URL.createObjectURL(file), "_blank");

                // Navigate({ to: URL.createObjectURL(file) });
            });
        }
    }

    return (
        <Button
            variant="contained"
            disableElevation
            onClick={() => getFiles(templates)}
        >
            create
        </Button>
    );
}

export default CreateReferences;
