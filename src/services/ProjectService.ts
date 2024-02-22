import { GET, POST } from "./GlobalService";
import { GetResult, Option, PostResult } from "./types";

export type TProjectRow = {
    title: string;
    background: string;
    objective: string;
    creatorRef: null | number;
    id: number;
    version: number;
    createdAt: string;
    updatedAt: string;
};

export type TCreateProjectPayload = {
    title: string;
    background: string;
    objective: string;
    referenceId: string;
    acronym: string;
    owner: string;
    globalRegion: string;
    country: string;
    servicesDescription: string;
    managementStaff: string;
    professionalStaff: string;
    internalNotes: string;
    variantType: string;
    variantNo: number;
    language: string;
    startDate: string;
    endDate: string;
    locationInCountry: string;
    clientName: string;
    clientAddress: string;
    clientReferenceContract: string;
    totalProjectValue: number;
    companyProjectValue: number;
    currency: string;
    fundingOrigin: string;
    isCompanyLeadConsultant: boolean;
    assignmentType: string;
    noOfProfessionalStaffProvided: number;
    noStaffTimeUnits: number;
    consortiumPartners: string;
    consortiumPartnersStaffTime: number;
    totalCalculatedProjectValueEUR: number;
    totalCalculatedProjectValueUSD: number;
    proportionByLegalEntity: number;
    durationMonths: number;
    monthsOwnStaff: number;
    consortiumPartnersStaffMonths: number;
    totalMonthsAllStaff: number;
    keyReference: boolean;
    clientCompletionCertificate: boolean;
    fieldsOfOperation: string;
    fieldOfOperationDominant: string;
    typeOfService: string;
    typeOfServiceDominant: string;
};

export type TReadProjectsFilter = {
    search?: string;
};

interface IProjectService {
    createProject: (
        payload: TCreateProjectPayload
    ) => Promise<
        PostResult<Option<TProjectRow>, Option<string>, Option<string[]>>
    >;

    readProjects: (
        page: number,
        limit: number,
        filter?: TReadProjectsFilter
    ) => Promise<
        GetResult<Option<TProjectRow>, Option<string>, Option<string[]>>
    >;
}

export class ProjectService implements IProjectService {
    static url = "/project";
    static instance: ProjectService;

    static getInstance() {
        if (ProjectService.instance) return ProjectService.instance;
        else {
            ProjectService.instance = new ProjectService();
            return ProjectService.instance;
        }
    }

    createProject = async (payload: TCreateProjectPayload) =>
        POST(ProjectService.url, payload);

    readProjects = async (
        page = 1,
        limit = 10,
        filter: TReadProjectsFilter = {}
    ) => GET<TProjectRow>(ProjectService.url, { page, limit, ...filter });
}
