import { useState } from "react";
import { Plus, X } from "lucide-react";
import { services } from "@/data/site";
import { Button } from "@/components/ui/button";
export function ServicesList() { const [active,setActive]=useState("strategy"); return <div className="service-list">{services.map(s=>{const open=active===s.id; return <article key={s.id} className="service-row"><Button variant="service" onClick={()=>setActive(open?"":s.id)} aria-expanded={open} className="w-full"><span>{s.number}</span><strong>{s.title}</strong><em>{s.line}</em>{open?<X/>:<Plus/>}</Button><div className={`service-reveal ${open?"service-open":""}`}><ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>{s.id==="digital"&&<p>From identity into serious digital products and experiences.</p>}</div></article>})}</div> }
