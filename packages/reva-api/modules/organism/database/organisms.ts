import { Organism, Prisma } from "@prisma/client";
import { camelCase, mapKeys } from "lodash";
import { Either, Left, Maybe, Right } from "purify-ts";

import { prismaClient } from "../../../prisma/client";
import { SearchOrganismFilter } from "../../candidacy/candidacy.types";
import { getDegrees } from "../../referential/features/getDegrees";
import { logger } from "../../shared/logger";
import * as domain from "../organism.types";

export const getAAPOrganisms = async (params: {
  candidacyId: string;
}): Promise<Either<string, domain.Organism[]>> => {
  return getOrganisms({ candidacyId: params.candidacyId, isArchitect: true });
};

export const getOrganismById = async (
  organismId: string,
): Promise<Either<string, Maybe<domain.Organism>>> => {
  try {
    const organism = await prismaClient.organism.findFirst({
      where: {
        id: organismId,
      },
    });

    return Right(Maybe.fromNullable(organism));
  } catch (e) {
    logger.error(e);
    return Left(`error while retrieving organism ${organismId}`);
  }
};

export const getCompanionOrganisms = async (params: {
  candidacyId: string;
}): Promise<Either<string, domain.Organism[]>> => {
  return getOrganisms({ candidacyId: params.candidacyId, isCompanion: true });
};

const getOrganisms = async (params: {
  candidacyId: string;
  isArchitect?: boolean;
  isCompanion?: boolean;
}) => {
  try {
    const candidacy = await prismaClient.candidacy.findFirst({
      where: {
        id: params.candidacyId,
        certificationsAndRegions: { some: {} },
      },
      include: {
        certificationsAndRegions: {
          where: {
            isActive: true,
          },
          select: {
            certificationId: true,
            regionId: true,
          },
        },
      },
    });

    if (!candidacy) {
      return Right([]);
    }

    let filters = {
      certificationId: candidacy.certificationsAndRegions[0].certificationId,
      regionId: candidacy.certificationsAndRegions[0].regionId,
    } as Prisma.OrganismsOnRegionsAndCertificationsWhereInput;

    if (params.isArchitect !== undefined) {
      filters = { ...filters, isArchitect: params.isArchitect };
    }

    if (params.isCompanion !== undefined) {
      filters = { ...filters, isCompanion: params.isCompanion };
    }

    const organisms = await prismaClient.organism.findMany({
      where: {
        regionsAndCertifications: {
          some: filters,
        },
        isActive: true,
      },
    });

    return Right(organisms);
  } catch (e) {
    logger.error(e);
    return Left(`error while retrieving organisms`);
  }
};

export const getOrganismBySiretAndTypology = async (
  siret: string,
  typology: OrganismTypology,
): Promise<Either<string, Maybe<domain.Organism>>> => {
  try {
    const organism = await prismaClient.organism.findFirst({
      where: {
        siret,
        typology,
      },
    });
    return Right(Maybe.fromNullable(organism));
  } catch (e) {
    logger.error(e);
    return Left(`error while retrieving organism`);
  }
};

export const createOrganism = async (data: {
  label: string;
  address: string;
  zip: string;
  city: string;
  contactAdministrativeEmail: string;
  contactAdministrativePhone: string;
  website: string;
  legalStatus: LegalStatus;
  siret: string;
  isActive: boolean;
  typology: OrganismTypology;
  ccnIds?: string[];
  domaineIds?: string[];
  qualiopiCertificateExpiresAt: Date;
  departmentsWithOrganismMethods: domain.DepartmentWithOrganismMethods[];
  llToEarth: string | null;
}): Promise<Either<string, domain.Organism>> => {
  try {
    const degrees = await getDegrees();
    const { domaineIds, ccnIds, departmentsWithOrganismMethods, ...otherData } =
      data;
    const organism = await prismaClient.organism.create({
      data: {
        ...otherData,
        organismOnConventionCollective: {
          createMany: {
            data:
              ccnIds?.map((ccnId) => ({
                ccnId,
              })) || [],
          },
        },
        organismOnDomaine: {
          createMany: {
            data:
              domaineIds?.map((domaineId) => ({
                domaineId,
              })) || [],
          },
        },
        departmentsWithOrganismMethods: {
          createMany: {
            data: departmentsWithOrganismMethods?.map((d) => ({
              departmentId: d.departmentId,
              isOnSite: d.isOnSite,
              isRemote: d.isRemote,
            })),
          },
        },
        managedDegrees: {
          createMany: {
            data: degrees.map((d) => ({ degreeId: d.id })),
          },
        },
      },
    });
    return Right(organism);
  } catch (e) {
    logger.error(e);
    return Left(`error while creating organism`);
  }
};

