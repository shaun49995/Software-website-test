import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import { Reveal } from "~/components/Reveal";

export function SectionHeading({
  index,
  tag,
  title,
  children,
}: {
  index: string;
  tag: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <Badge className="mb-5">
          <span className="text-faint">{index}</span>
          {tag}
        </Badge>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-mute">
            {children}
          </p>
        </Reveal>
      )}
    </div>
  );
}
