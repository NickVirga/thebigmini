import BaseModal from "./BaseModal";
import "./SettingsModal.scss";
import { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { useGameData } from "@/context/GameDataContext";
import { useModal } from "@/context/ModalContext";
import { useTheme } from "@/hooks/useTheme";
import { Theme, THEMES } from "@/types";

type SettingsModalProps = {
  onClose: () => void;
  zIndex?: number;
};

type SettingsOption = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

const SettingsModal = ({ onClose, zIndex }: SettingsModalProps) => {
  const { gameData, updateGameData, resetGameData } = useGameData();
  const { theme, setTheme } = useTheme();
  const { openModal } = useModal();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleResetGame = () =>
    openModal({
      type: "confirm",
      props: {
        message: "Reset all progress for this puzzle?",
        onConfirm: resetGameData,
      },
    });

  const toggleOption = (gameDataOption: keyof typeof gameData.options) => {
    updateGameData({
      ...gameData,
      options: {
        ...gameData.options,
        [gameDataOption]: !gameData.options[gameDataOption],
      },
    });
  };

  const toggleTooltip = (id: string) => {
    setActiveTooltip((prev) => (prev === id ? null : id));
  };

  const handleChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };

  const settingsItems: SettingsOption[] = [
    {
      id: "moveToNextClue",
      label: "Move to next clue",
      description: "Auto-advance after completing a word",
      checked: gameData.options.moveToNextClue,
      onChange: () => toggleOption("moveToNextClue"),
    },
    {
      id: "skipFilled",
      label: "Skip filled",
      description: "Skip over already-filled cells and clues",
      checked: gameData.options.skipFilled,
      onChange: () => toggleOption("skipFilled"),
    },
  ];

  return (
    <BaseModal onClose={onClose} zIndex={zIndex}>
      <div className="settings">
        <div className="settings__header">
          <h2 className="settings__title">Settings</h2>
        </div>
        <ul className="settings__list">

          {/* Theme */}
          <li className="settings__item">
            <h3 className="settings__option">Theme</h3>
            <select
              className="settings__select"
              value={theme}
              onChange={handleChangeTheme}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </li>

          {/* Toggles */}
          {settingsItems.map(({ id, label, description, checked, onChange }) => (
            <li className="settings__item" key={id}>
              <div className="settings__label">
                <h3 className="settings__option">
                  {label}
                  {description && (
                    <span className="settings__info">
                      <button
                        className="settings__info-btn"
                        onClick={() => toggleTooltip(id)}
                        aria-label={`More info about ${label}`}
                      >
                        <FaCircleInfo />
                      </button>
                      <span
                        role="tooltip"
                        className={`settings__tooltip ${activeTooltip === id ? "settings__tooltip--visible" : ""}`}
                      >
                        {description}
                      </span>
                    </span>
                  )}
                </h3>
              </div>
              <label className="settings__toggle">
                <input
                  type="checkbox"
                  className="settings__toggle-input"
                  checked={checked}
                  onChange={onChange}
                />
                <span className="settings__toggle-slider" />
              </label>
            </li>
          ))}

          {/* Reset */}
          <li className="settings__item settings__item--reset">
            <h3 className="settings__option">Reset Game</h3>
            <button className="settings__reset-btn" onClick={handleResetGame}>
              Reset
            </button>
          </li>

        </ul>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;