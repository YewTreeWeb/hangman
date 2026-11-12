import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { PowerTypes } from "@/types/game-types";

export function Powers(props: PowerTypes) {
  const { name, description, Icon, active, multiUse, uses } = props;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Item
          className={cn("flex items-center gap-2", !active && "opacity-50")}
        >
          <ItemMedia>{Icon()}</ItemMedia>
          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
          </ItemContent>
        </Item>
      </HoverCardTrigger>
      <HoverCardContent>
        <span>{description}</span>
        {multiUse && <span>Uses before inactive: {uses}</span>}
      </HoverCardContent>
    </HoverCard>
  );
}
