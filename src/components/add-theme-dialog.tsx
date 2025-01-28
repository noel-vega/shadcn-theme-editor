import { useThemeStore } from "@/store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export function AddThemeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { newTheme } = useThemeStore();
  useEffect(() => {
    setName("");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Theme</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Theme</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name) return;
            newTheme(name);
            setOpen(false);
          }}
        >
          <Input
            type="text"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
