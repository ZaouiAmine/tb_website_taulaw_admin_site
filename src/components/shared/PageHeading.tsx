import React from "react";

export default function PageHeading({
  heading,
  path,
  children,
}: {
  heading: string;
  path: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground capitalize">{path}</p>
        <h2 className="text-xl md:text-3xl font-semibold mb-4 capitalize text-primary">
          {heading}
        </h2>
      </div>
      {children}
    </div>
  );
}
