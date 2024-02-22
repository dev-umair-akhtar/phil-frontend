import { BlindsClosed, Money } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    useTheme,
} from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ChangeEvent, FormEvent, useState } from "react";
import Dashboard from "../../components/layout/Dashboard";
import { initialFeedback } from "../../hooks/useUploadTemplate";
import {
    ProjectService,
    TCreateProjectPayload,
} from "../../services/ProjectService";

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

const variantNos = [
    { label: "VRTYPE - 1", value: 1 },
    { label: "VRTYPE - 2", value: 2 },
    { label: "VRTYPE - 3", value: 3 },
    { label: "VRTYPE - 4", value: 4 },
    { label: "VRTYPE - 5", value: 5 },
];

const languages = [
    { label: "LNG - 1", value: "option one" },
    { label: "LNG - 2", value: "option two" },
    { label: "LNG - 3", value: "option three" },
    { label: "LNG - 4", value: "option four" },
    { label: "LNG - 5", value: "option five" },
];

const currencies = [
    { label: "CRC - 1", value: "option one", icon: <Money /> },
    { label: "CRC - 2", value: "option two", icon: <BlindsClosed /> },
    { label: "CRC - 3", value: "option three", icon: <Money /> },
];

const initialProject: TCreateProjectPayload = {
    acronym: "",
    owner: "",
    globalRegion: "[]",
    country: "[]",
    background: "",
    objective: "",
    assignmentType: "",
    clientAddress: "",
    clientCompletionCertificate: false,
    clientName: "",
    clientReferenceContract: "",
    companyProjectValue: 0,
    consortiumPartners: "",
    consortiumPartnersStaffMonths: 0,
    consortiumPartnersStaffTime: 0,
    currency: "",
    durationMonths: 0,
    startDate: "",
    endDate: "",
    title: "",
    referenceId: "",
    servicesDescription: "",
    managementStaff: "",
    professionalStaff: "",
    internalNotes: "",
    variantType: "",
    variantNo: 1,
    language: "",
    locationInCountry: "",
    totalProjectValue: 0,
    fundingOrigin: "",
    isCompanyLeadConsultant: false,
    noOfProfessionalStaffProvided: 0,
    noStaffTimeUnits: 0,
    totalCalculatedProjectValueEUR: 0,
    totalCalculatedProjectValueUSD: 0,
    proportionByLegalEntity: 0,
    monthsOwnStaff: 0,
    totalMonthsAllStaff: 0,
    keyReference: false,
    fieldsOfOperation: "[]",
    fieldOfOperationDominant: "",
    typeOfService: "[]",
    typeOfServiceDominant: "",
};

