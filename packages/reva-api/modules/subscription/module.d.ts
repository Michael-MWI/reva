type LegalStatus =
  | "EI"
  | "EURL"
  | "SARL"
  | "SAS"
  | "SASU"
  | "SA"
  | "EIRL"
  | "ASSOCIATION_LOI_1901"
  | "ETABLISSEMENT_PUBLIC"
  | "NC";

type OrganismTypology =
  | "generaliste"
  | "experimentation"
  | "expertFiliere"
  | "expertBranche"
  | "expertBrancheEtFiliere";

type SubscriptionRequestStatus = "PENDING" | "REJECTED";

interface SubscriptionRequestInput {
  companySiret: string;
  companyLegalStatus: LegalStatus;
  companyName: string;
  companyAddress: string;
  companyZipCode: string;
  companyCity: string;
  accountFirstname: string;
  accountLastname: string;
  accountEmail: string;
  accountPhoneNumber: string;
  typology: OrganismTypology;
  domaineIds: string[];
  ccnIds: string[];
  onSiteDepartmentsIds: string[];
  remoteDepartmentsIds: string[];
  companyWebsite?: string;
  qualiopiCertificateExpiresAt: Date;
  status: SubscriptionRequestStatus;
}

interface DepartmentWithOrganismMethods {
  departmentId: string;
  isOnSite: boolean;
  isRemote: boolean;
}

type SubscriptionRequest = Omit<
  SubscriptionRequestInput,
  "domaineIds",
  "ccnIds",
  "onSiteDepartmentsIds",
  "remoteDepartmentsIds"
> & {
  id: string;
  createdAt: Date;
};

type SubscriptionRequestSummary = Pick<
  SubscriptionRequest,
  | "id"
  | "accountLastname"
  | "accountFirstname"
  | "accountEmail"
  | "companyName"
  | "companyAddress"
>;

interface GetSubscriptionRequestsParams extends FilteredPaginatedListArgs {
  status?: SubscriptionRequestStatus;
  orderBy?: {
    companyName?: Sort;
    accountLastname?: Sort;
  };
}

interface SubscriptionInput {
  isCguCheckboxChecked: boolean;
  companySiret: string;
  companyLegalStatus: LegalStatus;
  companyName: string;
  companyAddress: string;
  companyZipCode: string;
  companyCity: string;
  managerFirstname: string;
  managerLastname: string;
  accountFirstname: string;
  accountLastname: string;
  accountEmail: string;
  accountPhoneNumber: string;
  companyWebsite: string;
  delegataire: boolean;
  attestationURSSAF: GraphqlUploadedFile;
  justificatifIdentiteDirigeant: GraphqlUploadedFile;
  lettreDeDelegation: GraphqlUploadedFile;
  justificatifIdentiteDelegataire: GraphqlUploadedFile;
}

type GraphqlUploadedFile = Promise<{
  filename: string;
  mimetype: string;
  createReadStream(): ReadStream;
}>;
