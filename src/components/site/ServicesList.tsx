import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { getPublishedServices } from "@/lib/cms";

type ServiceGroups = Awaited<ReturnType<typeof getPublishedServices>>;

export function ServicesList({
  services,
  alwaysOpen = false,
  showDescriptions = false,
}: {
  services: ServiceGroups;
  alwaysOpen?: boolean;
  showDescriptions?: boolean;
}) {
  const [active, setActive] = useState(services[0]?.id ?? "");
  if (services.length === 0)
    return (
      <p className="empty-state">No services are currently published. Please check back soon.</p>
    );

  return (
    <div className="service-list">
      {services.map((service, index) => {
        const open = alwaysOpen || active === service.id;
        return (
          <article key={service.id} className="service-row">
            <Button
              variant="service"
              onClick={() => {
                if (!alwaysOpen) setActive(open ? "" : service.id);
              }}
              aria-expanded={open}
              className="w-full"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{service.name}</strong>
              {showDescriptions && <em>{service.description}</em>}
              {open ? <X /> : <Plus />}
            </Button>
            <div className={`service-reveal ${open ? "service-open" : ""}`}>
              <ul>
                {service.children.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    {item.description && <small>{item.description}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
