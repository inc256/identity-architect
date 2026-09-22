import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
export function ProjectGrid({ all = false }: { all?: boolean }) { return <div className={`project-grid ${all ? "project-grid-all" : ""}`}>{projects.map((p,i)=><Link key={p.slug} to="/work/$slug" params={{slug:p.slug}} className={`project-card project-${i+1}`}><div className="project-image"><img src={p.image} alt={`${p.name} fictional concept identity presentation`} loading="lazy" width={p.width} height={p.height}/><span className="concept-tag">Concept project</span></div><div className="project-meta"><div><h3>{p.name}</h3><p>{p.industry}</p></div><div className="text-right"><p>{p.services}</p><ArrowUpRight/></div></div></Link>)}</div> }
