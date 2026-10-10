import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getPublicImageUrl, type PortfolioProject } from "@/lib/cms";

type ProjectPreview = {
  orientation: "portrait" | "landscape";
  aspectRatio: number;
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

  const portraitProjects = projects.filter(
    (project) => previews[project.id]?.orientation === "portrait",
  );
  const landscapeProjects = projects.filter(
    (project) =>
      (!project.image_paths[0] && !previews[project.id]) ||
      previews[project.id]?.orientation === "landscape",
  );
  const pendingProjects = projects.filter(
    (project) => project.image_paths[0] && !previews[project.id],
  );

  const renderProject = (project: PortfolioProject, pending = false) => {
    const cover = project.image_paths[0];
    const preview = previews[project.id];
    const orientation = preview?.orientation;

    return (
      <Link
        key={project.id}
        to="/work/$slug"
        params={{ slug: project.slug }}
        className={`project-card ${pending ? "project-card-pending" : `project-card-${orientation ?? "landscape"}`}`}
      >
        <div
          className="project-image"
          style={{
            aspectRatio: preview?.aspectRatio
              ? `${preview.aspectRatio}`
              : cover && !pending
                ? "3 / 2"
                : undefined,
          }}
        >
          {cover && !preview?.failed ? (
            <img
              src={getPublicImageUrl("portofio-images", cover)}
              alt={`${project.title} project`}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                setPreviews((current) => ({
                  ...current,
                  [project.id]: {
                    orientation: naturalHeight > naturalWidth ? "portrait" : "landscape",
                    aspectRatio: naturalWidth / naturalHeight,
                  },
                }));
              }}
              onError={() => {
                setPreviews((current) => ({
                  ...current,
                  [project.id]: {
                    orientation: "landscape",
                    aspectRatio: 3 / 2,
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
      {pendingProjects.length > 0 && (
        <div className="project-grid project-grid-pending" aria-label="Loading project previews">
          {pendingProjects.map((project) => renderProject(project, true))}
        </div>
      )}
      {landscapeProjects.length > 0 && (
        <section className="project-orientation-section" aria-label="Landscape projects">
          <div className="project-grid project-grid-landscape">
            {landscapeProjects.map(renderProject)}
          </div>
        </section>
      )}
      {portraitProjects.length > 0 && (
        <section className="project-orientation-section" aria-label="Portrait projects">
          <div className="project-grid project-grid-portrait">
            {portraitProjects.map(renderProject)}
          </div>
        </section>
      )}
    </div>
  );
}
