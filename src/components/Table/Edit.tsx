import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    LinearProgress,
    MenuItem,
    TextField,
} from "@mui/material";

import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { notConnectedMessage } from "../../constants";
import { Autocomplete } from "../Autocomplete/Autocomplete";

type Props = {
    row: any;
    editables: {
        name: string;
        type: "textfield" | "select" | "autocomplete";
        fieldProps?: any;
        label: string;
        permission?: string;
        options?: {
            value: any;
            label: string;
            valuesFetcher: (row: any) => Promise<any[]>;
        };

        autocomplete?: {
            api?: string;
            labelKey?: string;
            apiParams?: any;
            defaultValue?: any;
            label?: string;
            defaultOptions?: any;
            preprocessor?: (row: any) => any;
        };
    }[];
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    editor: (...args: any) => Promise<any[]>;
    setChangeCount: Dispatch<SetStateAction<number>>;
};

const initialFeedback = {
    hidden: true,
    message: "",
    severity: "success",
    loading: false,
};

export const EditInRUD = ({
    row,
    editables,
    open,
    setOpen,
    editor,
    setChangeCount,
}: Props) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [feedback, setFeedback] = useState(initialFeedback);
    const initialObject = useMemo(() => {
        const obj: any = {};
        for (const editable of editables) {
            obj[editable.name] = {
                value: row[editable.name] || "",
                changed: false,
            };
        }
        return obj;
    }, [open]);

    const [values, setValues] = useState<any>({});
    const [selectedValue, setSelectedValue] = useState<any>();

    const [newRow, setNewRow] = useState<any>(row);

    const handleClose = () => {
        setOpen(false);
        setNewRow({});
        setFeedback(initialFeedback);
    };

    const handleChange = (ev: ChangeEvent<any>) => {
        setNewRow({
            ...newRow,
            [ev.target.name]: { value: ev.target.value, changed: true },
        });
    };

    const handleEdit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setFeedback({ ...initialFeedback, loading: true });
        const finalRow: any = {};

        for (const [rowKey, rowValue] of Object.entries(newRow)) {
            if ((rowValue as any).changed) {
                finalRow[rowKey] = (rowValue as any).value;
            }
        }

        const [data, err] = await editor(row.id, finalRow);

        if (data) {
            setFeedback({
                message: data.message,
                severity: "success",
                loading: false,
                hidden: false,
            });
            setChangeCount((n: number) => n + 1);
        } else {
            setFeedback({
                message: err || notConnectedMessage,
                severity: "error",
                loading: false,
                hidden: false,
            });
        }
    };

    const fetchSelectOptions = async () => {
        for (const ed of editables.filter((e) => e.type === "select")) {
            const [data, err] = await ed.options!.valuesFetcher(row);
            if (data) {
                setValues((vals: any) => ({ ...vals, [ed.name]: data.rows }));
            }
        }
    };

    useEffect(() => {
        fetchSelectOptions();
    }, []);

    useEffect(() => {
        setNewRow(initialObject);
    }, [initialObject]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Edit</DialogTitle>
            <div>
                {feedback.loading ? <LinearProgress /> : null}
                <section hidden={feedback.hidden}>
                    <Alert severity={feedback.severity as any}>
                        {feedback.message}
                    </Alert>
                </section>
            </div>

            <form onSubmit={handleEdit} ref={formRef}>
                {newRow &&
                    editables.map((editable, idx: number) => {
                        const processedRow = editable.autocomplete?.preprocessor
                            ? editable.autocomplete.preprocessor(row)
                            : row;

                        switch (editable.type) {
                            case "textfield":
                                return (
                                    <TextField
                                        key={idx}
                                        name={editable.name}
                                        label={editable.label}
                                        variant="outlined"
                                        fullWidth
                                        value={newRow[editable?.name]?.value}
                                        onChange={handleChange}
                                        {...editable.fieldProps}
                                    />
                                );

                            case "select":
                                return (
                                    <TextField
                                        key={idx}
                                        select
                                        name={editable.name}
                                        label={editable.label}
                                        variant="outlined"
                                        fullWidth
                                        value={newRow[editable?.name]?.value}
                                        onChange={handleChange}
                                        {...editable.fieldProps}
                                        var
                                    >
                                        {values[editable.name]?.map(
                                            (opt: any) => (
                                                <MenuItem
                                                    key={
                                                        opt[
                                                            editable.options!
                                                                .value
                                                        ]
                                                    }
                                                    value={
                                                        opt[
                                                            editable.options!
                                                                .value
                                                        ]
                                                    }
                                                >
                                                    {
                                                        opt[
                                                            editable.options!
                                                                .label
                                                        ]
                                                    }
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                );

                            case "autocomplete": {
                                return editable.autocomplete ? (
                                    <>
                                        <Autocomplete
                                            api={editable.autocomplete.api}
                                            labelKey={
                                                editable.autocomplete.labelKey!
                                            }
                                            label={editable.autocomplete.label}
                                            defaultValue={
                                                row[
                                                    editable.autocomplete
                                                        .defaultValue
                                                ]
                                            }
                                            setOutput={(value: any) => {
                                                setNewRow({
                                                    ...newRow,
                                                    [editable.name]: {
                                                        changed: true,
                                                        value:
                                                            value?.id || null,
                                                    },
                                                });

                                                setSelectedValue(value?.id);
                                            }}
                                            defaultOptions={
                                                editable.autocomplete
                                                    .defaultOptions
                                            }
                                            textFieldProps={{
                                                variant: "outlined",
                                            }}
                                            apiParams={
                                                editable.autocomplete.apiParams
                                                    ? {
                                                          [editable.autocomplete
                                                              .apiParams]:
                                                              selectedValue
                                                                  ? selectedValue
                                                                  : newRow[
                                                                        editable
                                                                            ?.autocomplete
                                                                            ?.apiParams
                                                                    ]?.value
                                                                        ?.id,
                                                      }
                                                    : null
                                            }
                                        />
                                    </>
                                ) : null;
                            }

                            default:
                                return <TextField />;
                        }
                    })}
            </form>
            <DialogActions>
                <Button onClick={() => setOpen(false)} variant="outlined">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        formRef.current?.requestSubmit();
                    }}
                >
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
