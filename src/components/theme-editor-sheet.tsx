import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn, getCssVarValue, hexToHSL } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ThemeModeSelect } from "./theme-toggle";
import { Separator } from "./ui/separator";
import { useActiveTheme, useThemeStore } from "@/store";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dialog, DialogContent } from "./ui/dialog";

export function ThemeEditorSheet() {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const { updateThemeName } = useThemeStore();
  const activeTheme = useActiveTheme();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        console.log(isOpen);
        if (!isOpen && activeTheme.name.trim() === "") {
          console.log("focus");
          setOpenDialog(true);
          return;
        }
        setOpen(isOpen);
      }}
    >
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>Your theme must have a name</DialogContent>
      </Dialog>
      <SheetTrigger asChild>
        <Button type="button">Edit Theme</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto  ">
        <SheetTitle className="mb-4">Shadcn Theme Editor</SheetTitle>
        <div className="flex gap-2 items-center w-full">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Name</Label>
              <Input
                className={cn({ "border-red-500": !activeTheme.name.trim() })}
                ref={ref}
                value={activeTheme.name}
                onChange={(e) => {
                  updateThemeName(e.currentTarget.value);
                }}
              />
            </div>
            <div className="w-32">
              <Label className="text-sm">Mode</Label>
              <ThemeModeSelect />
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col">
          <CSSVarInput cssVar="--background" />
          <CSSVarInput cssVar="--foreground" />
          <CSSVarInput cssVar="--card" />
          <CSSVarInput cssVar="--card-foreground" />
          <CSSVarInput cssVar="--popover" />
          <CSSVarInput cssVar="--popover-foreground" />
          <CSSVarInput cssVar="--primary" />
          <CSSVarInput cssVar="--primary-foreground" />
          <CSSVarInput cssVar="--secondary" />
          <CSSVarInput cssVar="--secondary-foreground" />
          <CSSVarInput cssVar="--muted" />
          <CSSVarInput cssVar="--muted-foreground" />
          <CSSVarInput cssVar="--accent" />
          <CSSVarInput cssVar="--accent-foreground" />
          <CSSVarInput cssVar="--destructive" />
          <CSSVarInput cssVar="--destructive-foreground" />
          <CSSVarInput cssVar="--border" />
          <CSSVarInput cssVar="--input" />
          <CSSVarInput cssVar="--ring" />
          <CSSVarInput cssVar="--chart-1" />
          <CSSVarInput cssVar="--chart-2" />
          <CSSVarInput cssVar="--chart-3" />
          <CSSVarInput cssVar="--chart-4" />
          <CSSVarInput cssVar="--chart-5" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function CSSVarInput({ cssVar }: { cssVar: string }) {
  const [active, setActive] = useState(false);
  //   const theme = useActiveTheme();
  const ref = useRef<HTMLInputElement>(null);
  const { setThemeValue } = useThemeStore();

  useEffect(() => {
    if (ref.current) {
      ref.current.value = getCssVarValue(cssVar);
    }
  }, []);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(true);
    const hex = e.target.value;
    const hsl = hexToHSL(hex);
    setThemeValue(cssVar, hsl);
  };

  return (
    <label
      htmlFor={cssVar}
      onClick={() => setActive(true)}
      className={cn("flex items-center gap-4  cursor-pointer p-1", {
        "bg-secondary": active,
        "hover:bg-secondary": !active,
      })}
    >
      <input
        id={cssVar}
        ref={ref}
        type="color"
        onBlur={() => setActive(false)}
        onChange={handleUpdate}
      />
      {cssVar}
    </label>
  );
}
