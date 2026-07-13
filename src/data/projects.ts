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
  image?: string;
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
    github: import.meta.env.VITE_PROJECT_TEMP_GITHUB || "https://github.com/Surya123-max525/Temperature_converter",
    demo: import.meta.env.VITE_PROJECT_TEMP_DEMO || "https://github.com/Surya123-max525/Temperature_converter",
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
    ],
    image: "/temp-converter.png"
  },
  {
    slug: "uniconvert-master-suite",
    name: "UniConvert Master Suite",
    tag: "Utility Web App",
    desc: "A modern, fast, and responsive all-in-one unit conversion web application built with React, TypeScript, and Vite.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Bun"],
    github: import.meta.env.VITE_PROJECT_UNI_GITHUB || "https://github.com/Surya123-max525/uniconvert-master-suite",
    demo: import.meta.env.VITE_PROJECT_UNI_DEMO || "https://github.com/Surya123-max525/uniconvert-master-suite",
    timeline: "July 2026",
    role: "Frontend Developer",
    overview: "UniConvert Master Suite is an all-in-one web utility designed for conversion of Length, Weight, Temperature, Power, Energy, Speed, Data Storage, Area, Volume, Time, and Currency.",
    problem: "Traditional converters require switching between multiple single-purpose tools, are sluggish, lack mobile responsiveness, and lack consistent dark/light themes.",
    solution: "A fast, unified converter built with Vite and Tailwind CSS that is fully responsive, supports 10+ categories of unit conversion, and features light/dark mode for ultimate UX convenience.",
    highlights: [
      "Supports 10+ conversion categories including Length, Weight, Power, and Speed",
      "Fully responsive modern UI designed with Tailwind CSS",
      "Smooth Dark/Light mode theme switching",
      "Built with TypeScript and powered by Vite & Bun for instant load speeds"
    ],
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { label: "Build Tool", items: ["Vite", "Bun"] },
      { label: "Deployment", items: ["Vercel"] }
    ],
    results: [
      { label: "Conversion Modes", value: "10+ Categories" },
      { label: "Performance Score", value: "99+ Lighthouse" }
    ],
    image: "/uniconvert.png"
  },
  {
    slug: "ieee-sb-srec",
    name: "IEEE Student Branch SREC",
    tag: "Student Branch Portal",
    desc: "A modern, responsive website for the IEEE Student Branch at Sri Ramakrishna Engineering College, Coimbatore.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Supabase"],
    github: import.meta.env.VITE_PROJECT_IEEE_GITHUB || "https://github.com/moonlightgintani/srecieeesb",
    demo: import.meta.env.VITE_PROJECT_IEEE_DEMO || "https://new-ieee.vercel.app",
    timeline: "2024 - 2025",
    role: "Lead Developer",
    overview: "Official portal for the IEEE Student Branch of Sri Ramakrishna Engineering College (SREC) containing event history, office bearers details, advisors list, and society chapters.",
    problem: "Students needed a central portal to check for upcoming events, join societies, and view past achievements/office bearers info.",
    solution: "Designed a fully responsive web application with a Supabase database backing, custom components for society chapters, and interactive activity logging.",
    highlights: [
      "Hosts event logs of over 46+ branch activities from 2020-2025",
      "Integrated details of office bearers, advisors, and societies chapters",
      "Backed by a relational PostgreSQL/Supabase database structure",
      "Smooth interface design utilizing Tailwind CSS and shadcn/ui"
    ],
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
      { label: "Backend/Database", items: ["Supabase (PostgreSQL)"] }
    ],
    results: [
      { label: "Activities Tracked", value: "46+ Events" },
      { label: "Student Reach", value: "1000+ members" }
    ],
    image: "/ieee-sb-srec.png"
  },
  {
    slug: "icaectsd-2027",
    name: "ICAECTSD 2027",
    tag: "Conference Web App",
    desc: "Official website for the IEEE International Conference on Advances in Engineering and Computing Technologies for Sustainable Development (ICAECTSD 2027) at SREC.",
    tech: ["React", "TypeScript", "Vite", "Framer Motion", "Firebase", "Supabase"],
    github: import.meta.env.VITE_PROJECT_AECTSD_GITHUB || "https://github.com/ranjithkumarrajakannaian99-ops/aectsd2027",
    demo: import.meta.env.VITE_PROJECT_AECTSD_DEMO || "https://aectsd.vercel.app",
    timeline: "July 2026",
    role: "Full Stack Developer",
    overview: "International Conference web portal for ICAECTSD 2027 organized by Sri Ramakrishna Engineering College, hosting papers submissions guidelines, committee member records, keynote speakers, workshops, and registrations.",
    problem: "Managing thousands of registration files, receipts, workshops, keynote slides, and guidelines across EEE, ECE, EIE, BME, CSE, and IT departments in a single reliable portal.",
    solution: "A scalable web app using Framer Motion for interactive transitions, Firebase for storage/auth, and Supabase for structured data tables. Features an AI-powered SREC Conference Assistant chatbot (Nexus) for fast queries.",
    highlights: [
      "CMT Microsoft portal integration for paper submission tracking",
      "Interactive 'Nexus' chatbot to resolve query FAQs automatically",
      "Interactive guidelines, map directions, and regional exploration tools",
      "Robust administrator dashboard console to manage dates, announcements, and registrations"
    ],
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Framer Motion", "Tailwind CSS"] },
      { label: "Backend/Database", items: ["Supabase", "Firebase Auth/Storage"] },
      { label: "Integration", items: ["Microsoft CMT API", "EmailJS"] }
    ],
    results: [
      { label: "Target Audience", value: "Global Researchers" },
      { label: "AI Support", value: "24/7 Chatbot (Nexus)" }
    ],
    image: "/icaectsd.png"
  },
  {
    slug: "performance-card-generator",
    name: "Performance Card Generator",
    tag: "Data & PDF Utility",
    desc: "An automated batch report card generation dashboard designed for Amrita Vidyalayam schools.",
    tech: ["React", "TypeScript", "Tailwind CSS", "xlsx", "html2pdf.js"],
    github: import.meta.env.VITE_PROJECT_PERF_GITHUB || "https://github.com/Surya123-max525",
    demo: import.meta.env.VITE_PROJECT_PERF_DEMO || "#",
    timeline: "Dec 2025",
    role: "Lead Developer",
    overview: "Performance Card Generator is a batch automation utility built for Amrita Vidyalayam, Nallampalayam, to ingestion sheets of periodic test marks, edit parameters dynamically, and render print-ready batch report card PDFs.",
    problem: "Teachers spent hours copy-pasting grades for subjects (English, Business Studies, Accountancy, Economics, Mathematics, PE) for individual student cards, introducing typographical risks.",
    solution: "Designed a clean, single-page client tool using SheetJS to parse Excel templates, dynamically preview individual cards, validate totals, and render batch PDF reports cleanly mapped to printers.",
    highlights: [
      "Dynamic Excel parsing backing for English, Business Studies, and core subject marks",
      "Real-time student card details editing interface",
      "Print-optimized CSS layouts mapping perfectly to physical card formats",
      "One-click high-fidelity batch PDF export with custom filename naming"
    ],
    stack: [
      { label: "Frontend Stack", items: ["React", "TypeScript", "Tailwind CSS"] },
      { label: "File Parsers", items: ["xlsx (SheetJS)", "html2pdf.js"] }
    ],
    results: [
      { label: "Teacher Hours", value: "Reduced by 95%" },
      { label: "Data Quality", value: "100% Error-Free" }
    ],
    image: "/performance-card.png"
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

