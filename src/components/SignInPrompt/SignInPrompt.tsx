import "./SignInPrompt.scss";
import { useModal } from "@/context/ModalContext";

type SignInPromptProps = {
  promptText: string;
};

const SignInPrompt = ({ promptText }: SignInPromptProps) => {
  const { openModal } = useModal();

  const accessToken = false;

  const handleSignIn = () => {
    openModal({ type: "auth" });
  };

  return (
    <>
      {!accessToken && (
        <div className="sign-in">
          <p className="sign-in__text" onClick={handleSignIn}>
            {promptText}
          </p>
        </div>
      )}
    </>
  );
};

export default SignInPrompt;
