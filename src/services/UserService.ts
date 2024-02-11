import { POST } from "./GlobalService";
import { Option, PostResult } from "./types";

type TUserCredentials = { username: string; password: string };

export type Response<T> =
    | [{ message: string; rows: T[] }, null]
    | [null, string];

interface IUserService {
    login: (
        credentials: TUserCredentials
    ) => Promise<PostResult<Option<any>, Option<string>, Option<string[]>>>;

    // isLogged: () => Promise<GetResult<Option<any>>>;
}

export class UserService implements IUserService {
    static url = "/user";
    static instance: UserService;

    static getInstance() {
        if (UserService.instance) return UserService.instance;
        else {
            UserService.instance = new UserService();
            return UserService.instance;
        }
    }

    login = async (credentials: TUserCredentials) =>
        POST(UserService.url + "/login", credentials);
}
