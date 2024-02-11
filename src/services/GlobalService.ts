import axios from "axios";
import { baseAPI, notConnectedMessage } from "../constants";
import { TProjectRow } from "./ProjectService";
import { Option, createGetResult, createPostResult } from "./types";

export const GET = async <Ent>(url: string, params: object) => {
    try {
        const response: {
            data: {
                rows: Ent[];
                successMessage: string;
                errMessage: string[];
            };
        } = await axios.get(baseAPI + url, {
            withCredentials: true,
            params,
        });

        const result = createGetResult<
            Option<Ent>,
            Option<string>,
            Option<string[]>
        >(
            response.data.rows,
            response.data.successMessage,
            response.data.errMessage
        );

        return result;
    } catch (err: any) {
        const result = createGetResult<
            Option<Ent>,
            Option<string>,
            Option<string[]>
        >([], null, err.response?.data?.errMessage);

        return result;
        // return [null, err.response?.data?.message || notConnectedMessage];
    }
};

export const POST = async <Data, Params>(
    url: string,
    data: Data,
    params?: Params
) => {
    try {
        const response: {
            data: {
                entity: TProjectRow;
                successMessage: string;
                errMessage: string[];
            };
        } = await axios.post(baseAPI + url, data, {
            withCredentials: true,
            params,
        });

        const postResult = createPostResult<
            Option<TProjectRow>,
            Option<string>,
            Option<string[]>
        >(
            response.data.entity,
            response.data.successMessage,
            response.data.errMessage
        );

        return postResult;
    } catch (err: any) {
        const postResult = createPostResult<
            Option<TProjectRow>,
            Option<string>,
            Option<string[]>
        >(null, null, err?.response?.data?.errMessage);

        return postResult;
    }
};

export const PATCH = async <D, P>(
    url: string,
    data: D | null = null,
    params: P
) => {
    try {
        const response = await axios.patch(baseAPI + url, data, {
            withCredentials: true,
            params,
        });
        return [response.data, null];
    } catch (err: any) {
        return [null, err.response?.data?.message || notConnectedMessage];
    }
};

export const DELETE = async <P>(
    url: string,
    id: number | number[],
    params?: P
) => {
    try {
        const response = await axios.delete(baseAPI + url, {
            withCredentials: true,
            params: { id, ...params },
        });
        return [response.data, null];
    } catch (err: any) {
        return [null, err.response?.data?.message || notConnectedMessage];
    }
};

type TMockServiceExpectation = "success" | "error";

export const MockService = async <R>(
    expectation: TMockServiceExpectation,
    response: R
) => {
    try {
        const res = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (expectation === "success") {
                    resolve(response);
                } else {
                    reject(response);
                }
            }, 2000);
        });

        console.log(res);
    } catch (error: unknown) {
        console.log(error);
    }
};
