import { useState } from "react";
import { Plus, X } from "lucide-react";
import { services } from "@/data/site";
import { Button } from "@/components/ui/button";
export function ServicesList({ alwaysOpen = false, showDescriptions = false }: { alwaysOpen?: boolean; showDescriptions?: boolean }) { const [active,setActive]=useState("digital-products"); return <div className="service-list">{services.map(s=>{const open=alwaysOpen||active===s.id; return <article key={s.id} className="service-row"><Button variant="service" onClick={()=>{if(!alwaysOpen)setActive(open?"":s.id)}} aria-expanded={open} className="w-full"><span>{s.number}</span><strong>{s.title}</strong>{showDescriptions&&<em>{s.line}</em>}{open?<X/>:<Plus/>}</Button><div className={`service-reveal ${open?"service-open":""}`}><ul>{s.items.map(item=><li key={item.label}><span>{item.label}</span>{item.detail&&<small>{item.detail}</small>}</li>)}</ul></div></article>})}</div> }
