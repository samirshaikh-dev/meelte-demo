import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

/**
 * Shared breadcrumb navigation — single source of truth for every page trail.
 *
 * Renders a labelled `<nav>` landmark containing an ordered list, with the
 * final entry marked `aria-current="page"` so assistive technology can convey
 * the user's location without relying on visual styling alone.
 *
 * @param {Object} props
 * @param {Array<{ name: string, path?: string }>} props.items - Ordered trail; the last item is the current page.
 * @param {string} [props.className] - Applied to the outer <nav>, for page-level spacing.
 * @param {string} [props.listClassName] - Applied to the <ol>, e.g. "justify-center".
 */
export function Breadcrumbs({ items = [], className, listClassName }) {
  if (items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-xs text-foreground-secondary",
          listClassName
        )}
      >
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;
          return (
            <React.Fragment key={`${item.name}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="text-foreground-muted">
                  /
                </li>
              )}
              <li
                className={isCurrent ? "font-semibold text-foreground" : undefined}
                aria-current={isCurrent ? "page" : undefined}
              >
                {isCurrent || !item.path ? (
                  item.name
                ) : (
                  <Link
                    href={item.path}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
