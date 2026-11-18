import {
  faBolt,
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { lives, activePowers } = useUserStore.getState();
const { unlockPowers } = useGameStore.getState();

import { useGameStore, useUserStore } from "@/store/gameStore";
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
};

export const getPowers = (
  actions: PowerActions,
  difficulty: LevelKey,
): PowerTypes[] => [
  {
    name: "Clue",
    description: "Provides a hint for the current word.",
    Icon: () => <FontAwesomeIcon icon={faLightbulb} size="lg" />,
    multiUse: false,
    active: true,
    locked:
      difficulty === "hard" || difficulty === "executioner" ? true : false,
    toUnlock: difficulty === "executioner" || difficulty === "hard" ? 300 : 0,
    onUse: actions.clue,
  },
  {
    name: "Reveal",
    description: "Reveals a letter in the current word.",
    Icon: () => <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />,
    multiUse: false,
    active: true,
    locked: unlockPowers ? false : true,
    toUnlock:
      difficulty === "hard" ? 600 : difficulty === "executioner" ? 700 : 300,
    onUse: actions.reveal,
  },
  {
    name: "Shield",
    description: "Protects the player from one incorrect guess.",
    Icon: () => <FontAwesomeIcon icon={faShield} size="lg" />,
    multiUse: false,
    active: true,
    locked:
      difficulty === "hard" || difficulty === "executioner" ? true : false,
    toUnlock:
      difficulty === "executioner" ? 900 : difficulty === "hard" ? 300 : 0,
    onUse: actions.shield,
  },
  {
    name: "Skip",
    description: "Skips the current word.",
    Icon: () => <FontAwesomeIcon icon={faForward} size="lg" />,
    multiUse: false,
    active: true,
    locked:
      difficulty === "hard" || difficulty === "executioner" ? true : false,
    toUnlock:
      difficulty === "hard" ? 500 : difficulty === "executioner" ? 900 : 0,
    onUse: actions.skip,
  },
  {
    name: "Zap",
    description: "Removes five incorrect letters from the current word.",
    Icon: () => <FontAwesomeIcon icon={faBolt} size="lg" />,
    multiUse: false,
    active: true,
    locked: unlockPowers ? false : true,
    toUnlock: difficulty === "hard" || difficulty === "executioner" ? 500 : 250,
    onUse: actions.zap,
  },
  ...(difficulty === "easy" || difficulty === "medium"
    ? [
        {
          name: "Phone a Friend",
          description:
            "Calls a random AI agent for help with the current word.",
          Icon: () => <FontAwesomeIcon icon={faPhone} size="lg" />,
          multiUse: false,
          active: true,
          onUse: () => {},
        },
      ]
    : []),
];

export const getSpecialPowers = (
  actions: SpecialPowerActions,
  difficulty: LevelKey,
): PowerTypes[] => {
  const hardMode = difficulty === "hard" || difficulty === "executioner";

  return [
    {
      name: "Blue Potion",
      description: `Restores one health. ${hardMode ? "(10% chance of not working)" : ""}`,
      Icon: () => <FontAwesomeIcon icon={faFlask} size="lg" />,
      multiUse: false,
      active: lives < 3 ? true : false,
      onUse: actions.potion,
    },
    {
      name: "Red Potion",
      description: `Restores one health and gives an extra life. ${hardMode ? "(10% chance of poisoning)" : ""}`,
      Icon: () => <FontAwesomeIcon icon={faVial} size="lg" />,
      multiUse: false,
      active: lives < 3 ? true : false,
      onUse: actions.redPotion,
    },
    {
      name: "Revival",
      description: `Restores one normal power. ${hardMode ? "(20% chance of not working)" : ""}`,
      Icon: () => <FontAwesomeIcon icon={faRepeat} size="lg" />,
      multiUse: false,
      active: activePowers.length > 0 ? true : false,
      onUse: actions.revival,
    },
    {
      name: "Super Zap",
      description: "Removes ten incorrect letters from the current word.",
      Icon: () => <FontAwesomeIcon icon={faCloudBolt} size="lg" />,
      multiUse: false,
      active: true,
      onUse: actions.superZap,
    },
    {
      name: "Super Shield",
      description: "Protects against loosing one health and streak",
      Icon: () => <FontAwesomeIcon icon={faShieldHeart} size="lg" />,
      multiUse: false,
      active: true,
      onUse: actions.superShield,
    },
    ...(difficulty === "easy"
      ? [
          {
            name: "Magic Star",
            description:
              "Unlocks all powers, increases streak and reveals a word.",
            Icon: () => <FontAwesomeIcon icon={faStar} size="lg" />,
            multiUse: false,
            active: true,
            locked: unlockPowers ? true : false,
            toUnlock: 2000,
            onUse: actions.magicStar,
            weight: 2,
          },
        ]
      : []),
    ...(difficulty !== "easy"
      ? [
          {
            name: "Bernard's Watch",
            description: "Pause the timer for two rounds",
            Icon: () => <FontAwesomeIcon icon={faClock} size="lg" />,
            multiUse: false,
            active: true,
            onUse: actions.bernardsWatch,
            weight: 3,
          },
        ]
      : []),
  ];
};
