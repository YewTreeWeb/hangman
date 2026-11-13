import { useGameStore, useUserStore } from "@/store/gameStore";

const { setRound } = useGameStore();
const { setScore, setLives, setSolved } = useUserStore();

export const resetGame = () => {
  setScore(0);
  setLives(3);
  setSolved(0);
  setRound({
    guessedLetters: [],
    wrongGuesses: 0,
    status: "in-progress",
  });
};
