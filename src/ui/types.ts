import type { ReactNode } from "react";
import type { Density } from "./roles";

export type PageWidth = "shell" | "content" | "narrow";

export type PageProps = {
  density: Density;
  width?: PageWidth;
  children: ReactNode;
};

export type SectionPad = "flush" | "section" | "hero";

export type SectionProps = {
  pad?: SectionPad;
  tone?: "canvas" | "deep";
  labeledBy?: string;
  className?: string;
  children: ReactNode;
};

export type StackGap = "tight" | "stack";

export type StackProps = {
  gap?: StackGap;
  as?: "div" | "form";
  children: ReactNode;
};

export type ClusterGap = "tight" | "cluster";

export type ClusterProps = {
  gap?: ClusterGap;
  children: ReactNode;
};

export type PanelProps = {
  children: ReactNode;
};

export type ButtonIntent = "solid" | "signal" | "quiet" | "ghost";

type ButtonShared = {
  intent?: ButtonIntent;
  pending?: boolean;
  fill?: boolean;
  children: ReactNode;
};

export type ButtonAsButton = ButtonShared &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: never;
  };

export type ButtonAsLink = ButtonShared & {
  href: string;
  type?: never;
  "data-track"?: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};
