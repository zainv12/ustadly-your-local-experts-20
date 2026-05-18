import pattern from "@/assets/tools-pattern.jpg";

export function ToolsBackground({ children, overlay = "bg-navy/40" }: { children: React.ReactNode; overlay?: string }) {
  return (
    <div className="tools-surface relative min-h-screen w-full" style={{ "--tools-bg": `url(${pattern})` } as React.CSSProperties}>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
