export type ModalType = "info" | "instructions" | "auth" | "stats" | "settings" | "results";

export type ModalConfig = {
  type: ModalType;
  props?: Record<string, unknown>;
};

export type ConfirmConfig = {
  message?: string;
  description?: string;
  onConfirm?: () => void;
};

export const THEMES = ["light", "dark", "system"] as const;
export type Theme = typeof THEMES[number];
