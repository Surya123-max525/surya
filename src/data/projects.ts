import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StackGroup = { label: string; items: string[] };
export type ResultMetric = { label: string; value: string };

export type Project = {
  slug: string;
  name: string;
  tag: string;
  desc: string;
  tech: string[];
  github: string;
  demo: string;
  overview: string;
  problem: string;
  solution: string;
  highlights: string[];
  stack: StackGroup[];
  results: ResultMetric[];
  timeline: string;
  role: string;
};

export type SkillGroup = { title: string; items: string[] };
export type Experience = { role: string; period: string; desc: string };
export type Stat = { label: string; value: number };

type ProjectRow = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  tech: string[] | null;
  github_url: string;
  demo_url: string;
  timeline: string | null;
  role: string | null;
  overview: string | null;
  problem: string | null;
  solution: string | null;
  highlights: string[] | null;
  stack: unknown;
  results: unknown;
};

function mapProject(r: ProjectRow): Project {
  return {
    slug: r.slug,
    name: r.name,
    tag: r.tag,
    desc: r.description,
    tech: r.tech ?? [],
    github: r.github_url,
    demo: r.demo_url,
    timeline: r.timeline ?? "",
    role: r.role ?? "",
    overview: r.overview ?? "",
    problem: r.problem ?? "",
    solution: r.solution ?? "",
    highlights: r.highlights ?? [],
    stack: (r.stack as StackGroup[] | null) ?? [],
    results: (r.results as ResultMetric[] | null) ?? [],
  };
}

const LOCAL_PROJECTS_FALLBACK: Project[] = [
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    tag: "IoT & Full Stack App",
    desc: "A full-stack Temperature Converter with real-time conversion, database storage & modern UI",
    tech: ["HTML", "CSS", "JavaScript", "Python", "Flask", "MySQL"],
    github: "https://github.com/Surya123-max525/Temperature_converter",
    demo: "#",
    timeline: "July 2026",
    role: "Full Stack Developer",
    overview: "This project is a full-stack web application that allows users to convert temperature values across multiple units while maintaining a history of conversions using a MySQL database.",
    problem: "Manual temperature conversion is time-consuming, error-prone, and lacks tracking.",
    solution: "We solved this by building an instant conversion engine with a robust MySQL history log, accessible via a beautiful, clean, responsive web dashboard.",
    highlights: [
      "Real-Time Conversion Engine (Celsius, Fahrenheit, Kelvin)",
      "MySQL database integration to store conversion history",
      "Modern animated UI/UX design with clean typography",
      "Smart logic handling for input validation and error handling"
    ],
    stack: [
      { label: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
      { label: "Backend", items: ["Python (Flask)"] },
      { label: "Database", items: ["MySQL"] }
    ],
    results: [
      { label: "Units Supported", value: "3 (C, F, K)" },
      { label: "DB Integration", value: "MySQL History Log" }
    ]
  }
];

const LOCAL_SKILLS_FALLBACK: SkillGroup[] = [
  {
    title: "AI & Machine Learning",
    items: ["Python", "TensorFlow", "PyTorch", "NLP", "Scikit-Learn"]
  },
  {
    title: "Full Stack Development",
    items: ["React", "TypeScript", "Node.js", "Express", "Flask", "Next.js"]
  },
  {
    title: "Database & Cloud",
    items: ["MySQL", "PostgreSQL", "Supabase", "MongoDB", "AWS"]
  },
  {
    title: "IoT & Embedded Systems",
    items: ["Arduino", "Raspberry Pi", "C/C++", "Sensors & Actuators"]
  }
];

const LOCAL_EXPERIENCES_FALLBACK: Experience[] = [
  {
    role: "AI & Full Stack Developer",
    period: "2024 - Present",
    desc: "Developing modern web applications and AI-driven systems. Implementing IoT integrations and real-time database applications."
  },
  {
    role: "IoT Research Intern",
    period: "2023 - 2024",
    desc: "Designed and built embedded systems, microcontrollers prototypes, and telemetry data collection systems."
  }
];

const LOCAL_STATS_FALLBACK: Stat[] = [
  { label: "Completed Projects", value: 12 },
  { label: "Years Experience", value: 2 },
  { label: "Git Commits", value: 340 }
];

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            "slug,name,tag,description,tech,github_url,demo_url,timeline,role,overview,problem,solution,highlights,stack,results,sort_order",
          )
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data && data.length > 0
          ? data.map((row) => mapProject(row as ProjectRow))
          : LOCAL_PROJECTS_FALLBACK;
      } catch (err) {
        console.warn("Error fetching projects, falling back to local data:", err);
        return LOCAL_PROJECTS_FALLBACK;
      }
    },
  });

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: async (): Promise<Project | null> => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            "slug,name,tag,description,tech,github_url,demo_url,timeline,role,overview,problem,solution,highlights,stack,results",
          )
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          return mapProject(data as ProjectRow);
        }
      } catch (err) {
        console.warn(`Error fetching project ${slug}, checking fallback:`, err);
      }
      return LOCAL_PROJECTS_FALLBACK.find((p) => p.slug === slug) ?? null;
    },
  });

export const skillGroupsQueryOptions = () =>
  queryOptions({
    queryKey: ["skill_groups"],
    queryFn: async (): Promise<SkillGroup[]> => {
      try {
        const { data, error } = await supabase
          .from("skill_groups")
          .select("title,items,sort_order")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data && data.length > 0
          ? data.map((r) => ({ title: r.title, items: r.items ?? [] }))
          : LOCAL_SKILLS_FALLBACK;
      } catch (err) {
        console.warn("Error fetching skill groups, falling back:", err);
        return LOCAL_SKILLS_FALLBACK;
      }
    },
  });

export const experiencesQueryOptions = () =>
  queryOptions({
    queryKey: ["experiences"],
    queryFn: async (): Promise<Experience[]> => {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("role,period,description,sort_order")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data && data.length > 0
          ? data.map((r) => ({ role: r.role, period: r.period, desc: r.description }))
          : LOCAL_EXPERIENCES_FALLBACK;
      } catch (err) {
        console.warn("Error fetching experiences, falling back:", err);
        return LOCAL_EXPERIENCES_FALLBACK;
      }
    },
  });

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: ["stats"],
    queryFn: async (): Promise<Stat[]> => {
      try {
        const { data, error } = await supabase
          .from("stats")
          .select("label,value,sort_order")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        return data && data.length > 0
          ? data.map((r) => ({ label: r.label, value: r.value }))
          : LOCAL_STATS_FALLBACK;
      } catch (err) {
        console.warn("Error fetching stats, falling back:", err);
        return LOCAL_STATS_FALLBACK;
      }
    },
  });

