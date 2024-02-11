export class Result<Data, Err> {
    data: Data | null;
    err: Err | null;

    constructor(data: Data | null, err: Err | null) {
        this.data = data;
        this.err = err;
    }

    public isErr(): boolean {
        return this.err !== null;
    }

    public unwrap() {
        if (this.data) {
            return this.data;
        }

        throw new Error(`Unwrap on err: ${this.err}`);
    }

    public match(onData: (data: Data) => void, onErr: (err: Err) => void) {
        if (this.data) {
            onData(this.data);
        } else {
            onErr(this.err!);
        }
    }

    public toJSON() {
        return this.data === null ? null : this.data;
    }
}

export class Option<T> {
    some: T | null;

    constructor(value: T | null) {
        this.some = value;
    }

    public isSome(): boolean {
        return this.some !== null;
    }

    public match(onData: (value: T) => void, onErr: () => void) {
        if (this.some) {
            onData(this.some);
        } else {
            onErr();
        }
    }

    public toJSON() {
        return this.some === null ? null : this.some;
    }
}

export type GetResult<Ent, SuccessMessage = string, ErrMessage = string> = {
    rows: Option<Ent[]>;
    count: Option<number>;
    successMessage: Option<SuccessMessage>;
    errMessage: Option<ErrMessage>;
};

export type PostResult<Ent, SuccessMessage = string, ErrMessage = string> = {
    entity: Option<Ent>;
    successMessage: Option<SuccessMessage>;
    errMessage: Option<ErrMessage>;
};

export function createPostResult<Ent, SuccessMessage, ErrMessage>(
    entity: Ent,
    successMessage: SuccessMessage,
    errMessage: ErrMessage
): PostResult<Ent, SuccessMessage, ErrMessage> {
    return {
        entity: new Option<Ent>(entity),
        successMessage: new Option<SuccessMessage>(successMessage),
        errMessage: new Option<ErrMessage>(errMessage),
    };
}

export function createGetResult<Ent, SuccessMessage, ErrMessage>(
    rows: Ent[],
    successMessage: SuccessMessage,
    errMessage: ErrMessage
): GetResult<Ent, SuccessMessage, ErrMessage> {
    return {
        rows: new Option<Ent[]>(rows),
        count: new Option(rows.length),
        successMessage: new Option<SuccessMessage>(successMessage),
        errMessage: new Option<ErrMessage>(errMessage),
    };
}
