export type ModalType = "info" | "auth" | "stats" | "settings" | "confirm" | "results";

export type ModalConfig = {
  type: ModalType;
  props?: Record<string, unknown>;
};

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = typeof THEMES[number];
