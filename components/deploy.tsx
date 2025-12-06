import Image from "next/image";

export const DeployButton = () => {
  const url = new URL("https://vercel.com/new/clone");

  // Demo
  url.searchParams.set(
    "demo-description",
    "A free, open-source template for building natural language image search on the AI Cloud."
  );
  url.searchParams.set(
    "demo-image",
    "https://ops.tattty.com/opengraph-image.png"
  );
  url.searchParams.set("demo-title", "ops.tattty.com");
  url.searchParams.set("demo-url", "https://ops.tattty.com/");

  // Marketplace
  url.searchParams.set("from", "templates");
  url.searchParams.set("project-name", "OPS.TaTTTy");

  // Repository
  url.searchParams.set("repository-name", "ops-tattty");
  url.searchParams.set(
    "repository-url",
    "https://github.com/Tattzy25/ops-tattty"
  );

  // Integrations
  url.searchParams.set(
    "products",
    JSON.stringify([
      {
        type: "integration",
        protocol: "storage",
        productSlug: "upstash-search",
        integrationSlug: "upstash",
      },
      { type: "blob" },
    ])
  );
  url.searchParams.set("skippable-integrations", "0");

  return (
    <a href={url.toString()} title="Deploy OPS.TaTTTy to Vercel">
      <Image
        alt="Deploy with Vercel"
        height={32}
        src="https://vercel.com/button"
        unoptimized
        width={103}
      />
    </a>
  );
};
