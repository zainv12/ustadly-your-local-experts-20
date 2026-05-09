import pattern from "@/assets/tools-pattern.jpg";

export function ToolsBackground({ children, overlay = "bg-navy/40" }: { children: React.ReactNode; overlay?: string }) {
  return (
    <div className="relative min-h-screen w-full" style={{ backgroundImage: `url(${pattern})`, backgroundSize: "700px", backgroundRepeat: "repeat" }}>
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
