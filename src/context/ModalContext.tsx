import { createContext, useContext, useState, useCallback, ReactNode } from "react";

import { ModalConfig, ConfirmConfig } from "@/types";

type ModalContextValue = {
  modal: ModalConfig | null;
  confirmConfig: ConfirmConfig | null;
  isModalOpen: boolean;
  openModal: (config: ModalConfig) => void;
  closeModal: (redirectTo?: ModalConfig) => void;
  openConfirm: (config: ConfirmConfig) => void;
  closeConfirm: () => void;
  closeAll: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);

  const openModal = useCallback((config: ModalConfig) => {
    setModal(config);
  }, []);

  const closeModal = useCallback((redirectTo?: ModalConfig) => {
    setModal(redirectTo ?? null);
  }, []);

  const openConfirm = useCallback((config: ConfirmConfig) => {
    setConfirmConfig(config);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmConfig(null);
  }, []);

  const closeAll = useCallback(() => {
    setModal(null);
    setConfirmConfig(null);
  }, []);

  const isModalOpen = modal !== null || confirmConfig !== null;

  return (
    <ModalContext.Provider value={{ modal, confirmConfig, isModalOpen, openModal, closeModal, openConfirm, closeConfirm, closeAll }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
};
