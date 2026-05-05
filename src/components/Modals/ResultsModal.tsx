import BaseModal from "./BaseModal";
import "./ResultsModal.scss";

export type ResultsModalProps = {
  onClose: () => void;
  zIndex?: number;
  hasIncorrect: boolean;
  score?: number;
  checkedCnt?: number;
  revealedCnt?: number;
};

const ResultsModal = ({
  onClose,
  zIndex,
  hasIncorrect,
  score,
  checkedCnt,
  revealedCnt,
}: ResultsModalProps) => {
  return (
    <BaseModal onClose={onClose} zIndex={zIndex} closeOnBackdrop={false}>
      {hasIncorrect ? (
        <div className="results results--incorrect">
          <div className="results__icon" aria-hidden>✗</div>
          <h2 className="results__title">Not quite!</h2>
          <p className="results__message">One or more cells is incorrect.</p>
          <button className="results__btn" onClick={onClose}>Keep trying</button>
        </div>
      ) : (
        <div className="results results--complete">
          <div className="results__icon" aria-hidden>✓</div>
          <h2 className="results__title">Puzzle complete!</h2>
          <div className="results__grid">
            <div className="results__card results__card--full">
              <span className="results__value">{score?.toFixed(1)}%</span>
              <span className="results__label">Score</span>
            </div>
            <div className="results__card">
              <span className="results__value">{checkedCnt ?? 0}</span>
              <span className="results__label">Checked</span>
            </div>
            <div className="results__card">
              <span className="results__value">{revealedCnt ?? 0}</span>
              <span className="results__label">Revealed</span>
            </div>
          </div>
          <button className="results__btn" onClick={onClose}>Done</button>
        </div>
      )}
    </BaseModal>
  );
};

export default ResultsModal;

