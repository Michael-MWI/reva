BEGIN;
-- Drop view using the OrganismTypology enum 

DROP VIEW available_certification_by_department, active_organism_by_available_certification_and_department;

-- AlterEnum
CREATE TYPE "OrganismTypology_new" AS ENUM ('experimentation', 'expertFiliere', 'expertBranche', 'expertBrancheEtFiliere');
ALTER TABLE "organism" ALTER COLUMN "typology" TYPE "OrganismTypology_new" USING ("typology"::text::"OrganismTypology_new");
ALTER TABLE "maison_mere_aap" ALTER COLUMN "typologie" TYPE "OrganismTypology_new" USING ("typologie"::text::"OrganismTypology_new");
ALTER TYPE "OrganismTypology" RENAME TO "OrganismTypology_old";
ALTER TYPE "OrganismTypology_new" RENAME TO "OrganismTypology";
DROP TYPE "OrganismTypology_old";


-- Re create views using the organismTypology enum

-- available_certification_by_department
-- used by candidate app to view available certification for a given department
CREATE
OR REPLACE VIEW available_certification_by_department AS
-- expert filiere and expertBrancheEtFiliere filiere part
SELECT DISTINCT
  cer.id as certification_id,
  dep.id as department_id,
  cer.searchable_text as certification_searchable_text
FROM
  certification cer,
  department dep,
  organism org,
  domaine dom,
  organism_on_domaine org_dom,
  certification_on_domaine cer_dom,
  organism_department org_dep,
  organism_on_degree org_degree,
  degree degree
WHERE
  (
    org.typology = 'expertFiliere'
    or org.typology = 'expertBrancheEtFiliere' -- "expertBrancheEtFiliere" is both "expertBranche" and "expertFiliere"
  )
  AND org.is_active = true
  AND org.ferme_pour_absence_ou_conges = false
  AND cer.status = 'AVAILABLE'
  AND org_dom.organism_id = org.id
  AND org_dom.domaine_id = dom.id
  AND cer_dom.certification_id = cer.id
  AND cer_dom.domaine_id = dom.id
  AND org_dep.organism_id = org.id
  AND org_dep.department_id = dep.id
  AND org_degree.organism_id = org.id
  AND org_degree.degree_id = degree.id
  AND degree.level = cer.level
  AND NOT EXISTS (
    select
      certification_on_ccn.certification_id
    from
      certification_on_ccn
    where
      certification_on_ccn.certification_id = cer.id
  )
UNION DISTINCT --
-- expert branche and expertBrancheEtFiliere branche part
SELECT DISTINCT
  cer.id as certification_id,
  dep.id as department_id,
  cer.searchable_text as certification_searchable_text
FROM
  certification cer,
  department dep,
  organism org,
  convention_collective ccn,
  organism_on_ccn org_ccn,
  certification_on_ccn cer_ccn,
  organism_department org_dep,
  organism_on_degree org_degree,
  degree degree
WHERE
  (
    org.typology = 'expertBranche'
    or org.typology = 'expertBrancheEtFiliere' -- "expertBrancheEtFiliere" is both "expertBranche" and "expertFiliere"
  )
  AND org.is_active = true
  AND org.ferme_pour_absence_ou_conges = false
  AND cer.status = 'AVAILABLE'
  AND org_ccn.organism_id = org.id
  AND org_ccn.ccn_id = ccn.id
  AND cer_ccn.certification_id = cer.id
  AND cer_ccn.ccn_id = ccn.id
  AND org_dep.organism_id = org.id
  AND org_dep.department_id = dep.id
  AND org_degree.organism_id = org.id
  AND org_degree.degree_id = degree.id
  AND degree.level = cer.level;

--active_organism_by_available_certification_and_department
--used by candidate app to view active organisms for a given department and a given certificate
CREATE
OR REPLACE VIEW active_organism_by_available_certification_and_department AS
--expert filiere and expertBrancheEtFiliere filiere part
SELECT DISTINCT
  org.id as organism_id,
  cer.id as certification_id,
  dep.id as department_id,
  cer.searchable_text as certification_searchable_text
FROM
  certification cer,
  department dep,
  organism org,
  domaine dom,
  organism_on_domaine org_dom,
  certification_on_domaine cer_dom,
  organism_department org_dep,
  organism_on_degree org_degree,
  degree degree
WHERE
  (
    org.typology = 'expertFiliere'
    or org.typology = 'expertBrancheEtFiliere' -- "expertBrancheEtFiliere" is both "expertBranche" and "expertFiliere"
  )
  AND org.is_active = true
  AND org.ferme_pour_absence_ou_conges = false
  AND cer.status = 'AVAILABLE'
  AND org_dom.organism_id = org.id
  AND org_dom.domaine_id = dom.id
  AND cer_dom.certification_id = cer.id
  AND cer_dom.domaine_id = dom.id
  AND org_dep.organism_id = org.id
  AND org_dep.department_id = dep.id
  AND org_degree.organism_id = org.id
  AND org_degree.degree_id = degree.id
  AND degree.level = cer.level
  AND NOT EXISTS (
    select
      certification_on_ccn.certification_id
    from
      certification_on_ccn
    where
      certification_on_ccn.certification_id = cer.id
  )
UNION DISTINCT --
-- expert branche and expertBrancheEtFiliere branche part
SELECT DISTINCT
  org.id as organisme_id,
  cer.id as certification_id,
  dep.id as department_id,
  cer.searchable_text as certification_searchable_text
FROM
  certification cer,
  department dep,
  organism org,
  convention_collective ccn,
  organism_on_ccn org_ccn,
  certification_on_ccn cer_ccn,
  organism_department org_dep,
  organism_on_degree org_degree,
  degree degree
WHERE
  (
    org.typology = 'expertBranche'
    or org.typology = 'expertBrancheEtFiliere' -- "expertBrancheEtFiliere" is both "expertBranche" and "expertFiliere"
  )
  AND org.is_active = true
  AND org.ferme_pour_absence_ou_conges = false
  AND cer.status = 'AVAILABLE'
  AND org_ccn.organism_id = org.id
  AND org_ccn.ccn_id = ccn.id
  AND cer_ccn.certification_id = cer.id
  AND cer_ccn.ccn_id = ccn.id
  AND org_dep.organism_id = org.id
  AND org_dep.department_id = dep.id
  AND org_degree.organism_id = org.id
  AND org_degree.degree_id = degree.id
  AND degree.level = cer.level;

COMMIT;