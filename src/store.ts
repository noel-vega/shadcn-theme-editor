import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export const zincTheme: Omit<Theme, "id"> = {
  name: "zinc",
  light: {
    "--background": "0 0% 100%",
    "--foreground": "240 10% 3.9%",
    "--card": "0 0% 100%",
    "--card-foreground": "240 10% 3.9%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "240 10% 3.9%",
    "--primary": "240 5.9% 10%",
    "--primary-foreground": "0 0% 98%",
    "--secondary": "240 4.8% 95.9%",
    "--secondary-foreground": "240 5.9% 10%",
    "--muted": "240 4.8% 95.9%",
    "--muted-foreground": "240 3.8% 46.1%",
    "--accent": "240 4.8% 95.9%",
    "--accent-foreground": "240 5.9% 10%",
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "240 5.9% 90%",
    "--input": "240 5.9% 90%",
    "--ring": "240 10% 3.9%",
    "--radius": "0.5rem",
    "--chart-1": "12 76% 61%",
    "--chart-2": "173 58% 39%",
    "--chart-3": "197 37% 24%",
    "--chart-4": "43 74% 66%",
    "--chart-5": "27 87% 67%",
  },
  dark: {
    "--background": "240 10% 3.9%",
    "--foreground": "0 0% 98%",
    "--card": "240 10% 3.9%",
    "--card-foreground": "0 0% 98%",
    "--popover": "240 10% 3.9%",
    "--popover-foreground": "0 0% 98%",
    "--primary": "0 0% 98%",
    "--primary-foreground": "240 5.9% 10%",
    "--secondary": "240 3.7% 15.9%",
    "--secondary-foreground": "0 0% 98%",
    "--muted": "240 3.7% 15.9%",
    "--muted-foreground": "240 5% 64.9%",
    "--accent": "240 3.7% 15.9%",
    "--accent-foreground": "0 0% 98%",
    "--destructive": "0 62.8% 30.6%",
    "--destructive-foreground": "0 0% 98%",
    "--border": "240 3.7% 15.9%",
    "--input": "240 3.7% 15.9%",
    "--ring": "240 4.9% 83.9%",
    "--chart-1": "220 70% 50%",
    "--chart-2": "160 60% 45%",
    "--chart-3": "30 80% 55%",
    "--chart-4": "280 65% 60%",
    "--chart-5": "340 75% 55%",
  },
};

const deepCopyTheme = (theme: Omit<Theme, "id">): Omit<Theme, "id"> => {
  return {
    name: theme.name,
    light: { ...theme.light },
    dark: { ...theme.dark },
  };
};

type Theme = {
  id: string;
  name: string;
  light: Record<string, string>;
  dark: Record<string, string>;
};

type State = {
  cssRule: CSSStyleRule;
  activeThemeId: string;
  themes: Record<string, Theme>;
  mode: "light" | "dark";
};

type Actions = {
  newTheme: (name: string) => void;
  setMode: (val: "light" | "dark") => void;
  setThemeValue: (cssVar: string, value: string) => void;
  setActiveTheme: (id: string) => void;
  deleteTheme: () => void;
  updateThemeName: (name: string) => void;
};

