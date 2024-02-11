import { Button } from "@mui/material";
import { Paragraph, patchDocument } from "docx";
import { TProjectRow } from "../../services/ProjectService";
type TCreateReferencesProps = { project: TProjectRow; templates: string[] };

function CreateReferences({ project, templates }: TCreateReferencesProps) {
    async function getFiles(temps: string[]) {
        const files: File[] = [];

        let index = 0;

        for (const url of temps) {
            const file = await fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                    const _file = new File([blob], "template-" + ++index, {
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });

                    console.log(_file);

                    return _file;
                });

            files.push(file);
        }

        for (const file of files) {
            patchDocument(file, {
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
            }).then((doc) => {
                const blob = new Blob([doc], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });

                const file = new File([blob], "asdf.docx", {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
