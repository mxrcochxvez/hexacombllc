import type { FormEventHandler, ReactNode } from "react";
import type { StackGap } from "./types";

type StackProps = {
  gap?: StackGap;
  children: ReactNode;
} & (
  | { as?: "div" }
  | { as: "form"; onSubmit?: FormEventHandler<HTMLFormElement> }
);

export function Stack(props: StackProps) {
  const gap = props.gap ?? "stack";
  if (props.as === "form") {
    return (
      <form className="ui-stack" data-gap={gap} onSubmit={props.onSubmit}>
        {props.children}
      </form>
    );
  }
  return (
    <div className="ui-stack" data-gap={gap}>
      {props.children}
    </div>
  );
}
