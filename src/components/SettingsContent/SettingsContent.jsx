import "./SettingsContent.scss";
import { useContext, useState } from "react";
import { GameDataContext } from "../../context/GameDataContext";
import Confirm from "../Confirm/Confirm";

function SettingsContent() {
  const { gameData, updateGameData, resetGameData } =
    useContext(GameDataContext);

  const [confirmIsOpen, setConfirmIsOpen] = useState(false);

  const toggleDarkTheme = () => {
    updateGameData({
      ...gameData,
      darkThemeEnabled: !gameData.darkThemeEnabled,
    });
  };

  const handleResetClick = () => {
    setConfirmIsOpen(true);
  };

  const handleConfirmResponse = (confirmed) => {
    if (confirmed) {
      resetGameData();
    }
    setConfirmIsOpen(false);
  };

  return (
    <>
      <Confirm
        isOpen={confirmIsOpen}
        onConfirm={handleConfirmResponse}
        message={"Are you sure you want to reset the game?"}
      />
      <h2 className="settings__title">Settings</h2>
      <ul className="settings__list">
        <li className="settings__item">
          <h3 className="settings__option">Dark Theme:</h3>
          <input
            className="settings__checkbox"
            type="checkbox"
            checked={gameData.darkThemeEnabled}
            onChange={toggleDarkTheme}
          ></input>
        </li>
        <li className="settings__item">
          <h3 className="settings__option">Reset Game:</h3>
          <div
            className="button"
            onClick={() => {
              handleResetClick();
            }}
          >
            Reset
          </div>
        </li>
      </ul>
    </>
  );
}

export default SettingsContent;
