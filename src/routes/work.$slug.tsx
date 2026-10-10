import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLoading } from "@/components/site/ContentLoading";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { getPublishedProject, getPublicImageUrl, getSafeExternalUrl } from "@/lib/cms";
import { useWebsiteSettings } from "@/lib/website-settings";

const caseStudySectionPattern =
  /(?:^|\n)\s{0,3}#{0,3}\s*(Challenge|Thinking|Identity|Expression|Digital|Outcome)\s*:?\s*/gi;

function getCaseStudySections(description: string | null) {
  if (!description?.trim()) return [];

  const matches = Array.from(description.matchAll(caseStudySectionPattern));
  if (matches.length === 0) {
    return [{ title: "Project overview", content: description.trim() }];
  }

  const sections: { title: string; content: string }[] = [];
  const firstMatch = matches[0];
  if (firstMatch.index !== undefined && firstMatch.index > 0) {
    const introduction = description.slice(0, firstMatch.index).trim();
    if (introduction) sections.push({ title: "Project overview", content: introduction });
  }

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? description.length;
    const content = description.slice(start, end).trim();
    if (content) sections.push({ title: match[1], content });
  });

  return sections;
}

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const project = await getPublishedProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  pendingComponent: ContentLoading,
  head: ({ loaderData: project }) => ({
    meta: [
      {
        title: project
          ? `${project.title} — CYTIC CREATIVES`
          : "Project unavailable — CYTIC CREATIVES",
      },
      { name: "description", content: project?.summary ?? "A project by CYTIC CREATIVES." },
      {
        property: "og:title",
        content: project
          ? `${project.title} — CYTIC CREATIVES`
          : "Project unavailable — CYTIC CREATIVES",
      },
      { property: "og:description", content: project?.summary ?? "A project by CYTIC CREATIVES." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: project ? `/work/${project.slug}` : "/work" }],
  }),
  component: Work,
});

function Work() {
  const project = Route.useLoaderData();
  const projectUrl = getSafeExternalUrl(project.project_url);
  const settings = useWebsiteSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const imagePaths = project.image_paths;
  const caseStudySections = getCaseStudySections(project.description);
  const featuredImagePath = imagePaths[selectedImage];

  useEffect(() => {
    if (activeImage === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
      if (event.key === "ArrowLeft") {
        setActiveImage((current) =>
          current === null ? null : (current - 1 + imagePaths.length) % imagePaths.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveImage((current) => (current === null ? null : (current + 1) % imagePaths.length));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage, imagePaths.length]);

  return (
    <Page>
      <article className="project-detail-page">
        <div className="site-container">
          <section className="project-detail-card" aria-label={`${project.title} project details`}>
            <div className="product-gallery">
              {featuredImagePath ? (
                <button
                  type="button"
                  className="product-main-image"
                  onClick={() => setActiveImage(selectedImage)}
                  aria-label={`Enlarge project image ${selectedImage + 1}`}
                >
                  <img
                    src={getPublicImageUrl("portofio-images", featuredImagePath)}
                    alt={`${project.title} project image ${selectedImage + 1}`}
                    loading="eager"
                  />
                  <span className="product-image-counter">
                    {String(selectedImage + 1).padStart(2, "0")} /{" "}
                    {String(imagePaths.length).padStart(2, "0")}
                  </span>
                </button>
              ) : (
                <div
                  className="product-main-image product-main-image-fallback"
                  role="img"
                  aria-label={`${project.title} project image unavailable`}
                />
              )}
              {imagePaths.length > 1 && (
                <div className="product-thumbnail-row" aria-label="Project image previews">
                  {imagePaths.map((path, index) => (
                    <button
                      type="button"
                      className={`product-thumbnail ${selectedImage === index ? "is-active" : ""}`}
                      key={`${path}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Show project image ${index + 1}`}
                      aria-current={selectedImage === index ? "true" : undefined}
                    >
                      <img src={getPublicImageUrl("portofio-images", path)} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="project-details-panel">
              <h1 className="display-md">{project.title}</h1>
              {project.summary && <p className="project-details-summary">{project.summary}</p>}
              <div className="project-detail-facts">
                {project.service && (
                  <div>
                    <span>Services</span>
                    <p>{project.service}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <span>Year</span>
                    <p>{project.year}</p>
                  </div>
                )}
                <div>
                  <span>Project</span>
                  <p>{project.title}</p>
                </div>
              </div>
              <div className="project-detail-actions">
                {projectUrl && (
                  <Button asChild variant="gold" size="xl">
                    <a href={projectUrl} target="_blank" rel="noreferrer">
                      Visit project <ArrowUpRight />
                    </a>
                  </Button>
                )}
                {settings.show_quote !== false && (
                  <Button asChild variant={projectUrl ? "outline" : "navy"} size="xl">
                    <Link to="/quote">
                      Discuss a similar project <ArrowUpRight />
                    </Link>
                  </Button>
                )}
              </div>
              <p className="project-detail-note">
                Interested in work like this? Let’s shape a project around your goals.
              </p>
            </div>
          </section>
        </div>
        {caseStudySections.length > 0 && (
          <section className="case-study-content">
            <div className="site-container">
              {caseStudySections.map((section, index) => (
                <article className="case-study-section" key={`${section.title}-${index}`}>
                  <Eyebrow>{section.title}</Eyebrow>
                  <p className="project-description">{section.content}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {activeImage !== null && (
          <div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} image gallery`}
          >
            <button
              type="button"
              className="gallery-lightbox-backdrop"
              onClick={() => setActiveImage(null)}
              aria-label="Close image gallery"
            />
            <div className="gallery-lightbox-panel">
              <div className="gallery-lightbox-topbar">
                <p>
                  {project.title}
                  <span>
                    {String(activeImage + 1).padStart(2, "0")} /{" "}
                    {String(imagePaths.length).padStart(2, "0")}
                  </span>
                </p>
                <button
                  type="button"
                  className="gallery-lightbox-close"
                  onClick={() => setActiveImage(null)}
                  aria-label="Close image gallery"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <div className="gallery-lightbox-main">
                <button
                  type="button"
                  className="gallery-lightbox-arrow"
                  onClick={() =>
                    setActiveImage((activeImage - 1 + imagePaths.length) % imagePaths.length)
                  }
                  aria-label="Show previous image"
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <img
                  src={getPublicImageUrl("portofio-images", imagePaths[activeImage])}
                  alt={`${project.title} project image ${activeImage + 1}`}
                />
                <button
                  type="button"
                  className="gallery-lightbox-arrow"
                  onClick={() => setActiveImage((activeImage + 1) % imagePaths.length)}
                  aria-label="Show next image"
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
              <div className="gallery-lightbox-thumbnails" aria-label="Choose an image">
                {imagePaths.map((path, index) => (
                  <button
                    type="button"
                    key={`${path}-${index}`}
                    className={activeImage === index ? "is-active" : ""}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={activeImage === index ? "true" : undefined}
                  >
                    <img src={getPublicImageUrl("portofio-images", path)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {settings.show_quote !== false && (
          <section className="bg-gold">
            <div className="site-container flex flex-col gap-8 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
              <h2 className="display-lg">Build something distinct.</h2>
              <Button asChild variant="cream" size="xl">
                <Link to="/quote">
                  Build Your Quote <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </article>
    </Page>
  );
}
