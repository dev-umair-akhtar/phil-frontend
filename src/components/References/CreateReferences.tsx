import { Button } from "@mui/material";
import { TProjectRow } from "../../services/ProjectService";
import { WordService } from "../../services/WordService.1";
type TCreateReferencesProps = { project: TProjectRow; templates: string[] };

function CreateReferences({ project, templates }: TCreateReferencesProps) {
    
    const generateTemplates = async (templates: string[]) => {

        for (const template of templates) {
            const service = new WordService(template);
            service.replace(project);
        }

    } 
    return (
        <Button
            variant="contained"
            disableElevation
            onClick={() => generateTemplates(templates)}
        >
            create
        </Button>
    );
}

export default CreateReferences;
