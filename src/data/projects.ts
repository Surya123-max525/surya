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

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "slug,name,tag,description,tech,github_url,demo_url,timeline,role,overview,problem,solution,highlights,stack,results,sort_order",
        )
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => mapProject(row as ProjectRow));
    },
  });

export const projectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "slug,name,tag,description,tech,github_url,demo_url,timeline,role,overview,problem,solution,highlights,stack,results",
        )
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProject(data as ProjectRow) : null;
    },
  });

export const skillGroupsQueryOptions = () =>
  queryOptions({
    queryKey: ["skill_groups"],
    queryFn: async (): Promise<SkillGroup[]> => {
      const { data, error } = await supabase
        .from("skill_groups")
        .select("title,items,sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({ title: r.title, items: r.items ?? [] }));
    },
  });

export const experiencesQueryOptions = () =>
  queryOptions({
    queryKey: ["experiences"],
    queryFn: async (): Promise<Experience[]> => {
      const { data, error } = await supabase
        .from("experiences")
        .select("role,period,description,sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({ role: r.role, period: r.period, desc: r.description }));
    },
  });

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: ["stats"],
    queryFn: async (): Promise<Stat[]> => {
      const { data, error } = await supabase
        .from("stats")
        .select("label,value,sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => ({ label: r.label, value: r.value }));
    },
  });
