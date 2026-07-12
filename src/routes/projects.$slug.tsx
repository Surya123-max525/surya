import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { projectBySlugQueryOptions, projectsQueryOptions, type Project } from "@/data/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params, context }) => {
    const project = await context.queryClient.ensureQueryData(
      projectBySlugQueryOptions(params.slug),
    );
    if (!project) throw notFound();
    context.queryClient.prefetchQuery(projectsQueryOptions());
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    return {
      meta: [
        { title: `${p.name} — Case Study · Nithin Annamalai` },
        { name: "description", content: p.desc },
        { property: "og:title", content: `${p.name} — Case Study` },
        { property: "og:description", content: p.desc },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectModal,
});

function ProjectNotFound() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-6">
      <div className="glass rounded-3xl p-10 text-center">
        <div className="text-xs uppercase tracking-widest text-primary">404</div>
        <h1 className="mt-3 font-display text-3xl">Project not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">This case study doesn't exist.</p>
        <Link
          to="/"
          hash="Projects"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
        >
          Back to projects
        </Link>
      </div>
    </div>
  );
}

function ProjectModal() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectBySlugQueryOptions(slug));
  const { data: all } = useSuspenseQuery(projectsQueryOptions());
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/", hash: "Projects" });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate]);

  if (!project) return <ProjectNotFound />;
  const currentProject: Project = project;
  const others = (all ?? []).filter((p) => p.slug !== currentProject.slug).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-xl">
      {/* Backdrop */}
      <Link to="/" hash="Projects" aria-label="Close case study" className="fixed inset-0 z-0" />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, oklch(0.78 0.15 85 / 0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, oklch(0.62 0.14 75 / 0.35), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto my-6 w-[95%] max-w-5xl md:my-12"
      >
        <article className="glass-strong overflow-hidden rounded-3xl">
          {/* Header */}
          <header className="relative overflow-hidden border-b border-primary/10 px-6 pt-8 pb-10 md:px-12 md:pt-12">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, oklch(0.78 0.15 85 / 0.2), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.62 0.14 75 / 0.2), transparent 50%)",
              }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {project.tag}
                </div>
                <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                  <span className="text-gradient-gold">{project.name}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                  {project.desc}
                </p>
              </div>
              <Link
                to="/"
                hash="Projects"
                aria-label="Close"
                className="grid h-10 w-10 flex-none place-items-center rounded-full border border-primary/30 bg-background/60 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Link>
            </div>

            <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MetaCell label="Role" value={project.role} />
              <MetaCell label="Timeline" value={project.timeline} />
              <MetaCell label="Category" value={project.tag} />
              <MetaCell
                label="Stack"
                value={project.tech.slice(0, 2).join(", ") + (project.tech.length > 2 ? "…" : "")}
              />
            </div>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary to-[oklch(0.62_0.14_75)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_oklch(0.78_0.15_85/0.35)] transition-transform hover:scale-105"
              >
                Live demo <Arrow />
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <GitHubIcon /> View source
              </a>
            </div>
          </header>

          {/* Body */}
          <div className="px-6 py-10 md:px-12 md:py-14">
            {/* Hero art */}
            <div className="relative mb-12 aspect-[16/8] w-full overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[oklch(0.15_0.02_75)] to-[oklch(0.08_0.005_60)]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, oklch(0.78 0.15 85) 0%, transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.62 0.14 75) 0%, transparent 50%)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center font-display text-[10rem] leading-none text-primary/40">
                {project.name.charAt(0)}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            <Section title="Overview">{project.overview}</Section>
            <Section title="The Problem">{project.problem}</Section>
            <Section title="The Solution">{project.solution}</Section>

            {/* Highlights */}
            <div className="mb-12">
              <SectionTitle>Highlights</SectionTitle>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {project.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4"
                  >
                    <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/20 text-[10px] text-primary">
                      ◆
                    </span>
                    <span className="text-sm text-foreground/90">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Stack */}
            <div className="mb-12">
              <SectionTitle>Tech Stack</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {project.stack.map((s) => (
                  <div key={s.label} className="rounded-2xl glass p-5">
                    <div className="text-[10px] uppercase tracking-widest text-primary">
                      {s.label}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.items.map((i) => (
                        <span
                          key={i}
                          className="rounded-full border border-primary/20 bg-background/40 px-2.5 py-1 text-xs"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="mb-4">
              <SectionTitle>Results</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {project.results.map((r) => (
                  <div key={r.label} className="rounded-2xl glass p-6 text-center">
                    <div className="font-display text-4xl font-bold text-gradient-gold">
                      {r.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <footer className="border-t border-primary/10 px-6 py-10 md:px-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary">
                  Interested?
                </div>
                <h3 className="mt-2 font-display text-2xl">
                  Let's build something like this together.
                </h3>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/"
                  hash="Contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-primary to-[oklch(0.62_0.14_75)] px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
                >
                  Get in touch <Arrow />
                </Link>
                <Link
                  to="/"
                  hash="Projects"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  All projects
                </Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Related */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-3 px-2 text-[10px] uppercase tracking-widest text-primary">
            <span className="h-px w-8 bg-primary" />
            More case studies
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/projects/$slug"
                params={{ slug: o.slug }}
                className="group rounded-2xl glass p-5 transition-all hover:-translate-y-1 hover:gold-glow"
              >
                <div className="text-[10px] uppercase tracking-widest text-primary">{o.tag}</div>
                <div className="mt-2 font-display text-xl">{o.name}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.desc}</div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary opacity-80 transition-opacity group-hover:opacity-100">
                  Read case study <Arrow />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="my-10 text-center text-xs text-muted-foreground">
          Press{" "}
          <kbd className="mx-1 rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-primary">
            Esc
          </kbd>{" "}
          or click outside to close
        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <SectionTitle>{title}</SectionTitle>
      <p className="text-base leading-relaxed text-foreground/85">{children}</p>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 font-display text-2xl">
      <span className="h-px w-8 bg-primary" />
      {children}
    </h2>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/15 bg-background/30 px-4 py-3">
      <div className="text-[9px] uppercase tracking-widest text-primary">{label}</div>
      <div className="mt-1 truncate text-sm text-foreground">{value}</div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
