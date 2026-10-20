import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={error || undefined}
      className={cn(
        "flex w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50",
        error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
        className
      )}
      {...props}
    />
  );
}