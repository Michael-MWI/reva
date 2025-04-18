import { BasicSkill, Training } from "@/graphql/generated/graphql";

export default function ParcoursSection({
  basicSkills,
  mandatoryTrainings,
  additionalHourCount,
  individualHourCount,
  collectiveHourCount,
}: {
  basicSkills: BasicSkill[];
  mandatoryTrainings: Training[];
  additionalHourCount?: number | null;
  individualHourCount?: number | null;
  collectiveHourCount?: number | null;
}) {
  return (
    <div>
      <div className="flex">
        <span
          className="fr-icon-time-fill fr-icon--lg mr-2"
          data-html2canvas-ignore="true"
        />
        <h2>Parcours envisagé</h2>
      </div>
      <p className="mb-2">
        Accompagnement individuel : {individualHourCount ?? 0}h
      </p>
      <p className="mb-2">
        Accompagnement collectif : {collectiveHourCount ?? 0}h
      </p>
      <p>Formation : {additionalHourCount ?? 0}h</p>

      <h4 className="mb-2">Formations obligatoires</h4>
      <div className="mb-4">
        {mandatoryTrainings.map((training) => (
          <p key={training.id} className="mb-2">
            {training.label}
          </p>
        ))}
      </div>

      <h4 className="mb-2">Savoir de base</h4>
      <div className="mb-6">
        {basicSkills.map((skill) => (
          <p key={skill.id} className="mb-2">
            {skill.label}
          </p>
        ))}
      </div>
    </div>
  );
}
