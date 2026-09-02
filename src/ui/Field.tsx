"use client";

import { Children, cloneElement, isValidElement, useId } from "react";
import type { FieldProps } from "./types";

export function Field({ label, error, hint, children }: FieldProps) {
  const generatedId = useId();
  const child = Children.only(children);
  if (!isValidElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>(child)) {
    throw new Error("Field expects one control element");
  }
  const controlId = child.props.id ?? generatedId;
  const errorId = error ? `${controlId}-error` : undefined;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={controlId}>
        {label}
      </label>
      {cloneElement(child, {
        id: controlId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p className="ui-field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="ui-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
