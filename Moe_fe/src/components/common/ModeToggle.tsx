import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProviderProps";
import { Switch } from "../ui/switch";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const label = theme === "dark" ? "Dark mode" : "Light mode";

  return (
    <div className="flex items-center justify-between w-full px-3 py-2 cursor-pointer">
      <div className="flex items-center gap-2 text-sm bg">
        {theme === "dark" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
        <span>{label}</span>
      </div>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-zinc-800"
      />
    </div>
  );
}
