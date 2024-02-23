import JSZip from "jszip";


export class WordService {
    templateId: string;
    constructor(templateId: string) {
        this.templateId = templateId;
    }

    public async replace(project: any) {
        console.log(this.templateId);
        // const url = await S3Service.getS3ByKey(this.templateId);
        const response = await fetch(this.templateId);
        const blob = await response.blob();
        const arrayBuf = await blob.arrayBuffer();

        const zip = await JSZip.loadAsync(arrayBuf);
        const documentString = await zip.file("word/document.xml").async("text");

        console.log(project);

        const replacedDoc = this.replacePlaceholders(documentString, project);
        // let replacedDoc = documentString.replace("{{title}}", project.title)
        // let replacedDoc = documentString.replace("${objective}", project.objective)
        // replacedDoc = replacedDoc.replace("${background}", project.background)
        console.log(replacedDoc);

        zip.file("word/document.xml", replacedDoc);

        const updatedBlob = await zip.generateAsync({ type: "blob" });
        console.log(URL.createObjectURL(updatedBlob));

        const downloadLink = document.createElement("a");
        downloadLink.download = "reference.docx";
        downloadLink.href = window.URL.createObjectURL(updatedBlob);
        downloadLink.click();

        return updatedBlob;
    }

    private replacePlaceholders(input: string, data: any) {
        // Regular expression to match placeholders in the format {{key}}
        // const regex = /{{\s*([a-z]*?)\s*}}/g
        const regex = /\*\*(.*?)\*\*/g

        // Replace each placeholder with the corresponding value from the object
        return input.replace(regex, (match, key) => {
            console.log("Match:", match, "Key:", key)
            // Trim any whitespace from the key
            key = key.trim();

            // If the key exists in the object, return its value; otherwise, return the original placeholder
            return data.hasOwnProperty(key) ? data[key]?.toString() ?? '' : '';
        });
    }

}

