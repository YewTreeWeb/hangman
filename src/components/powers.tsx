import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

import { Button } from "./ui/button";

export function Powers(props: PowerTypes) {
  const { name, description, Icon, active, multiUse, uses, onUse } = props;
  const { activePowers, setActivePowers } = useUserStore();
  const used = activePowers.includes(name) && !multiUse;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="outline"
          size="sm"
          className="h-full rounded-full"
          onClick={() => {
            setActivePowers([...activePowers, name]);
            onUse?.();
          }}
          disabled={used}
        >
          <Item
            className={cn("flex items-center gap-2", !active && "opacity-50")}
          >
            <ItemMedia>{Icon()}</ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
            </ItemContent>
          </Item>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{description}</span>
        {multiUse && <span>Uses before inactive: {uses}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
