import { prismaClient } from "../prisma/client";

type SearchResponse = {
  features: [
    {
      type: string;
      geometry: {
        type: string;
        coordinates: [number, number];
      };
      properties: {
        label: string;
        score: number;
        housenumber: string;
        id: string;
        type: string;
        name: string;
        postcode: string;
        citycode: string;
        x: number;
        y: number;
        city: string;
        context: string;
        importance: number;
        street: string;
      };
    },
  ];
};

(async () => {
  try {
    const organisms = await prismaClient.organism.findMany({
      where: {
        ll_to_earth: null,
        zip: {
          not: "",
        },
      },
    });

    for (const organism of organisms) {
      const { zip } = organism;

      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=centre&postcode=${zip}&limit=1"`,
      );

      const { features }: SearchResponse = await res.json();
      if (!features.length) {
        console.error(`No feature found for zip code ${zip}`);
        continue;
      }
      const [
        {
          geometry: { coordinates },
        },
      ] = features;

      const [longitude, latitude] = coordinates;

      const [{ ll_to_earth }]: { ll_to_earth: string }[] =
        await prismaClient.$queryRawUnsafe(
          `SELECT CAST(ll_to_earth(${latitude}, ${longitude}) AS TEXT)`,
        );

      await prismaClient.organism.update({
        where: { id: organism.id },
        data: {
          ll_to_earth,
        },
      });
    }
  } catch (error) {
    console.log("error generateLLToEarthFromZipCodeToAAP : ", error);
  }
})();
