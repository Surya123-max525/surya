import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import profileImg from "@/assets/profile.jpg";
import {
  projectsQueryOptions,
  skillGroupsQueryOptions,
  experiencesQueryOptions,
  statsQueryOptions,
  type Project,
} from "@/data/projects";

const HeroScene = lazy(() => import("@/components/portfolio/HeroScene"));
const TechSphereScene = lazy(() => import("@/components/portfolio/TechSphereScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Surya Narayanan K S — AI Engineer & Full Stack Developer" },
      {
        name: "description",
        content:
          "AI engineer, full stack developer, IoT innovator. Explore projects, skills and achievements crafted with a cinematic black-and-gold aesthetic.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(projectsQueryOptions());
    context.queryClient.prefetchQuery(skillGroupsQueryOptions());
    context.queryClient.prefetchQuery(experiencesQueryOptions());
    context.queryClient.prefetchQuery(statsQueryOptions());
  },
  component: Portfolio,
});

const NAV = ["Home", "About", "Skills", "Projects", "Experience", "Achievements", "Contact"];

const ROLES = [
  "AI Engineer",
  "Full Stack Developer",
  "IoT Innovator",
  "Embedded Systems Enthusiast",
];

function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground />
      <CursorGlow />
      <Nav scrolled={scrolled} active={activeSection} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- Ambient BG ---------------- */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-30 bg-radial-ambient-1" />
      <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full opacity-25 bg-radial-ambient-2" />
      <div className="absolute inset-0 opacity-[0.04] bg-grid-ambient" />
    </div>
  );
}

/* ---------------- Cursor ---------------- */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[400px] w-[400px] rounded-full opacity-30 mix-blend-screen md:block bg-cursor-glow"
    />
  );
}

