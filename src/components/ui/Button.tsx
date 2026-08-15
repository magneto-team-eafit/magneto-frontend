import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost";
  loading?: boolean;
}

export function Button({
  variant = "default",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:brightness-90",
    secondary:
      "border-[1.5px] border-navy bg-transparent text-navy hover:bg-navy/10",
    ghost: "text-navy hover:bg-navy/5",
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </button>
  );
}
