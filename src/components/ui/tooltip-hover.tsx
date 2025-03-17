"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipHoverProps {
  triggerText: string;
  tooltipText: string;
}

export default function TooltipHover({ triggerText, tooltipText }: TooltipHoverProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer text-black hover:underline">
            {triggerText}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{tooltipText}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
