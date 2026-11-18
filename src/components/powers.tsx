import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Powers(props: PowerTypes) {
  const {
    name,
    description,
    Icon,
    active,
    multiUse,
    uses,
    onUse,
    locked,
    toUnlock,
  } = props;
  const { activePowers, setActivePowers, score, setScore } = useUserStore();
  const [unlock, setUnlock] = useState(false);
  const used =
    (activePowers.includes(name) && !multiUse) ||
    (locked && !unlock) ||
    !active;
  const ptsNeeded = toUnlock ?? 250;

  return (
    <div className="relative w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative flex h-full w-fit flex-nowrap items-center justify-center rounded-full p-3 md:rounded-md"
            onClick={() => {
              setActivePowers([...activePowers, name]);
              console.log("clicked");
              onUse?.();
            }}
            disabled={used}
          >
            <Item
              className={cn(
                "flex w-full flex-nowrap items-center justify-center gap-2 p-0",
              )}
            >
              <ItemMedia>{Icon()}</ItemMedia>
              <ItemContent className="flex flex-row flex-nowrap gap-1">
                <ItemTitle className="invisible md:visible">{name}</ItemTitle>
              </ItemContent>
            </Item>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{description}</span>
          {locked && !unlock && (
            <span className="text-xs italic">({ptsNeeded} pts to unlock)</span>
          )}
          {multiUse && <span>Uses before inactive: {uses}</span>}
        </TooltipContent>
      </Tooltip>
      {multiUse && (
        <Badge className="absolute -top-2 -right-2 h-5.5 w-5.5">{uses}</Badge>
      )}
      {locked && !unlock && (
        <Badge
          className={cn(
            "absolute -top-2 -right-2 h-5.5 w-5.5",
            score >= ptsNeeded ? "hover:cursor-pointer" : "",
          )}
          asChild={score >= ptsNeeded}
        >
          {score >= ptsNeeded ? (
            <button
              aria-label={locked ? `Unlock ${name}` : `Lock ${name}`}
              onClick={() => {
                setUnlock(true);
                setScore(score - ptsNeeded);
              }}
            >
              <FontAwesomeIcon icon={faLock} size="sm" />
            </button>
          ) : (
            <FontAwesomeIcon icon={faLock} size="sm" />
          )}
        </Badge>
      )}
    </div>
  );
}