export const getActiveOrganismForCertificationAndDepartment = async ({
  certificationId,
  departmentId,
}: {
  certificationId: string;
  departmentId: string;
}): Promise<Either<string, domain.Organism[]>> => {
  try {
    if (!certificationId || !departmentId) {
      return Right([]);
    }
    return Right(
      await prismaClient.organism.findMany({
        where: {
          activeOrganismsByAvailableCertificationsAndDepartments: {
            some: { AND: [{ certificationId }, { departmentId }] },
          },
        },
      }),
    );
  } catch (e) {
    logger.error(e);
    return Left(`error while retreiving organism`);
  }
};

export const getReferentOrganismFromCandidacyId = async (
  candidacyId: string,
) => {
  try {
    const candidacy = await prismaClient.candidacy.findUnique({
      where: { id: candidacyId },
      include: { organism: true },
    });
    // return Right(candidacy?.organism);
    return Right(Maybe.fromNullable(candidacy?.organism));
  } catch (e) {
    logger.error(e);
    return Left(
      `Error while retreiving referent organism from candidacy ${candidacyId}: ${e}`,
    );
  }
};

export const existOrganismWithTypologyAndSiret = async ({
  typology,
  siret,
}: Pick<Prisma.OrganismWhereInput, "siret" | "typology">) => {
  try {
    const matchCount = await prismaClient.organism.count({
      where: { siret, typology: typology as OrganismTypology },
    });
    return Right(matchCount > 0);
  } catch (e) {
    logger.error(e);
    return Left(`Error while counting organisms matching criteria`);
  }
};

export const getRandomActiveOrganismForCertificationAndDepartment = async ({
  certificationId,
  departmentId,
  searchText,
  searchFilter,
  limit,
}: {
  certificationId: string;
  departmentId: string;
  searchText?: string;
  searchFilter: SearchOrganismFilter;
  limit: number;
}): Promise<Either<string, { rows: domain.Organism[]; totalRows: number }>> => {
  try {
    if (!certificationId || !departmentId) {
      return Right({ rows: [], totalRows: 0 });
    }

    let whereClause = `where o.id = ao.organism_id and ao.certification_id=uuid('${certificationId}') and ao.department_id=uuid('${departmentId}') and ao.department_id = od.department_id`;
    if (searchText) {
      whereClause += ` and (unaccent(o.label) ilike unaccent($$%${searchText}%$$) or unaccent(oic.nom) ilike unaccent($$%${searchText}%$$))`;
    }

    if (
      searchFilter.distanceStatus === "REMOTE" ||
      searchFilter.distanceStatus === "ONSITE_REMOTE"
    ) {
      whereClause += ` and od.is_remote = true`;
    }
    if (
      searchFilter.distanceStatus === "ONSITE" ||
      searchFilter.distanceStatus === "ONSITE_REMOTE"
    ) {
      whereClause += `
        and od.is_onsite = true
        and (oic."adresse_numero_et_nom_de_rue" IS NOT NULL or oic."adresse_numero_et_nom_de_rue" != '')
        and (oic."adresse_code_postal" IS NOT NULL or oic."adresse_code_postal" != '')
        and (oic."adresse_ville" IS NOT NULL or oic."adresse_ville" != '')
        ${
          searchFilter.pmr
            ? ` and oic."conformeNormesAccessbilite" = 'CONFORME'`
            : ` and oic."conformeNormesAccessbilite" != 'ETABLISSEMENT_NE_RECOIT_PAS_DE_PUBLIC'`
        }
        `;
    }

    const queryResults = `
        select o.id,
               o.label,
               o.legal_status,
               o.address,
               o.zip,
               o.city,
               o.contact_administrative_email,
               o.contact_administrative_phone,
               o.website,
               o.siret,
               ao.organism_id
        from organism o
                 left join organism_informations_commerciales as oic on oic.organism_id = o.id
                 inner join organism_department as od on od.organism_id = o.id,
             active_organism_by_available_certification_and_department ao
            ${whereClause}
        order by Random() limit ${limit}`;

    const results = (
      await prismaClient.$queryRawUnsafe<Organism[]>(queryResults)
    ).map(
      (o) => mapKeys(o, (_, k) => camelCase(k)), //mapping rawquery output field names in snake case to camel case
    ) as unknown as domain.Organism[];

    const queryCount = `
        select count(distinct (o.id))
        from organism o
                 left join organism_informations_commerciales as oic on oic.organism_id = o.id
                 inner join organism_department as od on od.organism_id = o.id,
             active_organism_by_available_certification_and_department ao
            ${whereClause}`;

    const count = Number(
      (await prismaClient.$queryRawUnsafe<{ count: number }[]>(queryCount))[0]
        .count,
    );

    return Right({ rows: results, totalRows: count });
  } catch (e) {
    logger.error(e);
    return Left(`error while retreiving organism`);
  }
};

export const doesOrganismWithSameLabelExludingThoseInExperimentationExists =
  async (label: string) =>
    !!(await prismaClient.organism.findFirst({
      select: { id: true },
      where: { typology: { not: "experimentation" }, label },
    }));
