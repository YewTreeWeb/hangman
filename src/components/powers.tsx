import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PowerTypes } from "@/types/game-types";

export function Powers(props: PowerTypes) {
  const { name, description, Icon, active, multiUse, uses } = props;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Item
          className={cn("flex items-center gap-2", !active && "opacity-50")}
        >
          <ItemMedia>{Icon()}</ItemMedia>
          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
          </ItemContent>
        </Item>
      </TooltipTrigger>
      <TooltipContent>
        <span>{description}</span>
        {multiUse && <span>Uses before inactive: {uses}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
