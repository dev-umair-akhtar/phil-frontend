import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import Dashboard from "../../components/layout/Dashboard";

export const Route = createLazyFileRoute("/project/create")({
    component: CreateProjectPage,
});

const referenceOwners = [
    { label: "OPT - 1", value: "option one" },
    { label: "OPT - 2", value: "option two" },
    { label: "OPT - 3", value: "option three" },
    { label: "OPT - 4", value: "option four" },
    { label: "OPT - 5", value: "option five" },
];

const globalRegions = [
    { label: "REG - 1", value: "option one" },
    { label: "REG - 2", value: "option two" },
    { label: "REG - 3", value: "option three" },
    { label: "REG - 4", value: "option four" },
    { label: "REG - 5", value: "option five" },
];

const countries = [
    { label: "CNT - 1", value: "option one" },
    { label: "CNT - 2", value: "option two" },
    { label: "CNT - 3", value: "option three" },
    { label: "CNT - 4", value: "option four" },
    { label: "CNT - 5", value: "option five" },
];

const variantTypes = [
    { label: "VRTYPE - 1", value: "option one" },
    { label: "VRTYPE - 2", value: "option two" },
    { label: "VRTYPE - 3", value: "option three" },
    { label: "VRTYPE - 4", value: "option four" },
    { label: "VRTYPE - 5", value: "option five" },
];

function CreateProjectPage() {
    return (
        <Dashboard title="Create Project">
            <Box>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Project No. - Acronym"
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Reference Owner"
                                children={referenceOwners.map((owner) => (
                                    <MenuItem
                                        key={owner.value}
                                        value={owner.value}
                                    >
                                        {owner.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel>Global Region</InputLabel>
                                <Select
                                    multiple
                                    value={[]}
                                    variant="outlined"
                                    label="Global Region"
                                    children={globalRegions.map((region) => (
                                        <MenuItem
                                            key={region.value}
                                            value={region.value}
                                        >
                                            {region.label}
                                        </MenuItem>
                                    ))}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel>Countries</InputLabel>
                                <Select
                                    multiple
                                    value={[]}
                                    variant="outlined"
                                    label="Countries"
                                    children={countries.map((country) => (
                                        <MenuItem
                                            key={country.value}
                                            value={country.value}
                                        >
                                            {country.label}
                                        </MenuItem>
                                    ))}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Project Title"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Project Objective"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Project Background"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Description of actual services"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Management staff of your company"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Professional staff provided by your company"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Internal notes"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Internal notes"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Variant Type</InputLabel>
                                <Select
                                    multiple
                                    value={[]}
                                    variant="outlined"
                                    label="Variant Type"
                                    children={variantTypes.map((type) => (
                                        <MenuItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Variant No."
                                children={referenceOwners.map((owner) => (
                                    <MenuItem
                                        key={owner.value}
                                        value={owner.value}
                                    >
                                        {owner.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Language of input data"
                                children={referenceOwners.map((owner) => (
                                    <MenuItem
                                        key={owner.value}
                                        value={owner.value}
                                    >
                                        {owner.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>
                    </Grid>
                </form>
            </Box>
            ;
        </Dashboard>
    );
}