const createThemeStore = () => {
  let cssRule: CSSStyleRule;
  const lsThemes = JSON.parse(localStorage.getItem("key")!)
    ?.state as State | null;
  console.log(lsThemes);

  if (lsThemes) {
    const activeTheme = lsThemes.themes[lsThemes.activeThemeId];
    if (activeTheme) {
      const styleSheet = document.styleSheets[0];
      for (const rule of styleSheet.cssRules) {
        if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
          if (lsThemes.mode === "dark") {
            Object.entries(activeTheme.dark).forEach(([property, value]) => {
              rule.style.setProperty(`${property}`, value);
            });
          } else {
            Object.entries(activeTheme.light).forEach(([property, value]) => {
              rule.style.setProperty(`${property}`, value);
            });
          }
          break;
        }
      }
    }
  }

  for (const rule of document.styleSheets[0].cssRules) {
    if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
      cssRule = rule;
      break;
    }
  }

  const themes: Record<string, Theme> = {};
  const id = nanoid();
  themes[id] = { id, ...deepCopyTheme(zincTheme) };
  return create<State & Actions>()(
    persist(
      (set, get) => ({
        cssRule,
        activeThemeId: id,
        themes,
        mode: "light",
        setMode: (mode) => {
          const { themes, activeThemeId } = get();
          const theme = themes[activeThemeId];
          if (!theme) return;

          const styleSheet = document.styleSheets[0];
          for (const rule of styleSheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
              if (mode === "dark") {
                Object.entries(theme.dark).forEach(([property, value]) => {
                  rule.style.setProperty(`${property}`, value);
                });
              } else {
                Object.entries(theme.light).forEach(([property, value]) => {
                  rule.style.setProperty(`${property}`, value);
                });
              }
              break;
            }
          }

          set(() => {
            document.documentElement.classList.remove("light", "dark");
            return { mode };
          });
        },
        setActiveTheme: (id) => {
          const { themes, mode } = get();
          const theme = themes[id];
          if (!theme) return;

          const styleSheet = document.styleSheets[0];
          for (const rule of styleSheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
              if (mode === "dark") {
                Object.entries(theme.dark).forEach(([property, value]) => {
                  rule.style.setProperty(`${property}`, value);
                });
              } else {
                Object.entries(theme.light).forEach(([property, value]) => {
                  rule.style.setProperty(`${property}`, value);
                });
              }
              break;
            }
          }

          set(() => ({
            activeThemeId: theme.id,
          }));
        },
        setThemeValue: (cssVar, value) => {
          const { themes, activeThemeId, mode } = get();
          if (!themes[activeThemeId]) return;
          themes[activeThemeId][mode][cssVar] = value;
          cssRule.style.setProperty(`${cssVar}`, value);
          set(() => ({ themes }));
        },
        newTheme: (name) => {
          const theme: Theme = {
            id: nanoid(),
            ...deepCopyTheme(zincTheme),
            name,
          };
          set(({ themes }) => {
            themes[theme.id] = theme;
            return { themes };
          });
          get().setActiveTheme(theme.id);
        },
        deleteTheme: () => {
          const { activeThemeId, themes } = get();

          const anotherTheme = Object.values(themes).find(
            (x) => x.id !== activeThemeId
          );

          if (!anotherTheme) return;

          console.log("setting new theme", anotherTheme.id);

          get().setActiveTheme(anotherTheme.id);

          const filteredThemes = Object.fromEntries(
            Object.entries(themes).filter(([key]) => key !== activeThemeId)
          );

          //   console.log("deleting", activeThemeId);
          set(() => ({
            activeThemeId: anotherTheme.id,
            themes: filteredThemes,
          }));
        },
        updateThemeName: (name) => {
          const { themes, activeThemeId } = get();

          themes[activeThemeId].name = name;

          set(() => ({ themes }));
        },
      }),
      { name: "key" }
    )
  );

  //   return create<State & Actions>((set, get) => {
  //     return {
  //       cssRule,
  //       activeThemeId: id,
  //       themes,
  //       mode: "light",
  //       setMode: (mode) => {
  //         const { themes, activeThemeId } = get();
  //         const theme = themes[activeThemeId];
  //         if (!theme) return;

  //         const styleSheet = document.styleSheets[0];
  //         for (const rule of styleSheet.cssRules) {
  //           if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
  //             if (mode === "dark") {
  //               Object.entries(theme.dark).forEach(([property, value]) => {
  //                 rule.style.setProperty(`${property}`, value);
  //               });
  //             } else {
  //               Object.entries(theme.light).forEach(([property, value]) => {
  //                 rule.style.setProperty(`${property}`, value);
  //               });
  //             }
  //             break;
  //           }
  //         }

  //         set(() => {
  //           document.documentElement.classList.remove("light", "dark");
  //           return { mode };
  //         });
  //       },
  //       setActiveTheme: (id: string) => {
  //         const { themes, mode } = get();
  //         const theme = themes[id];
  //         if (!theme) return;

  //         const styleSheet = document.styleSheets[0];
  //         for (const rule of styleSheet.cssRules) {
  //           if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
  //             if (mode === "dark") {
  //               Object.entries(theme.dark).forEach(([property, value]) => {
  //                 rule.style.setProperty(`${property}`, value);
  //               });
  //             } else {
  //               Object.entries(theme.light).forEach(([property, value]) => {
  //                 rule.style.setProperty(`${property}`, value);
  //               });
  //             }
  //             break;
  //           }
  //         }

  //         set(() => ({
  //           activeThemeId: theme.id,
  //         }));
  //       },
  //       setThemeValue: (cssVar, value) => {
  //         const { themes, activeThemeId, mode } = get();
  //         if (!themes[activeThemeId]) return;
  //         themes[activeThemeId][mode][cssVar] = value;
  //         cssRule.style.setProperty(`${cssVar}`, value);
  //         set(() => ({ themes }));
  //       },

  //       newTheme: (name: string) => {
  //         const theme: Theme = {
  //           id: nanoid(),
  //           ...deepCopyTheme(zincTheme),
  //           name,
  //         };
  //         set(({ themes }) => {
  //           themes[theme.id] = theme;
  //           return { themes };
  //         });
  //       },
  //     };
  //   });
};

export const useThemeStore = createThemeStore();

export function useActiveTheme() {
  const { activeThemeId, themes } = useThemeStore();
  const theme = themes[activeThemeId];

  if (!theme) throw new Error("No active theme");
  return theme;
}

// function getCssTheme(selector: string, label: string) {
//   let theme: Theme = { selector, label: label, rules: {} };
//   for (const rule of document.styleSheets[0].cssRules) {
//     if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
//       for (const [property, [value]] of rule.styleMap.entries()) {
//         theme.rules[property] = value.toString();
//       }
//       break;
//     }
//   }
//   return theme;
// }
