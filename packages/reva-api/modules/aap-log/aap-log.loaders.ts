import { getAAPLogUsers } from "./features/getAAPLogUsers";
import { AAPLog } from "@prisma/client";

export const aapLogLoaders = {
  AAPLog: {
    user: async (queries: { obj: AAPLog }[]) => {
      const userKeycloakIdAndProfiles = queries.map(({ obj }) => ({
        userProfile: obj.userProfile,
        userKeycloakId: obj.userKeycloakId,
      }));

      const results = await getAAPLogUsers({ userKeycloakIdAndProfiles });

      return userKeycloakIdAndProfiles.map((u) =>
        results.find((r) => r.keycloakId === u.userKeycloakId),
      );
    },
  },
};
