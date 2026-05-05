import { useEffect } from "react";
import { Theme, THEMES } from "@/types";
import { useGameData } from "@/context/GameDataContext";

const isValidTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme);

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolveTheme = (theme: Theme): string =>
  theme === "system" ? getSystemTheme() : theme;

export const useTheme = () => {
  const { gameData, updateGameData } = useGameData();
  const theme = isValidTheme(gameData.options.theme)
    ? gameData.options.theme
    : "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolveTheme(theme));
  }, [theme]);

  // Keep in sync if the user changes their OS theme while "system" is selected
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.setAttribute("data-theme", getSystemTheme());
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) return;
    updateGameData({
      ...gameData,
      options: { ...gameData.options, theme: newTheme },
    });
  };

  return { theme, setTheme, themes: THEMES };
};