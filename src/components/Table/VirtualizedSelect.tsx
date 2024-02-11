import { Box, IconButton, Menu, MenuItem, TextField } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import {
    ChangeEvent,
    Dispatch,
    MouseEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { APIRequestStatus } from "../constants";
import { ParseTags } from "../ParseTags";
import "./VirtualizedSelect.css";

type Props = {
    label: string;
    valuesFetcher: (page: number, limit: number, filter: any) => Promise<any[]>;
    value: string;
    setValue: Dispatch<SetStateAction<any>>;
};

export const VirtualizedSelect = ({
    label,
    value,
    valuesFetcher,
    setValue,
}: Props) => {
    const ref = useRef<any>(null);
    const isWaiting = useRef(0);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        count: 0,
    });
    const [search, setSearch] = useState("");
    const [feedback, setFeedback] = useState({
        message: "",
        status: APIRequestStatus.idle,
    });
    const [selected, setSelected] = useState<any>(null);

    const handleDropdown = (ev: MouseEvent<any>) => {
        anchorEl ? setAnchorEl(null) : setAnchorEl(ev.target);
    };

    const handleSearchChange = (ev: ChangeEvent<any>) => {
        isWaiting.current++;

        const newIsWaitingValue = isWaiting.current;

        setTimeout(() => {
            if (isWaiting.current === newIsWaitingValue) {
                setSearch(ev.target.value);
                isWaiting.current = 0;
            }
        }, 1 * 1000);
    };

    const fetchRowsAndCount = async () => {
        setFeedback({ message: "", status: APIRequestStatus.loading });

        const [data, err] = await valuesFetcher(
            pagination.page,
            pagination.limit,
            { search: search || undefined }
        );

        if (data) {
            setRows(data.rows ?? []);
            setPagination({ ...pagination, count: data.count ?? 0 });
            setFeedback({
                message: data.message || "",
                status: APIRequestStatus.success,
            });
        } else {
            setFeedback({ message: err || "", status: APIRequestStatus.error });
        }
    };

    useEffect(() => {
        fetchRowsAndCount();
    }, [pagination.page, pagination.limit, search]);

    return (
        <Box style={{ margin: "60px" }}>
            <TextField
                ref={ref}
                value={selected ? selected[value] : ""}
                placeholder={label}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleDropdown}>
                            <ArrowDropDown />
                        </IconButton>
                    ),
                }}
                inputProps={{ style: { padding: "0px" } }}
            />
            <Menu
                onClose={() => setAnchorEl(null)}
                open={Boolean(anchorEl)}
                anchorEl={ref.current}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                id="Menu"
            >
                {rows.length > 0 && (
                    <Box>
                        <TextField
                            name="search"
                            value={search}
                            onChange={handleSearchChange}
                            variant="outlined"
                            size="small"
                            label="Search"
                        />
                    </Box>
                )}
                {rows.map((row) => (
                    <MenuItem
                        style={{ width: "100%", alignSelf: "flex-start" }}
                        key={row.id}
                        value={row.id}
                        onClick={(ev) => {
                            setSelected(row);
                            setValue(row.id);
                            setAnchorEl(null);
                        }}
                        selected={selected && selected.id === row.id}
                    >
                        <ParseTags text={row[value]} />
                    </MenuItem>
                ))}
                {rows.length === 0 && <MenuItem>No Items</MenuItem>}
                {rows.length > 0 && (
                    <Box>
                        <Pagination
                            count={
                                Math.trunc(
                                    pagination.count / pagination.limit
                                ) + 1
                            }
                            page={pagination.page}
                            onChange={(ev, _page) =>
                                setPagination({
                                    ...pagination,
                                    page: _page,
                                })
                            }
                        />
                    </Box>
                )}
            </Menu>
        </Box>
    );
};
