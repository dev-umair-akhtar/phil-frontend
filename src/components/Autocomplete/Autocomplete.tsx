import {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
    Divider,
    Autocomplete as MUIAutoComplete,
    Pagination,
    Paper,
    TextField,
    TextFieldProps,
    useTheme,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { baseAPI } from "../../constants";

interface Props {
    api?: string;
    apiParams?: any;
    defaultOptions?: any[];
    label?: string;
    multiple?: boolean;
    setOutput: (value: any, event?: ChangeEvent<{}>) => void;
    labelKey: string;
    textFieldProps?: Partial<TextFieldProps>;
    clear?: boolean;
    processor?: (row: any) => any;
    defaultValue?: any;
    rowKey?: string;
}

interface ResponseType {
    [rowKey: string]: any;
    count: number;
    message?: string;
}

/**
 * @param {String} api
 * The backend API route to make the request to.
 * The response is assumed to be of type `ResponseType`
 *
 * @param {any} setOutput
 * The output state setter.
 * The setState function is called on the selected options.
 *
 * @param {any} apiParams
 * API parameters to pass to the options retriever function
 *
 * @param {any[]} defaultOptions
 * A set of default options. if `api` is not specified, these options will be used.
 *
 * @param {String} label
 * The label of the field
 *
 * @param {String} labelKey
 * The key to use to retrieve the label for each indivisual option from the option
 * object retrieved byt the options retriever
 *
 * @param {Boolean} multiple
 * specifies whether multiple options can be selected at a time
 *
 * @param {any} textFieldProps
 * Props to pass to the input textfield
 *
 * @param {boolean} clear
 * A boolean signal used to clear the selected value.
 *
 * @param {any} processor
 * A function of type `(any) => any`, that is applied to every option immediately after being fetched
 *
 * @param {any} defaultValue
 * Default value for the field. This must be an object that has the labelKey property and an ID
 *
 * @param {any} rowKey
 * The key  used to access rows from the network response data.
 */

export const Autocomplete = ({
    defaultOptions = [],
    apiParams,
    multiple = false,
    rowKey = "rows",
    ...props
}: Props) => {
    const [options, setOptions] = useState<any[]>(defaultOptions);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        count: 0,
    });
    const [selected, setSelected] = useState<any>(
        props?.defaultValue ?? multiple ? [] : null
    );
    const [search, setSearch] = useState("");

    const handleChange = (
        ev: ChangeEvent<{}>,
        value: any,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails
    ) => {
        setSelected(value);
        props.setOutput(value, ev);
    };

    const getAndPrepareOpts = async () => {
        console.log("it hits", props.label);
        const [success, message, _opts, _count] = await getOpts({
            rowKey,
            api: props.api,
            params: {
                ...apiParams,
                page: pagination.page,
                limit: pagination.limit,
                search: search.length ? search : undefined,
            },
            opts: defaultOptions,
        });

        let modOpts = _opts;

        if (props?.processor) {
            modOpts = modOpts.map(props.processor);
        }

        if (props?.defaultValue && !search) {
            const defaultInOpts = multiple
                ? modOpts.filter((opt: any) =>
                      props?.defaultValue
                          .map((df: any) => df.id)
                          .includes(opt.id)
                  )
                : modOpts.find((opt: any) => props?.defaultValue.id === opt.id);

            setSelected(defaultInOpts);
        }

        setOptions(modOpts);

        setPagination({
            ...pagination,
            count: _count,
            page: search.length ? 1 : pagination.page,
        });
    };

    useEffect(() => {
        getAndPrepareOpts();
    }, [
        pagination.page,
        pagination.limit,
        search,
        props?.api,
        props?.defaultValue,
        ...Object.values(apiParams || {}),
    ]);

    useEffect(() => {
        setSelected(!multiple ? null : []);
    }, [props.clear]);

    const handlePageChange = (ev: any, page: number) => {
        setPagination({ ...pagination, page });
    };

    const handleSelectAll = () => {
        if (multiple) {
            setSelected(options);
        }
    };

    return (
        <MUIAutoComplete
            value={selected}
            limitTags={1}
            getLimitTagsText={(more) => `+${more}`}
            multiple={multiple}
            options={options}
            renderInput={(params) =>
                RenderInput(
                    { ...params, ...props.textFieldProps, label: props.label },
                    { setSearch, search }
                )
            }
            getOptionLabel={(option: any) => {
                let out = "";
                try {
                    out = option[props.labelKey];
                } catch (err) {}
                return out;
            }}
            PaperComponent={(props) => (
                <Paper {...props} onMouseDown={(ev) => ev.preventDefault()}>
                    <PopupCompUpper
                        multiple={multiple}
                        handleSelectAll={handleSelectAll}
                    />
                    {props.children}
                    <PopupCompLower
                        pagination={{ handlePageChange, ...pagination }}
                    />
                </Paper>
            )}
            onChange={handleChange}
            disableCloseOnSelect={multiple}
            fullWidth
        />
    );
};

const getOpts = async ({ rowKey, api, opts, params = {} }: any) => {
    if (api) {
        try {
            const response = await axios.get<ResponseType>(baseAPI + api, {
                withCredentials: true,
                params,
            });
            return [
                true,
                response.data?.message ?? "Options retrieved successfully",
                response.data[rowKey] ?? [],
                response.data?.count ?? 0,
            ];
        } catch (err: any) {
            console.log("[Autocomplete][GetOpts]", err);
            return [
                false,
                err.response?.data?.message ?? "Failed to fetch the options",
                [],
                0,
            ];
        }
    } else if (opts && opts.length > 0) {
        return [true, "Options retrieved successfully", opts, opts.length];
    } else {
        return [true, "Options retrieved successfully", [], 0];
    }
};

const RenderInput = (params: any, { search, setSearch }: any) => {
    const handleSearch = (ev: ChangeEvent<any>) => {
        setSearch(ev.target.value);
    };

    return (
        <TextField
            {...params}
            value={search}
            onBlur={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
            }}
            onChange={handleSearch}
        />
    );
};

const PopupCompLower = (props: any) => {
    const theme = useTheme();

    return (
        <>
            <Divider />
            <Pagination
                size="small"
                onMouseDown={(ev) => {
                    ev.preventDefault();
                }}
                style={{
                    padding: theme.spacing(1, 0),
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
                onChange={props.pagination.handlePageChange}
                page={props.pagination.page}
                count={Math.ceil(
                    props.pagination.count / props.pagination.limit
                )}
            />
        </>
    );
};

const PopupCompUpper = (props: any) => {
    const theme = useTheme();

    return (
        <>
            {/* {props.multiple ? (
                <Button
                    size="small"
                    style={{ margin: theme.spacing(0.25, 1) }}
                    color="secondary"
                    onClick={props.handleSelectAll}
                >
                    Select all
                </Button>
            ) : null}
            <Divider /> */}
        </>
    );
};
