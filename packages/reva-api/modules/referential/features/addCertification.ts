import { prismaClient } from "../../../prisma/client";

import { RNCPCertification, RNCPReferential } from "../rncp";
import { getFormacodes, Formacode } from "./getFormacodes";

export const addCertification = async (params: { codeRncp: string }) => {
  const { codeRncp } = params;

  const existingCertification = await prismaClient.certification.findFirst({
    where: { rncpId: codeRncp },
  });
  if (existingCertification) {
    throw new Error(
      `La certification avec le code rncp ${codeRncp} existe déjà`,
    );
  }

  const rncpCertification =
    await RNCPReferential.getInstance().findOneByRncp(codeRncp);
  if (!rncpCertification) {
    throw new Error(
      `La certification avec le code rncp ${codeRncp} n'existe pas dans le référentiel RNCP`,
    );
  }

  const label = rncpCertification.INTITULE;
  const level = getLevelFromRNCPCertification(rncpCertification);
  const rncpTypeDiplomeLabel = rncpCertification.ABREGE?.LIBELLE;
  if (!rncpTypeDiplomeLabel) {
    throw new Error("Type de diplôme RNCP non renseigné");
  }
  const typeDiplome = await prismaClient.typeDiplome.findFirst({
    where: { label: rncpTypeDiplomeLabel },
  });

  const availableAt = new Date();
  const expiresAt = new Date(rncpCertification.DATE_FIN_ENREGISTREMENT);

  const certification = await prismaClient.certification.create({
    data: {
      statusV2: "BROUILLON",
      feasibilityFormat: "DEMATERIALIZED",
      rncpId: codeRncp,
      label,
      level,
      typeDiplome: typeDiplome
        ? { connect: { id: typeDiplome.id } }
        : { create: { label: rncpTypeDiplomeLabel } },
      availableAt,
      expiresAt,
      // RNCP Fields
      rncpLabel: label,
      rncpLevel: level,
      rncpTypeDiplome: rncpTypeDiplomeLabel,
      rncpExpiresAt: expiresAt,
      rncpDeliveryDeadline: rncpCertification.DATE_LIMITE_DELIVRANCE
        ? new Date(rncpCertification.DATE_LIMITE_DELIVRANCE)
        : null,
    },
  });

  // Link certification to sub domains
  const referential = await getFormacodes();

  const subDomains: Formacode[] = [];

  for (const rncpFormacode of rncpCertification.FORMACODES) {
    const formacode = getFormacodeByCode(rncpFormacode.CODE, referential);

    if (!formacode) {
      throw new Error(
        `Le formacode avec le code ${rncpFormacode.CODE} n'existe pas dans le référentiel RNCP`,
      );
    }

    const parents = getParents(formacode, referential);
    const subDomain = parents.find(
      (formacode) => formacode.type == "SUB_DOMAIN",
    );
    if (
      subDomain &&
      subDomains.findIndex((domain) => domain.code == subDomain.code) == -1
    ) {
      subDomains.push(subDomain);
    }
  }

  // Create all links
  await prismaClient.certificationOnFormacode.createMany({
    data: subDomains.map((subDomain) => ({
      formacodeId: subDomain.id,
      certificationId: certification.id,
    })),
  });

  return certification;
};

const getLevelFromRNCPCertification = (
  certification: RNCPCertification,
): number => {
  try {
    const strLevel =
      certification.NOMENCLATURE_EUROPE.INTITULE.split(" ").reverse()[0];
    const level = parseInt(strLevel, 10);
    return level;
  } catch {
    throw new Error(
      `Le niveau de la certification pour le code RNCP ${certification.ID_FICHE} n'a pas pu être formatté`,
    );
  }
};

const getFormacodeByCode = (
  code: string,
  referential: Formacode[],
): Formacode | undefined => {
  return referential.find((formacode) => formacode.code == code);
};

const getParent = (child: Formacode, referential: Formacode[]) => {
  return referential.find((formacode) => formacode.code == child.parentCode);
};

const getParents = (
  formacode: Formacode,
  referential: Formacode[],
): Formacode[] => {
  const parent = getParent(formacode, referential);

  if (parent) {
    return [...getParents(parent, referential), formacode];
  }

  return [formacode];
};
