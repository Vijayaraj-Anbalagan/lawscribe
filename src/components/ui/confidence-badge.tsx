import React from "react";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConfidenceBadge({
  value,
  showLabel = true,
  size = "md",
  className,
  ...props
}: ConfidenceBadgeProps) {
  // Determine color based on confidence value
  const getColorClass = () => {
    if (value >= 80) return "bg-green-100 text-green-800 border-green-300";
    if (value >= 60) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (value >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (value >= 20) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div
      className={cn(
        "rounded-full border font-medium inline-flex items-center justify-center",
        getColorClass(),
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {value}%
      {showLabel && (
        <span className="ml-1 font-normal">
          {value >= 80 && "High"}
          {value >= 60 && value < 80 && "Good"}
          {value >= 40 && value < 60 && "Medium"}
          {value >= 20 && value < 40 && "Low"}
          {value < 20 && "Very Low"}
        </span>
      )}
    </div>
  );
}