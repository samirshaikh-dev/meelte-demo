import React from 'react';

export function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-foreground">
        {title}
      </h3>
      <div className="text-sm text-foreground-secondary">{children}</div>
    </div>
  );
}

export default FooterColumn;
