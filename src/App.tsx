import { TooltipProvider } from "./components/ui/tooltip";
import "./index.css";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { useGameStore } from "./store/gameStore";

export function App() {
  const { page } = useGameStore();

  return (
    <TooltipProvider>
      {page === "home" ? <HomePage /> : <GamePage />}
    </TooltipProvider>
  );
}
