import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
} from "@mui/material";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    next: () => any;
    actionOpts?: {
        accept: string;
        reject: string;
        text: string;
        title: string;
    };
}

const defaultActionOpts = {
    accept: "Delete",
    reject: "Cancel",
    title: "Permanently Delete",
    text: "This will irreversibly delete the item, continue?",
};

const ConfirmDelete = ({
    open,
    setOpen,
    next,
    actionOpts = defaultActionOpts,
}: Props) => {
    const theme = useTheme();
    return (
        <Dialog open={open} fullWidth>
            <DialogTitle>{actionOpts.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{actionOpts.text}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="text"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(false);
                    }}
                >
                    {actionOpts.reject}
                </Button>

                <Button
                    variant="text"
                    style={{ color: theme.palette.error.main }}
                    onClick={(e) => {
                        e.stopPropagation();
                        next();
                        setOpen(false);
                    }}
                >
                    {actionOpts.accept}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDelete;