function CreateProjectPage() {
    const [project, setProject] = useState(initialProject);
    const [feedback, setFeedback] = useState(initialFeedback);
    //
    const theme = useTheme();

    //
    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setProject({ ...project, [event.target.name]: event.target.value });

    const handleSelectChange = (event: SelectChangeEvent<HTMLInputElement>) =>
        setProject({
            ...project,
            [event.target.name]: JSON.stringify(event.target.value),
        });

    //
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setFeedback((f) => ({ ...f, loading: true }));

        const res = await ProjectService.getInstance().createProject(project);

        if (res.entity.isSome()) {
            console.log(res.entity);
            setFeedback({
                loading: false,
                messege: res.successMessage.isSome() ? res.successMessage : "",
                severity: "success",
                show: true,
            });
        } else {
            console.log(res.errMessage);
            setFeedback({
                loading: false,
                messege: res.errMessage.toJSON() ?? "",
                severity: "error",
                show: true,
            });
        }
    }

    return (
        <Dashboard title="Create Project">
            <Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Project No. - Acronym"
                                name="acronym"
                                value={project.acronym}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Reference Owner"
                                name="owner"
                                value={project.owner}
                                onChange={handleChange}
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
                                    value={JSON.parse(project.globalRegion)}
                                    variant="outlined"
                                    label="Global Region"
                                    name="globalRegion"
                                    onChange={handleSelectChange}
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
                                    value={JSON.parse(project.country)}
                                    variant="outlined"
                                    name="country"
                                    label="Countries"
                                    onChange={handleSelectChange}
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
                                name="title"
                                value={project.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Project Objective"
                                name="objective"
                                value={project.objective}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Project Background"
                                name="background"
                                value={project.background}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Description of actual services"
                                name="serviceDescription"
                                value={project.servicesDescription}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Management staff of your company"
                                name="managementStaff"
                                value={project.managementStaff}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Professional staff provided by your company"
                                name="professionalStaff"
                                value={project.professionalStaff}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                label="Internal notes"
                                name="internalNotes"
                                value={project.internalNotes}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <FormControl fullWidth>
                                <TextField
                                    select
                                    value={project.variantType}
                                    name="variantType"
                                    onChange={handleChange}
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

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Variant No."
                                name="variantNo"
                                value={project.variantNo}
                                onChange={handleChange}
                                children={variantNos.map((varNo) => (
                                    <MenuItem
                                        key={varNo.value}
                                        value={varNo.value}
                                    >
                                        {varNo.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Language of input data"
                                value={project.language}
                                name="language"
                                onChange={handleChange}
                                children={languages.map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="date"
                                label="Start Date"
                                name="startDate"
                                value={project.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="date"
                                label="End Date"
                                name="endDate"
                                value={project.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="text"
                                label="Location within country"
                                name="locationInCountry"
                                value={project.locationInCountry}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="text"
                                label="Name of client"
                                name="clientName"
                                value={project.clientName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                                type="text"
                                label="Addresss of client"
                                name="clientAddress"
                                value={project.clientAddress}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="text"
                                label="Client Reference Contract"
                                name="clientReferenceContract"
                                value={project.clientReferenceContract}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                type="text"
                                label="Project Currency"
                                name="currency"
                                value={project.currency}
                                onChange={handleChange}
                                children={currencies.map((currency) => (
                                    <MenuItem
                                        key={currency.value}
                                        value={currency.value}
                                    >
                                        {currency.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Total Project Value"
                                value={project.totalProjectValue}
                                name="totalProjectValue"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Project value of your company"
                                value={project.companyProjectValue}
                                name="companyProjectValue"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Funding origin"
                                value={project.fundingOrigin}
                                name="fundingOrigin"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Your company is lead consultant"
                                value={project.isCompanyLeadConsultant}
                                name="isCompanyLeadConsultant"
                                onChange={handleChange}
                                children={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ].map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Assignment Type"
                                value={project.assignmentType}
                                name="assignmentType"
                                onChange={handleChange}
                                children={languages.map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Number of professional staff provided by the company"
                                value={project.noOfProfessionalStaffProvided}
                                name="noOfProfessionalStaffProvided"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Input unit of professional staff time"
                                value={project.noStaffTimeUnits}
                                name="noStaffTimeUnits"
                                onChange={handleChange}
                                children={languages.map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Professional staff time provided by your company"
                                value={project.noStaffTimeUnits}
                                name="noStaffTimeUnits"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Name of consortium partner (s)"
                                value={project.consortiumPartners}
                                name="consortiumPartners"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Professional staff time of consortium partner (s)"
                                value={project.consortiumPartnersStaffTime}
                                name="consortiumPartnersStaffTime"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Calculated total project value (EUR)"
                                value={project.totalCalculatedProjectValueEUR}
                                name="totalCalculatedProjectValueEUR"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Calculated total project value (USD)"
                                value={project.totalCalculatedProjectValueUSD}
                                name="totalCalculatedProjectValueUSD"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Proportion carried out by legal entity (%)"
                                value={project.proportionByLegalEntity}
                                name="proportionByLegalEntity"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                label="Duration (months)"
                                type="number"
                                value={project.durationMonths}
                                name="durationMonths"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                label="Total months of own staff"
                                type="number"
                                value={project.monthsOwnStaff}
                                name="monthsOwnStaff"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                label="Total months of staff from consortium partner (s)"
                                type="number"
                                value={project.consortiumPartnersStaffMonths}
                                name="durationMonths"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                label="Total months all staff"
                                type="number"
                                value={project.totalMonthsAllStaff}
                                name="totalMonthsAllStaff"
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Key reference"
                                value={project.keyReference}
                                name="keyReference"
                                onChange={handleChange}
                                children={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ].map((language, index) => (
                                    <MenuItem
                                        key={index}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Client completion certificate"
                                value={project.clientCompletionCertificate}
                                name="clientCompletionCertificate"
                                onChange={handleChange}
                                children={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ].map((language, index) => (
                                    <MenuItem
                                        key={index}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <FormControl fullWidth>
                                <InputLabel>Fields of operation</InputLabel>
                                <Select
                                    multiple
                                    value={JSON.parse(
                                        project.fieldsOfOperation
                                    )}
                                    variant="outlined"
                                    name="fieldsOfOperation"
                                    label="Fields of operation"
                                    onChange={handleSelectChange}
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

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Fields of operation dominant"
                                value={project.fieldOfOperationDominant}
                                name="fieldOfOperationDominant"
                                onChange={handleChange}
                                children={languages.map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <FormControl fullWidth>
                                <InputLabel>Type of service</InputLabel>
                                <Select
                                    multiple
                                    value={JSON.parse(project.typeOfService)}
                                    variant="outlined"
                                    name="typeOfService"
                                    label="Type of service"
                                    onChange={handleSelectChange}
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

                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Type of service dominant"
                                value={project.typeOfServiceDominant}
                                name="typeOfServiceDominant"
                                onChange={handleChange}
                                children={languages.map((language) => (
                                    <MenuItem
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={feedback.loading}
                                startIcon={
                                    feedback.loading ? (
                                        <CircularProgress
                                            size={theme.spacing(2)}
                                        />
                                    ) : undefined
                                }
                            >
                                {feedback.loading
                                    ? "creating..."
                                    : "create project"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Snackbar
                open={feedback.show}
                onClose={() => setFeedback(initialFeedback)}
                autoHideDuration={5000}
            >
                <Alert severity={feedback.severity}>{feedback.messege}</Alert>
            </Snackbar>
        </Dashboard>
    );
}
