import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[12px] border-[0.5px] border-border bg-card text-card-foreground shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 sm:p-6",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
