import {
    ArchiveOutlined,
    DeleteForeverOutlined,
    EditOutlined,
    ViewColumn,
    ViewColumnOutlined,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    Grid,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    MenuList,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

import {
    Dispatch,
    Fragment,
    ReactElement,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Authorize from "../Authorize";
import { AuthorizeFallback } from "../AuthorizeFallback";
import ConfirmDelete from "./ConfirmAction";
// import PrintTable from "../export/PrintTable";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { GetResult, Option } from "../../services/types";
import { EditInRUD } from "./Edit";
import { ParseTags } from "./ParseTags";

export type TRUDTableProps = {
    getter: (
        ...args: any
    ) => Promise<GetResult<Option<any>, Option<string>, Option<string[]>>>;
    editor?: (...args: any) => Promise<any[]>;
    deletor?: (ids: (string | number)[]) => Promise<any[]>;
    rowsPreprocessor?: (row) => object;
    ops: {
        read: string;
        edit?: string;
        delete?: string;
    };
    opsMessages?: {
        read?: string;
        edit?: string;
        delete?: string;
    };
    readables: { [key: string]: string };
    editables?: {
        name: string;
        type: "textfield" | "select" | "autocomplete";
        fieldProps?: any;
        label: string;
        permission?: string;
        options?: {
            value: any;
            label: string;
            valuesFetcher: (rowToEdit: any) => Promise<any[]>;
        };

        autocomplete?: {
            api?: string;
            labelKey: string;
            apiParams?: any;
            defaultValue?: any;
            label: string;
            defaultOptions?: any;
            preprocessor?: (row: any) => any;
        };
    }[];
    updatingAgents?: any[];
    parseTags?: boolean;
    deleteForever?: any;
    customCols?: { header: string; content: (row: any) => any }[];
    filters?: JSX.Element;
    selectedFilters?: ReactElement;
    defaultSelected?: string[];
    getSelectedRows?: (rows: any[]) => void;
    actions?: JSX.Element[];
    showAsGrid?: boolean;
};

const initialFeedback = {
    hidden: true,
    message: "",
    severity: "success",
    loading: false,
};

export const RUDTable = ({
    rowsPreprocessor = (row) => row,
    updatingAgents = [],
    defaultSelected = [],
    parseTags = false,
    showAsGrid = false,
    ...props
}: TRUDTableProps) => {
    const [rows, setRows] = useState<any[]>([]);
    const [rowsCount, setRowsCount] = useState(0);
    const [pagination, setPagination] = useState<any>({ page: 0, limit: 10 });
    const [feedback, setFeedback] = useState(initialFeedback);
    const [editOpen, setEditOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<null | any>(null);
    const [printMode, setPrintMode] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any>({
        item: null,
        open: false,
    });

    const [selectedCols, setSelectedCols] = useState(
        Object.keys(props.readables).filter(
            (k) => defaultSelected.includes(k) || defaultSelected.length === 0
        )
    );
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [changeCount, setChangeCount] = useState(0);
    const theme = useTheme();
    const tableRef = useRef<HTMLTableElement>(null);

    const allChecked = useMemo(() => {
        const rowsIds = rows.map((row) => row.id);
        const selectedRowsIds = selectedRows.map((row) => row.id);

        const checked = rowsIds
            .map((rowId) => selectedRowsIds.includes(rowId))
            .every((rowCheck) => rowCheck);

        // console.log(rowsIds, selectedRowsIds);

        return checked;
    }, [selectedRows, rows]);

    const handlePageChange = (ev: any, page: number) => {
        setPagination({ ...pagination, page: page });
        setSelectedRows([]);
    };

    const handleRowsPerPageChange = (ev: any) => {
        setPagination({ ...pagination, limit: ev.target.value });
    };

    const fetchRowsAndCount = async () => {
        setFeedback({ ...initialFeedback, loading: true });
        const { rows, count, successMessage, errMessage } = await props.getter(
            pagination.page + 1,
            pagination.limit
        );

        if (rows.some) {
            setRows(rows.some.map((r: any) => rowsPreprocessor(r)));
            setRowsCount((count.some as any) ?? 0);
            setFeedback({
                hidden: true,
                message: successMessage.some ?? "",
                severity: "success",
                loading: false,
            });
        } else {
            setFeedback({
                hidden: false,
                message: errMessage,
                severity: "error",
                loading: false,
            });
        }
    };

    const handleDeleteRow = async (id: number) => {
        if (!props.deletor) {
            return;
        }

        setFeedback({
            hidden: true,
            message: "",
            severity: "success",
            loading: true,
        });

        const [data, err] = await props.deletor([id]);

        if (data) {
            setFeedback({
                hidden: false,
                message: data.message,
                severity: "success",
                loading: false,
            });
            setChangeCount((n: number) => n + 1);
        } else {
            setFeedback({
                hidden: false,
                message: err,
                severity: "error",
                loading: false,
            });
        }
    };

    const handleEditRow = async (row: any) => {
        setRowToEdit(row);
        setEditOpen(true);
    };

    const handleSelectAllRows = (check: boolean) => {
        if (check) {
            setSelectedRows(
                (currentSelected) => rows
                // [
                //     ...currentSelected,
                //     ...rows.filter(
                //         (r) =>
                //             !currentSelected
                //                 .map((selectedRow) => selectedRow.id)
                //                 .includes(r.id)
                //     ),
                // ]
            );

            if (props.getSelectedRows) props.getSelectedRows(rows);
        } else {
            setSelectedRows((currentSelected) => {
                const filteredRows = currentSelected.filter(
                    (selectedRow) =>
                        !rows.map((r) => r.id).includes(selectedRow.id)
                );

                if (props.getSelectedRows) props.getSelectedRows(filteredRows);

                return filteredRows;
            });
        }
    };

    const handleSingleRowSelect = (check: boolean, row: any) => {
        if (check) {
            setSelectedRows((currentSelected) => {
                const updatedRows = [...currentSelected, row];

                if (props.getSelectedRows) props.getSelectedRows(updatedRows);

                return updatedRows;
            });
        } else {
            setSelectedRows((currentSeletect) => {
                const filteredRows = currentSeletect.filter(
                    (sr) => sr.id !== row.id
                );

                if (props.getSelectedRows) props.getSelectedRows(filteredRows);

                return filteredRows;
            });
        }
    };

    useEffect(() => {
        fetchRowsAndCount();
    }, [pagination, ...updatingAgents, changeCount]);

    if (showAsGrid) {
        return (
            <Grid2 container spacing={2}>
                {rows.map((row) => (
                    <Grid2 key={row.id} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <CardHeader
                                title={row?.title ?? row?.name}
                                action={
                                    <>
                                        {props.editor && props.editables && (
                                            <Authorize
                                                opName={props.ops.edit}
                                                fallback={
                                                    props.opsMessages?.edit ? (
                                                        <AuthorizeFallback
                                                            message={
                                                                props
                                                                    .opsMessages
                                                                    ?.edit
                                                            }
                                                        />
                                                    ) : null
                                                }
                                            >
                                                <TableCell>Edit</TableCell>
                                            </Authorize>
                                        )}
                                        <Authorize
                                            opName={props.ops.delete}
                                            fallback={
                                                props.opsMessages?.delete ? (
                                                    <AuthorizeFallback
                                                        message={
                                                            props.opsMessages
                                                                ?.delete
                                                        }
                                                    />
                                                ) : null
                                            }
                                        >
                                            {props.deletor ? (
                                                <TableCell>
                                                    {props.deleteForever
                                                        ? "Delete"
                                                        : "Archive"}
                                                </TableCell>
                                            ) : null}
                                        </Authorize>
                                    </>
                                }
                            />

                            <CardContent
                                sx={{
                                    maxHeight: theme.spacing(36),
                                    overflowY: "auto",
                                }}
                            ></CardContent>
                        </Card>
                    </Grid2>
                ))}

                <Grid2 xs={12}>
                    <TablePagination
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        count={rowsCount}
                        rowsPerPage={pagination.limit}
                        component="div"
                        page={pagination.page}
                        style={{ flex: "1" }}
                    />
                </Grid2>
            </Grid2>
        );
    }

    return (
        <Authorize
            opName={props.ops.read}
            fallback={
                props.opsMessages?.read ? (
                    <AuthorizeFallback message={props.opsMessages?.read} />
                ) : null
            }
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {props.filters && props.filters}

                    {/* <PrintTable
                            printMode={printMode}
                            setPrintMode={setPrintMode}
                            componentRef={tableRef}
                        /> */}

                    <RUDTableCols
                        readables={props.readables}
                        selected={selectedCols}
                        setSelected={setSelectedCols}
                    />
                </div>

                {props.actions &&
                    props.actions.map((action, index) => (
                        <Fragment key={index}>{action}</Fragment>
                    ))}
            </Box>

            <Grid
                container
                spacing={2}
                justifyContent="space-between"
                style={{
                    padding: theme.spacing(2),
                    width: "100%",
                }}
            >
                {/* <Grid item xs={12} md={6} lg={4}></Grid> */}
            </Grid>

            {rowToEdit && props.editables && props.editor && (
                <EditInRUD
                    row={rowToEdit}
                    editables={props.editables as any}
                    open={editOpen}
                    setOpen={setEditOpen}
                    editor={props.editor}
                    setChangeCount={setChangeCount}
                />
            )}

            {/* {props.selectedFilters && props.selectedFilters} */}
            <div ref={tableRef}>
                <TableContainer>
                    <div>
                        {feedback.loading ? <LinearProgress /> : null}
                        <section hidden={feedback.hidden}>
                            <Alert severity={feedback.severity as any}>
                                {feedback.message}
                            </Alert>
                        </section>
                    </div>

                    <Table>
                        <TableHead>
                            <TableRow>
                                {props.getSelectedRows && (
                                    <TableCell>
                                        <Tooltip title="Select All">
                                            <FormControl>
                                                <Checkbox
                                                    color="primary"
                                                    checked={allChecked}
                                                    onChange={(e, check) =>
                                                        handleSelectAllRows(
                                                            check
                                                        )
                                                    }
                                                    indeterminate={Boolean(
                                                        !allChecked &&
                                                            selectedRows.length
                                                    )}
                                                />
                                            </FormControl>
                                        </Tooltip>
                                    </TableCell>
                                )}

                                <TableCell>S No.</TableCell>

                                {selectedCols
                                    .filter((key) => selectedCols.includes(key))
                                    .map((col) => (
                                        <TableCell
                                            key={col}
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            {props.readables[col]}
                                        </TableCell>
                                    ))}

                                {props.customCols?.map((col) => (
                                    <TableCell key={col.header}>
                                        {col.header}
                                    </TableCell>
                                ))}

                                {props.editor && props.editables && (
                                    <Authorize
                                        opName={props.ops.edit}
                                        fallback={
                                            props.opsMessages?.edit ? (
                                                <AuthorizeFallback
                                                    message={
                                                        props.opsMessages?.edit
                                                    }
                                                />
                                            ) : null
                                        }
                                    >
                                        <TableCell>Edit</TableCell>
                                    </Authorize>
                                )}

                                <Authorize
                                    opName={props.ops.delete}
                                    fallback={
                                        props.opsMessages?.delete ? (
                                            <AuthorizeFallback
                                                message={
                                                    props.opsMessages?.delete
                                                }
                                            />
                                        ) : null
                                    }
                                >
                                    {props.deletor ? (
                                        <TableCell>
                                            {props.deleteForever
                                                ? "Delete"
                                                : "Archive"}
                                        </TableCell>
                                    ) : null}
                                </Authorize>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    selected={selectedRows
                                        .map((row) => row.id)
                                        .includes(row.id)}
                                >
                                    {props.getSelectedRows && (
                                        <TableCell>
                                            <FormControl>
                                                <Checkbox
                                                    color="primary"
                                                    checked={selectedRows
                                                        .map((row) => row.id)
                                                        .includes(row.id)}
                                                    onChange={(e, check) =>
                                                        handleSingleRowSelect(
                                                            check,
                                                            row
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        {pagination.page > 0
                                            ? pagination.page *
                                                  pagination.limit +
                                              idx +
                                              1
                                            : idx + 1}
                                    </TableCell>

                                    {selectedCols.map((col) => (
                                        <TableCell key={col}>
                                            {parseTags ? (
                                                <ParseTags text={row[col]} />
                                            ) : (
                                                row[col]
                                            )}
                                        </TableCell>
                                    ))}

                                    {props.customCols?.map((col) => (
                                        <TableCell key={col.header}>
                                            {col.content(row)}
                                        </TableCell>
                                    ))}

                                    {props.editor && props.editables && (
                                        <Authorize
                                            opName={props.ops.edit}
                                            fallback={
                                                props.opsMessages?.edit ? (
                                                    <AuthorizeFallback
                                                        message={
                                                            props.opsMessages
                                                                ?.edit
                                                        }
                                                    />
                                                ) : null
                                            }
                                        >
                                            <TableCell
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    handleEditRow(row)
                                                }
                                                title="Edit"
                                            >
                                                <EditOutlined />
                                            </TableCell>
                                        </Authorize>
                                    )}

                                    {props.deletor && (
                                        <Authorize
                                            opName={props.ops.delete}
                                            fallback={
                                                props.opsMessages?.delete ? (
                                                    <AuthorizeFallback
                                                        message={
                                                            props.opsMessages
                                                                ?.delete
                                                        }
                                                    />
                                                ) : null
                                            }
                                        >
                                            <TableCell
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    setDeleteItem({
                                                        item: row.deletionId,
                                                        open: true,
                                                    })
                                                }
                                                title="Archive/Delete"
                                            >
                                                {props.deleteForever ? (
                                                    <DeleteForeverOutlined />
                                                ) : (
                                                    <ArchiveOutlined />
                                                )}
                                            </TableCell>
                                        </Authorize>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    count={rowsCount}
                    rowsPerPage={pagination.limit}
                    component="div"
                    page={pagination.page}
                    style={{ flex: "1" }}
                />
            </div>

            <ConfirmDelete
                open={deleteItem.open}
                setOpen={(v: boolean) =>
                    setDeleteItem({ ...deleteItem, open: v })
                }
                next={() => handleDeleteRow(deleteItem.item)}
                actionOpts={
                    props.deleteForever
                        ? undefined
                        : {
                              accept: "Archive",
                              reject: "Cancel",
                              title: "Archive",
                              text: "Are you sure you want to archive this item? it will be available in the archive section",
                          }
                }
            />
        </Authorize>
    );
};

type RUDTableColsProps = {
    readables: object;
    selected: string[];
    setSelected: Dispatch<SetStateAction<string[]>>;
};

const RUDTableCols = ({
    readables,
    selected,
    setSelected,
}: RUDTableColsProps) => {
    const [showColumns, setShowColumns] = useState(false);
    const showColumnsBtn = useRef<HTMLButtonElement | null>(null);

    const theme = useTheme();

    return (
        <>
            <Tooltip title="Select Columns">
                <IconButton
                    ref={showColumnsBtn}
                    onClick={() => setShowColumns(true)}
                >
                    {showColumns ? (
                        <ViewColumn htmlColor={theme.palette.primary.main} />
                    ) : (
                        <ViewColumnOutlined />
                    )}
                </IconButton>
            </Tooltip>

            <Menu
                open={showColumns}
                anchorEl={showColumnsBtn.current}
                onClose={() => setShowColumns(false)}
                elevation={4}
                variant="menu"
            >
                <MenuList
                    disablePadding
                    style={{ padding: theme.spacing(0, 1) }}
                >
                    {Object.entries(readables).map(([key, col]) => (
                        <MenuItem
                            key={key}
                            value={key}
                            selected={selected.includes(key)}
                            style={{ paddingLeft: 0 }}
                            onClick={() =>
                                !selected.includes(key)
                                    ? setSelected((state) => [...state, key])
                                    : setSelected((state) =>
                                          state.filter((c) => c !== key)
                                      )
                            }
                        >
                            <Checkbox
                                size="small"
                                checked={selected.includes(key)}
                                color="primary"
                            />

                            <Typography>{col}</Typography>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </>
    );
};
