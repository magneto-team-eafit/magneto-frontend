import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-primary accent-primary",
        className
      )}
      {...props}
    />
  );
}