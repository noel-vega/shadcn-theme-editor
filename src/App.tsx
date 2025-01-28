import "./index.css";
import { ThemeModeSelect, ThemeSelect } from "./components/theme-toggle";
import { CardsDemo } from "./components/cards-demo";
import { ThemeEditorSheet } from "./components/theme-editor-sheet";

import { Button } from "./components/ui/button";
import { useActiveTheme } from "./store";
import { Label } from "./components/ui/label";
import { AddThemeDialog } from "./components/add-theme-dialog";

import { DeleteThemeAlertDialog } from "./components/delete-theme-alert-dialog";
import { toast, Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster />
      <div className="relative flex flex-col">
        <Toolbar />
        <div className="p-4 flex flex-1">
          <CardsDemo />
        </div>
      </div>
    </>
  );
}

export default App;

function Toolbar() {
  return (
    <header className="sticky top-0 bg-background z-50 border-b shadow-lg flex items-end gap-4 p-4 border">
      <div className="max-w-[250px] w-full">
        <Label>Theme</Label>
        <ThemeSelect />
      </div>
      <div className="w-32">
        <Label>Mode</Label>
        <ThemeModeSelect />
      </div>

      <CopyThemeButton />
      <ThemeEditorSheet />
      <AddThemeDialog />
      <DeleteThemeAlertDialog />
    </header>
  );
}

function CopyThemeButton() {
  const theme = useActiveTheme();
  return (
    <Button
      onClick={async () => {
        let css = "";
        let lightMode = ":root {";
        Object.entries(theme.light).forEach(([k, v]) => {
          lightMode += `\n${k}: ${v};`;
        });
        lightMode += "\n}\n";

        css += lightMode + "\n";

        let darkMode = ".dark {";
        Object.entries(theme.dark).forEach(([k, v]) => {
          darkMode += `\n${k}: ${v};`;
        });
        darkMode += "\n}\n";

        css += darkMode + "\n";
        console.log(css);
        try {
          await navigator.clipboard.writeText(css);
          toast.success("Copied theme");
        } catch {
          toast.error("Unable to copy theme");
        }
      }}
    >
      Copy Theme
    </Button>
  );
}
