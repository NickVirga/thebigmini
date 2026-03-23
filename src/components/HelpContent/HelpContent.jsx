import "./HelpContent.scss";
import SignInPrompt from "../../components/SignInPrompt/SignInPrompt";
import game_intro from "../../assets/videos/game_intro.mp4";

function HelpContent() {
  return (
    <div className="help">
      <div className="help__header">
        <h2 className="help__title">How To Play</h2>
      </div>
      <video className="help__video" src={game_intro} autoPlay loop muted playsInline />
      <SignInPrompt promptText="Game stats can be saved by creating an account" />
    </div>
  );
}

export default HelpContent;