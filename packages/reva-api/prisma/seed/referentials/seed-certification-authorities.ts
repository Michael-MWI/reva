// Autorités responsables de la certification : referentials/certification-authorities.csv

import { Prisma, PrismaClient } from "@prisma/client";

import { injectCsvRows, readCsvRows } from "../read-csv";

export async function seedCertificationAuthorities(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SET CONSTRAINTS "account_certification_authority_id_fkey" DEFERRED;`
    );
    await tx.certificationAuthority.deleteMany();
    await injectCsvRows<
      Prisma.CertificationAuthorityCreateInput,
      Prisma.CertificationAuthorityUpsertArgs
    >({
      filePath: "./referentials/certification-authorities.csv",
      headersDefinition: [
        "label",
        "id",
        "contactFullName",
        "contactEmail",
        "certificationAuthorityOnCertification",
        "certificationAuthorityOnDepartment",
      ],
      transform: ({ id, label, contactFullName, contactEmail }) => {
        const actualContactEmail =
          process.env.APP_ENV === "production"
            ? contactEmail
            : "revatrash@gmail.com";
        return {
          where: { id },
          create: {
            id,
            label,
            contactFullName,
            contactEmail: actualContactEmail,
          },
          update: { label, contactFullName, contactEmail: actualContactEmail },
        };
      },
      injectCommand: tx.certificationAuthority.upsert,
    });

    const certificationIdsByCertificationAuthorityIds = await readCsvRows<{
      certificationAuthorityId: string;
      certificationIdsAsString: string;
    }>({
      filePath: "./referentials/certification-authorities.csv",
      headersDefinition: [
        undefined,
        "certificationAuthorityId",
        undefined,
        undefined,
        "certificationIdsAsString",
        undefined,
      ],
    });

    const certificationAuthorityOnCertifications =
      certificationIdsByCertificationAuthorityIds
        .flatMap((c) =>
          c.certificationIdsAsString.split(", ").map((cid) => ({
            certificationAuthorityId: c.certificationAuthorityId,
            certificationId: cid,
          }))
        )
        .filter(
          (certificationAuthorityOnCertification) =>
            certificationAuthorityOnCertification.certificationId
        );

    await tx.certificationAuthorityOnCertification.deleteMany();
    await tx.certificationAuthorityOnCertification.createMany({
      data: certificationAuthorityOnCertifications,
    });

    const departments = await tx.department.findMany();

    const departmentCodesIdsByCertificationAuthorityIds = await readCsvRows<{
      certificationAuthorityId: string;
      departmentCodesAsString: string;
    }>({
      filePath: "./referentials/certification-authorities.csv",
      headersDefinition: [
        undefined,
        "certificationAuthorityId",
        undefined,
        undefined,
        undefined,
        "departmentCodesAsString",
      ],
    });

    const certificationAuthorityOnDepartments =
      departmentCodesIdsByCertificationAuthorityIds
        .flatMap((c) =>
          c.departmentCodesAsString.split(", ").map((dCode) => ({
            certificationAuthorityId: c.certificationAuthorityId,
            departmentId: departments.find((d) => d.code === dCode)?.id || "",
          }))
        )
        .filter((caod) => caod.departmentId);

    await tx.certificationAuthorityOnDepartment.deleteMany();
    await tx.certificationAuthorityOnDepartment.createMany({
      data: certificationAuthorityOnDepartments,
    });
    await tx.$executeRawUnsafe(
      `SET CONSTRAINTS "account_certification_authority_id_fkey" IMMEDIATE;`
    );
  });
}
