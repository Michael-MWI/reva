BEGIN;

-- Drop view using the OrganismTypology enum 
-- available_certification
-- used by candidate app to view available certification
CREATE
OR REPLACE VIEW available_certification AS
-- expert filiere and expertBrancheEtFiliere filiere part
SELECT DISTINCT
    cer.id as certification_id,
    cer.searchable_text as certification_searchable_text
FROM
    certification cer,
    organism org,
    domaine dom,
    organism_on_domaine org_dom,
    certification_on_domaine cer_dom,
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
    cer.searchable_text as certification_searchable_text
FROM
    certification cer,
    organism org,
    convention_collective ccn,
    organism_on_ccn org_ccn,
    certification_on_ccn cer_ccn,
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
    AND org_degree.organism_id = org.id
    AND org_degree.degree_id = degree.id
    AND degree.level = cer.level;

--active_organism_by_available_certification
--used by candidate app to view active organisms for a given certificate
CREATE
OR REPLACE VIEW active_organism_by_available_certification AS
--expert filiere and expertBrancheEtFiliere filiere part
SELECT DISTINCT
    org.id as organism_id,
    cer.id as certification_id,
    cer.searchable_text as certification_searchable_text
FROM
    certification cer,
    organism org,
    domaine dom,
    organism_on_domaine org_dom,
    certification_on_domaine cer_dom,
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
    cer.searchable_text as certification_searchable_text
FROM
    certification cer,
    organism org,
    convention_collective ccn,
    organism_on_ccn org_ccn,
    certification_on_ccn cer_ccn,
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
    AND org_degree.organism_id = org.id
    AND org_degree.degree_id = degree.id
    AND degree.level = cer.level;

COMMIT;