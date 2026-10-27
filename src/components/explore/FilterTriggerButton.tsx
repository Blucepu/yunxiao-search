import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  activeCount: number;
  onClick(): void;
  className?: string;
}

export function FilterTriggerButton({ activeCount, onClick, className }: Props) {
  return (
    <Button size="sm" variant="outline" onClick={onClick} className={cn(activeCount > 0 && "border-primary/60 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary", className)}>
      <FilterIcon />
      筛选
      {activeCount > 0 && (
        <span className="rounded-full bg-primary px-1.5 py-px text-[11px] leading-4 font-medium text-primary-foreground">
          {activeCount}
        </span>
      )}
    </Button>
  );
}
