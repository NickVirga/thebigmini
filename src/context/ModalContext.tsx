import { createContext, useContext, useState, useCallback, ReactNode } from "react";

import { ModalConfig } from "@/types";

type ModalContextValue = {
  stack: ModalConfig[];
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  closeAll: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [stack, setStack] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: ModalConfig) => {
    setStack((prev) => [...prev, config]);
  }, []);

  const closeModal = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const closeAll = useCallback(() => setStack([]), []);

  return (
    <ModalContext.Provider value={{ stack, openModal, closeModal, closeAll }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
};