/* ---------------- Nav ---------------- */
function Nav({ scrolled, active }: { scrolled: boolean; active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full px-4 py-3 transition-all duration-500 md:top-6 md:px-6 ${
        scrolled ? "glass-strong w-[95vw] max-w-4xl" : "glass w-[95vw] max-w-3xl"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="#Home" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 font-display text-primary">
            N
          </span>
          <span className="hidden font-display text-sm tracking-widest text-primary sm:inline">
            Surya
          </span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n}`}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active === n ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
              {active === n && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10 ring-1 ring-primary/30"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>
        <a
          href="#Contact"
          className="hidden rounded-full bg-linear-to-b from-primary to-[oklch(0.62_0.14_75)] px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_4px_20px_oklch(0.78_0.15_85/0.4)] transition-transform hover:scale-105 md:inline-flex"
        >
          Let's talk
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary" aria-label="menu">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="mt-3 grid grid-cols-2 gap-2 pt-2">
              {NAV.map((n) => (
                <a
                  key={n}
                  href={`#${n}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  {n}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

const orbitClasses: Record<number, string> = {
  0: "orbit-dot-0",
  60: "orbit-dot-60",
  120: "orbit-dot-120",
  180: "orbit-dot-180",
  240: "orbit-dot-240",
  300: "orbit-dot-300",
};

/* ---------------- Hero ---------------- */
function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIdx];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting && typed.length < current.length) setTyped(current.slice(0, typed.length + 1));
      else if (!deleting && typed.length === current.length)
        setTimeout(() => setDeleting(true), 1400);
      else if (deleting && typed.length > 0) setTyped(current.slice(0, typed.length - 1));
      else if (deleting && typed.length === 0) {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % ROLES.length);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, roleIdx]);

  return (
    <section
      id="Home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background/40 via-transparent to-background" />

      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Available for select engagements
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
          >
            <span className="block text-foreground">SURYA</span>
            <span className="block text-gradient-gold">NARAYANAN K S</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 flex items-center gap-3 text-lg text-muted-foreground sm:text-xl"
          >
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono text-foreground">
              {typed}
              <span className="caret" />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6 max-w-lg text-base text-muted-foreground/90 sm:text-lg"
          >
            Engineering intelligent systems where AI, embedded hardware, and thoughtful design
            converge — with a cinematic, uncompromising sense of craft.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#Projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-primary to-[oklch(0.62_0.14_75)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_oklch(0.78_0.15_85/0.35)] transition-all hover:scale-105 hover:shadow-[0_10px_60px_oklch(0.78_0.15_85/0.6)]"
            >
              <span className="relative z-10">View Projects</span>
              <ArrowIcon />
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#Contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
            >
              Contact Me
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Download Resume <DownloadIcon />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative mx-auto hidden lg:block"
        >
          <div className="relative h-[440px] w-[440px]">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full border border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-14 rounded-full border-2 border-dashed border-primary/40 animate-[spin_25s_linear_infinite]" />
            <div className="absolute inset-20 overflow-hidden rounded-full ring-2 ring-primary/60 gold-glow animate-pulse-glow">
              <img
                src={profileImg}
                alt="Surya Narayanan K S"
                className="h-full w-full object-cover"
                width={816}
                height={816}
              />
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div key={i} className={`absolute left-1/2 top-1/2 h-3 w-3 ${orbitClasses[deg]}`}>
                <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_oklch(0.78_0.15_85/0.8)]" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <span className="tracking-[0.3em]">SCROLL</span>
          <div className="h-10 w-px bg-linear-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
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
function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-primary"
      >
        <span className="h-px w-8 bg-primary" />
        {eyebrow}
        <span className="h-px w-8 bg-primary" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 font-display text-4xl font-bold sm:text-5xl lg:text-6xl"
      >
        <span className="text-gradient-gold">{title}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="About" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow="About"
          title="Craft, code, and curiosity"
          subtitle="A relentless builder blending machine intelligence with physical computing to make software feel closer to magic."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {[
            {
              title: "AI Engineering",
              body: "Designing production-grade neural systems, retrieval architectures and multimodal reasoning stacks.",
              icon: "◉",
            },
            {
              title: "Full Stack",
              body: "Shipping polished web platforms end-to-end — typed, tested, and tuned for scale and clarity.",
              icon: "◆",
            },
            {
              title: "IoT & Embedded",
              body: "Prototyping intelligent physical devices from silicon to cloud — sensors, safety, automation.",
              icon: "◈",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass p-8 transition-all duration-500 hover:-translate-y-2 hover:gold-glow"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:bg-primary/25" />
              <div className="relative">
                <div className="font-display text-4xl text-primary">{c.icon}</div>
                <h3 className="mt-4 font-display text-2xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
function Skills() {
  return (
    <section id="Skills" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Toolkit"
          title="Skills & Stack"
          subtitle="Modern tools sharpened over years of shipping AI, product, and hardware."
        />
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <Suspense fallback={<div className="h-full w-full rounded-full glass" />}>
              <TechSphereScene />
            </Suspense>
          </div>
          <SkillGroupsList />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
function Projects() {
  return (
    <section id="Projects" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Selected Work"
          title="Featured Projects"
          subtitle="A curated slice of what I've been building at the edge of AI, product and hardware."
        />
        <ProjectsGrid />
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setRot({ x: -py * 8, y: px * 8 });
  };
  const reset = () => setRot({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.08 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        transform: `perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}
      className="group relative overflow-hidden rounded-3xl glass p-6 hover:gold-glow"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-project-hover-gradient" />
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-[oklch(0.15_0.02_75)] to-[oklch(0.08_0.005_60)]">
        <div className="absolute inset-0 opacity-20 bg-project-card-radial" />
        <div className="absolute inset-0 grid place-items-center font-display text-5xl text-primary/40 transition-transform duration-700 group-hover:scale-110">
          {p.name.charAt(0)}
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-primary/30 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-primary backdrop-blur">
          {p.tag}
        </div>
      </div>
      <h3 className="mt-5 font-display text-2xl">{p.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span
            key={t}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4 text-xs">
        <Link
          to="/projects/$slug"
          params={{ slug: p.slug }}
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          Case study <ArrowIcon />
        </Link>
        <a
          href={p.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
        >
          GitHub <ArrowIcon />
        </a>
        <a
          href={p.demo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
        >
          Live Demo <ArrowIcon />
        </a>
      </div>
    </motion.div>
  );
}

/* ---------------- Experience ---------------- */
function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

  return (
    <section id="Experience" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Journey"
          title="Experience"
          subtitle="Momentum earned across research, product, and the hackathon circuit."
        />
        <div ref={ref} className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-primary/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 top-0 w-px bg-linear-to-b from-primary to-transparent md:left-1/2 md:-translate-x-1/2"
          />
          <ExperienceTimeline />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */
function Achievements() {
  return (
    <section id="Achievements" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="Impact" title="By the Numbers" />
        <StatsGrid />
      </div>
    </section>
  );
}

function Counter({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    const step = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="rounded-2xl glass p-8 text-center hover:gold-glow"
    >
      <div className="font-display text-5xl font-bold text-gradient-gold">{n}+</div>
      <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </motion.div>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <section id="Contact" className="relative py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow="Connect"
          title="Let's Build Together"
          subtitle="Have a project, research collaboration or idea worth shipping? The inbox is open."
        />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { label: "Email", value: "suryanarayananks2007@gmail.com"},
              { label: "GitHub", value: "@Surya Narayanan K S", href: "https://github.com/Surya123-max525" },
              { label: "LinkedIn", value: "in/Surya Narayanan K S", href: "https://www.linkedin.com/in/surya-narayanan-k-s/" },
              { label: "Instagram", value: "@shadow_peak_25", href: "https://instagram.com/shadow_peak_25" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex items-center justify-between rounded-2xl glass px-5 py-4 transition-all hover:-translate-y-1 hover:gold-glow"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-primary">
                    {c.label}
                  </div>
                  <div className="mt-0.5 text-sm text-foreground">{c.value}</div>
                </div>
                <ArrowIcon />
              </a>
            ))}
          </div>
          <form className="rounded-3xl glass p-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" placeholder="Your name" />
              <Field label="Email" placeholder="you@example.com" type="email" />
            </div>
            <div className="mt-4">
              <Field label="Subject" placeholder="A short subject" />
            </div>
            <div className="mt-4">
              <label className="text-[10px] uppercase tracking-widest text-primary">Message</label>
              <textarea
                rows={5}
                placeholder="Tell me about the project…"
                className="mt-2 w-full rounded-xl border border-primary/20 bg-background/40 px-4 py-3 text-sm outline-none transition-all focus:border-primary/60 focus:gold-glow"
              />
            </div>
            <button className="group mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-b from-primary to-[oklch(0.62_0.14_75)] px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 gold-glow">
              Send message <ArrowIcon />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-primary">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-primary/20 bg-background/40 px-4 py-3 text-sm outline-none transition-all focus:border-primary/60 focus:gold-glow"
      />
    </div>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="relative border-t border-primary/10 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 font-display text-primary">
            N
          </span>
          <span className="font-display text-sm tracking-widest text-primary">
            SURYA NARAYANAN K S
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} — Crafted with obsession. All rights reserved.
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <a href="https://github.com/Surya123-max525" className="hover:text-primary">
            GitHub
          </a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/surya-narayanan-k-s/" className="hover:text-primary">
            LinkedIn
          </a>
          <span>·</span>
          <a href="https://instagram.com/shadow_peak_25" className="hover:text-primary">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Data-backed lists ---------------- */

function SectionSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl glass" />
      ))}
    </div>
  );
}

function SkillGroupsList() {
  const { data, isLoading } = useQuery(skillGroupsQueryOptions());
  if (isLoading) return <SectionSkeleton rows={4} className="sm:grid-cols-2" />;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {(data ?? []).map((g, i) => (
        <motion.div
          key={g.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="group rounded-2xl glass p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:gold-glow"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {g.title}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {g.items.map((s) => (
              <span
                key={s}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-foreground/90 transition-colors group-hover:border-primary/40"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ProjectsGrid() {
  const { data, isLoading } = useQuery(projectsQueryOptions());
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-3xl glass" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(data ?? []).map((p, i) => (
        <ProjectCard key={p.slug} p={p} i={i} />
      ))}
    </div>
  );
}

function ExperienceTimeline() {
  const { data, isLoading } = useQuery(experiencesQueryOptions());
  if (isLoading) return <SectionSkeleton rows={3} />;
  return (
    <>
      {(data ?? []).map((e, i) => (
        <motion.div
          key={e.role}
          initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`relative mb-12 pl-14 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"}`}
        >
          <div
            className={`absolute top-2 h-4 w-4 rounded-full bg-primary shadow-[0_0_20px_oklch(0.78_0.15_85/0.7)] left-2.5 md:left-auto ${i % 2 === 0 ? "md:-right-2" : "md:-left-2"}`}
          />
          <div className="rounded-2xl glass p-6 hover:gold-glow">
            <div className="text-xs uppercase tracking-widest text-primary">{e.period}</div>
            <h3 className="mt-2 font-display text-xl">{e.role}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
}

function StatsGrid() {
  const { data, isLoading } = useQuery(statsQueryOptions());
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl glass" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {(data ?? []).map((s, i) => (
        <Counter key={s.label} label={s.label} value={s.value} delay={i * 0.1} />
      ))}
    </div>
  );
}
