import {
  faBolt,
  faBomb,
  faClock,
  faCloudBolt,
  faFlask,
  faForward,
  faLightbulb,
  faMagnifyingGlass,
  faPhone,
  faRepeat,
  faShield,
  faShieldHeart,
  faStar,
  faVial,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { LevelKey, PowerTypes } from "@/types/game-types";

type PowerActions = {
  clue: () => void;
  reveal: () => void;
  shield: () => void;
  skip: () => void;
  zap: () => void;
};

type SpecialPowerActions = {
  potion: () => void;
  redPotion: () => void;
  revival: () => void;
  superZap: () => void;
  superShield: () => void;
  bernardsWatch: () => void;
  magicStar: () => void;
  bomb: () => void;
};

export type PowerState = {
  lives: number;
  usedPowers: string[];
  unlockPowers: boolean;
};

// Points to unlock each normal power; 0 means it starts unlocked
const unlockCost = {
  Clue: { easy: 0, medium: 0, hard: 300, executioner: 300 },
  Reveal: { easy: 300, medium: 300, hard: 600, executioner: 700 },
  Shield: { easy: 0, medium: 0, hard: 300, executioner: 900 },
  Skip: { easy: 0, medium: 0, hard: 500, executioner: 900 },
  Zap: { easy: 250, medium: 250, hard: 500, executioner: 500 },
} satisfies Record<string, Record<LevelKey, number>>;

const power = (
  name: string,
  description: string,
  icon: IconDefinition,
  onUse: () => void,
): PowerTypes => ({
  name,
  description,
  Icon: () => <FontAwesomeIcon icon={icon} size="lg" />,
  multiUse: false,
  active: true,
  onUse,
});

// Locked by default when the level charges to unlock it
const lockable = (
  base: PowerTypes,
  difficulty: LevelKey,
  locked?: boolean,
): PowerTypes => {
  // SAFETY: lockable is only called with the names listed in unlockCost
  const cost = unlockCost[base.name as keyof typeof unlockCost][difficulty];

  return { ...base, locked: locked ?? cost > 0, toUnlock: cost };
};

export const getPowers = (
  actions: PowerActions,
  difficulty: LevelKey,
  state: PowerState,
): PowerTypes[] => {
  // Reveal and Zap stay locked until a Magic Star unlocks them
  const starLocked = !state.unlockPowers;

  return [
    lockable(
      power(
        "Clue",
        "Provides a hint for the current word.",
        faLightbulb,
        actions.clue,
      ),
      difficulty,
    ),
    lockable(
      power(
        "Reveal",
        "Reveals a letter in the current word.",
        faMagnifyingGlass,
        actions.reveal,
      ),
      difficulty,
      starLocked,
    ),
    lockable(
      power(
        "Shield",
        "Protects the player from one incorrect guess.",
        faShield,
        actions.shield,
      ),
      difficulty,
    ),
    lockable(
      power("Skip", "Skips the current word.", faForward, actions.skip),
      difficulty,
    ),
    lockable(
      power(
        "Zap",
        "Removes five incorrect letters from the current word.",
        faBolt,
        actions.zap,
      ),
      difficulty,
      starLocked,
    ),
    ...(difficulty === "easy" || difficulty === "medium"
      ? [
          power(
            "Phone a Friend",
            "Calls a random AI agent for help with the current word.",
            faPhone,
            () => {},
          ),
        ]
      : []),
  ];
};

export const getSpecialPowers = (
  actions: SpecialPowerActions,
  difficulty: LevelKey,
  state: PowerState,
): PowerTypes[] => {
  const hardMode = difficulty === "hard" || difficulty === "executioner";

  const chance = (percent: number, effect: string) =>
    hardMode ? ` (${percent}% chance of ${effect})` : "";

  const canHeal = state.lives < 3;

  return [
    {
      ...power(
        "Blue Potion",
        `Restores one health.${chance(10, "not working")}`,
        faFlask,
        actions.potion,
      ),
      active: canHeal,
    },
    {
      ...power(
        "Red Potion",
        `Restores one health and gives an extra life.${chance(10, "poisoning")}`,
        faVial,
        actions.redPotion,
      ),
      active: canHeal,
    },
    {
      ...power(
        "Revival",
        `Restores one normal power.${chance(20, "not working")}`,
        faRepeat,
        actions.revival,
      ),
      active: state.usedPowers.length > 0,
    },
    power(
      "Super Zap",
      "Removes ten incorrect letters from the current word.",
      faCloudBolt,
      actions.superZap,
    ),
    power(
      "Super Shield",
      "Protects against losing one health and streak",
      faShieldHeart,
      actions.superShield,
    ),
    power(
      "Bomb",
      "A 50/50 chance of losing the game or winning the round with 1,000 bonus points.",
      faBomb,
      actions.bomb,
    ),
    difficulty === "easy"
      ? {
          ...power(
            "Magic Star",
            "Unlocks all powers, increases streak and reveals a word.",
            faStar,
            actions.magicStar,
          ),
          locked: state.unlockPowers,
          toUnlock: 2000,
          weight: 2,
        }
      : {
          ...power(
            "Bernard's Watch",
            "Pause the timer for two rounds",
            faClock,
            actions.bernardsWatch,
          ),
          weight: 3,
        },
  ];
};
