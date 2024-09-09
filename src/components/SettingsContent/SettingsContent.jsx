import "./SettingsContent.scss";
import { useContext } from "react";
import { GameDataContext } from "../../context/GameDataContext";

function SettingsContent() {
  const { gameData, updateGameData, resetGameData } = useContext(GameDataContext);

  const toggleDarkTheme = () => {
    updateGameData({
      ...gameData,
      darkThemeEnabled: !gameData.darkThemeEnabled,
    });
  };

  return (
    <>
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
          <div className="button" onClick={resetGameData}>
            Reset
          </div>
        </li>
      </ul>
    </>
  );
}

export default SettingsContent;
