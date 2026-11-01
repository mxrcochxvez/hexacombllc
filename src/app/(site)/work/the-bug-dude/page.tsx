import type { Metadata } from "next";
import ProjectStory from "@/components/ProjectStory";
import { projectStories } from "@/lib/project-stories";
import { pageSocialMetadata } from "@/lib/seo";
const project = projectStories["the-bug-dude"];
const title = `${project.name} Website Design Project`;
export const metadata: Metadata = {
  title,
  description: project.description,
  alternates: { canonical: "/work/the-bug-dude" },
  ...pageSocialMetadata(
    "/work/the-bug-dude",
    `${title} | Hexacomb`,
    project.description,
  ),
};
export default function Page() {
  return <ProjectStory slug="the-bug-dude" />;
}
