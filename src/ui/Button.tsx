import Link from "next/link";
import type { ButtonProps } from "./types";

export function Button(props: ButtonProps) {
  const intent = props.intent ?? "solid";
  const pending = props.pending ?? false;
  const className = `ui-button ui-button--${intent}${props.fill ? " ui-button--fill" : ""}`;

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={className}
        aria-busy={pending || undefined}
        data-track={props["data-track"]}
        target={props.target}
        rel={props.rel ?? (props.target === "_blank" ? "noreferrer" : undefined)}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={pending || props.disabled}
      aria-busy={pending || undefined}
      className={className}
      name={props.name}
      value={props.value}
      form={props.form}
    >
      {props.children}
    </button>
  );
}
