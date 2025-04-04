import { STRAPI_GRAPHQL_API_URL } from "@/config/config";
import { graphql } from "@/graphql/generated";
import request from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";

const getArticleRegionByIdQuery = graphql(`
  query getArticleRegionsByIdForPreview($id: ID!) {
    articleRegion(documentId: $id) {
      titre
      regions {
        slug
      }
    }
  }
`);

const getArticleRegionById = async (id: string) => {
  return request(STRAPI_GRAPHQL_API_URL, getArticleRegionByIdQuery, {
    id,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.secret !== process.env.STRAPI_PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  let contentPath = "";

  switch (req.query.type) {
    case "article-d-aide":
      contentPath = `/savoir-plus/articles/${req.query.slug}`;
      break;
    case "article-faq":
      contentPath = "/faq/";
      break;
    case "article-region":
      contentPath = `/regions/${req.query.slug}`;
      const article = await getArticleRegionById(req.query.id as string);
      const region = article.articleRegion?.regions[0];
      contentPath = region?.slug
        ? `/regions/${region?.slug}/articles/${req.query.slug}`
        : "/regions/";
      break;
    case "region":
      contentPath = `/regions/${req.query.slug}`;
      break;
    case "legal":
      contentPath = `/legal/${req.query.slug}`;
      break;
    default:
      return res.status(401).json({
        message: "La preview n'est pas disponible pour ce type de contenu",
      });
  }

  res.setPreviewData({});

  res.writeHead(307, { Location: contentPath });
  res.end();
}
