import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useActiveTheme, useThemeStore } from "@/store";

export function ThemeModeSelect() {
  const { mode, setMode } = useThemeStore();
  return (
    <Select
      value={mode}
      defaultValue={mode}
      onValueChange={(val: "light" | "dark") => setMode(val)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"light"}>Light</SelectItem>
        <SelectItem value={"dark"}>Dark</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ThemeSelect() {
  const { themes, setActiveTheme } = useThemeStore();
  const activeTheme = useActiveTheme();
  return (
    <Select
      value={activeTheme.id}
      defaultValue={activeTheme.id}
      onValueChange={(val: string) => setActiveTheme(val)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(themes).map((theme) => (
          <SelectItem key={theme.id} value={theme.id}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
