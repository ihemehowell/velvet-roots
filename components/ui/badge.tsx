import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-espresso text-ivory",
        bronze: "bg-bronze text-ivory",
        berry: "bg-berry text-ivory",
        outline: "border border-espresso/30 text-espresso",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
