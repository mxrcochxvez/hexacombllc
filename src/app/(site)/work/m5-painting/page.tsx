import type { Metadata } from "next";
import ProjectStory from "@/components/ProjectStory";
import { projectStories } from "@/lib/project-stories";
import { pageSocialMetadata } from "@/lib/seo";
const project = projectStories["m5-painting"];
const title = `${project.name} Website Design Project`;
export const metadata: Metadata = {
  title,
  description: project.description,
  alternates: { canonical: "/work/m5-painting" },
  ...pageSocialMetadata(
    "/work/m5-painting",
    `${title} | Hexacomb`,
    project.description,
  ),
};
export default function Page() {
  return <ProjectStory slug="m5-painting" />;
}
