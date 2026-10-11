import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getPublicImageUrl, type PortfolioProject } from "@/lib/cms";

type ProjectPreview = {
  failed?: boolean;
};

export function ProjectGrid({
  projects,
  all = false,
}: {
  projects: PortfolioProject[];
  all?: boolean;
}) {
  const [previews, setPreviews] = useState<Record<string, ProjectPreview>>({});

  if (projects.length === 0)
    return (
      <p className="empty-state">No projects have been published yet. Please check back soon.</p>
    );

  const renderProject = (project: PortfolioProject) => {
    const cover = project.image_paths[0];
    const preview = previews[project.id];

    return (
      <Link
        key={project.id}
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="project-card"
      >
        <div className="project-image">
          {cover && !preview?.failed ? (
            <img
              src={getPublicImageUrl("portofio-images", cover)}
              alt={`${project.title} project`}
              loading="lazy"
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => {
                setPreviews((current) => ({
                  ...current,
                  [project.id]: {
                    failed: true,
                  },
                }));
              }}
            />
          ) : (
            <div className="project-image-fallback" aria-hidden="true" />
          )}
        </div>
        <div className="project-meta">
          <div>
            <h3>{project.title}</h3>
            <p>{project.year ?? "Selected work"}</p>
          </div>
          <div className="text-right">
            <p>{project.service ?? project.summary}</p>
            <ArrowUpRight />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={all ? "project-grid-groups project-grid-all" : "project-grid-groups"}>
      <div className="project-grid project-grid-mixed">{projects.map(renderProject)}</div>
    </div>
  );
}
