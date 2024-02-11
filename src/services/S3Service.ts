import axios from "axios";
import { baseAPI, notConnectedMessage } from "../constants";

export class S3Service {
    static api = `${baseAPI}/s3`;

    static async getS3ByKey(key: string) {
        const presignedURL = await axios.post(
            this.api + "/presigned-url",
            { key, command: "getObject" },
            { withCredentials: true }
        );
        return presignedURL?.data?.url;
    }

    static async getS3ByKeyOne(Key: string) {
        try {
            const presignedURL = await axios.post(
                this.api + "/psurl",
                { Key, command: "getObject" },
                { withCredentials: true }
            );

            return [presignedURL.data, null];
        } catch (err: any) {
            return [null, err?.response?.data?.message || notConnectedMessage];
        }
    }

    static async uploadToS3(key: string, body: File | Blob) {
        // const newFile = new File([body], key, { type: body.type });
        try {
            const presigned = await axios.post(
                this.api + "/presigned-url",
                {
                    key,
                    command: "putObject",
                    // Body: newFile,
                },
                { withCredentials: true }
            );
            const url = presigned.data.url;

            const response = await axios.put(url, body, {
                headers: { "Content-Type": body.type },
            });
            console.log(response);
            return ["File uploaded successfully", null];
        } catch (err: any) {
            return [
                null,
                err.response?.data?.message || "Something went wrong",
            ];
        }
    }

    static async deleteS3ByKey(key: string) {
        try {
            const response = await axios.delete(this.api + "/s3ObjectByKey", {
                withCredentials: true,
                params: { key },
            });
            return [response.data, null];
        } catch (err: any) {
            return [null, err.response?.data?.message || notConnectedMessage];
        }
    }

    static async deleteS3ByKeys(keys: string[]) {
        try {
            for (const key of keys) {
                await this.deleteS3ByKey(key);
            }
            return ["Delete successfull", null];
        } catch (err) {
            console.log(err);
            return [null, "Delete failed"];
        }
    }
}
