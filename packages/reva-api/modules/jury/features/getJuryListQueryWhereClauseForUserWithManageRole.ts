import {
  Account,
  CertificationAuthorityLocalAccount,
  CertificationAuthorityLocalAccountOnCertification,
  CertificationAuthorityLocalAccountOnDepartment,
  Prisma,
} from "@prisma/client";

export const getJuryListQueryWhereClauseForUserWithManageRole = ({
  account,
  isCertificationAuthorityLocalAccount,
  certificationAuthorityLocalAccount,
}: {
  account: Account | null;
  isCertificationAuthorityLocalAccount: boolean;
  certificationAuthorityLocalAccount:
    | (CertificationAuthorityLocalAccount & {
        certificationAuthorityLocalAccountOnDepartment: CertificationAuthorityLocalAccountOnDepartment[];
        certificationAuthorityLocalAccountOnCertification: CertificationAuthorityLocalAccountOnCertification[];
      })
    | null;
}): Prisma.JuryWhereInput => {
  let queryWhereClause = {};
  // For certification authority local accounts we restric matches to the local account own departments and certifications
  if (isCertificationAuthorityLocalAccount) {
    if (!certificationAuthorityLocalAccount) {
      throw new Error(
        "Compte local de l'autorité de certification non trouvée",
      );
    }

    const departmentIds =
      certificationAuthorityLocalAccount?.certificationAuthorityLocalAccountOnDepartment.map(
        (calad) => calad.departmentId,
      );
    const certificationIds =
      certificationAuthorityLocalAccount?.certificationAuthorityLocalAccountOnCertification.map(
        (calac) => calac.certificationId,
      );

    queryWhereClause = {
      ...queryWhereClause,
      certificationAuthorityId:
        certificationAuthorityLocalAccount?.certificationAuthorityId,
      candidacy: {
        candidate: {
          departmentId: { in: departmentIds },
        },
        certificationId: { in: certificationIds },
      },
    };
  } else {
    queryWhereClause = {
      ...queryWhereClause,
      certificationAuthorityId: account?.certificationAuthorityId || "_",
    };
  }

  return queryWhereClause;
};
