import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ToolsBackground } from "@/components/ToolsBackground";
import { professionals } from "@/data/professionals";

export const Route = createFileRoute("/professional/$id")({
  component: ProfessionalPage,
  head: ({ params }) => ({
    meta: [{ title: `${params.id} — Ustaadly` }],
  }),
});

function ProfessionalPage() {
  const { id } = useParams({ from: "/professional/$id" });
  const pro = professionals.find((p) => p.id === id);

  if (!pro) {
    return (
      <ToolsBackground>
        <div className="p-12 text-white">Professional not found. <Link to="/home" className="text-brand underline">Back home</Link></div>
      </ToolsBackground>
    );
  }

  return (
    <ToolsBackground overlay="bg-navy/60">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/home" className="inline-flex items-center gap-1 rounded-full bg-navy/60 p-3 text-brand transition hover:scale-110">
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[320px_1fr]">
          <div className="animate-float-up">
            <img src={pro.photo} alt={pro.name} width={320} height={320} className="aspect-square w-full rounded-2xl object-cover shadow-2xl" />
          </div>

          <div className="rounded-2xl bg-card p-8 animate-float-up delay-100">
            <h1 className="text-3xl font-bold text-white">{pro.name}</h1>
            <h2 className="mt-1 text-2xl font-bold text-white">Certified {pro.trade}</h2>

            <Section title="About Me">{pro.about}</Section>
            <Section title="Contact Information">
              <ul className="list-disc pl-5 space-y-1">
                <li>Phone: {pro.phone}</li>
                <li>Email: {pro.email}</li>
                <li>Location: {pro.location}</li>
              </ul>
            </Section>
            <Section title="Education">
              <p className="font-semibold">{pro.education}</p>
              <p className="text-white/80">{pro.educationDetail}</p>
            </Section>
            <Section title="Languages">
              <ul className="list-disc pl-5">
                {pro.languages.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </Section>
          </div>
        </div>

        <div className="mt-10 max-w-md rounded-2xl bg-card p-8 animate-float-up delay-200">
          <h3 className="text-3xl font-bold text-white">Reviews</h3>
          <div className="mt-6 rounded-xl bg-navy/60 p-6 text-center text-white/80">No Reviews</div>
        </div>
      </div>
    </ToolsBackground>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-2 text-white/85 leading-relaxed">{children}</div>
    </div>
  );
}
