import "./SettingsContent.scss";
import { useContext, useState } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import Confirm from "../Confirm/Confirm";
import { FaCircleInfo } from "react-icons/fa6";

function SettingsContent() {
  const { gameData, updateGameData, resetGameData } =
    useContext(GameDataContext);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleOption = (gameDataOption) => {
    updateGameData({
      ...gameData,
      options: {
        ...gameData.options,
        [gameDataOption]: !gameData.options[gameDataOption],
      },
    });
  };

  const handleResetClick = () => setConfirmIsOpen(true);

  const handleConfirmResponse = (confirmed) => {
    if (confirmed) resetGameData();
    setConfirmIsOpen(false);
  };

  const toggleTooltip = (id) => {
    setActiveTooltip((prev) => (prev === id ? null : id));
  };

  const settingsItems = [
    {
      id: "darkTheme",
      label: "Dark Theme",
      checked: gameData.options.darkThemeEnabled,
      onChange: () => toggleOption("darkThemeEnabled"),
    },
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
    <>
      <Confirm
        isOpen={confirmIsOpen}
        onConfirm={handleConfirmResponse}
        message={"Are you sure you want to reset the game?"}
      />
      <div className="settings__header">
        <h2 className="settings__title">Settings</h2>
      </div>
      <ul className="settings__list">
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
                      aria-label="More info"
                    >
                      <FaCircleInfo />
                    </button>
                    <span
                      className={`settings__description ${activeTooltip === id ? "settings__description--visible" : ""}`}
                    >
                      {description}
                    </span>
                  </span>
                )}
              </h3>
            </div>
            <label className="settings__toggle">
              <input type="checkbox" checked={checked} onChange={onChange} />
              <span className="settings__toggle-slider" />
            </label>
          </li>
        ))}

        <li className="settings__item settings__item--reset">
          <h3 className="settings__option">Reset Game</h3>
          <button className="settings__reset-btn" onClick={handleResetClick}>
            Reset
          </button>
        </li>
      </ul>
    </>
  );
}

export default SettingsContent;
