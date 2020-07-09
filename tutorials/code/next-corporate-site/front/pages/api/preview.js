import { getPageData } from "utils/api";

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (
    req.query.secret !== process.env.STRAPI_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const pageData = await getPageData(req.query.slug, true);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!pageData) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/${pageData.slug}` });
  res.end();
};

// You can view Preview pages with URLs like this:
// http://localhost:3000/api/preview?secret=5uper53cr3tc0d3&slug=secret
