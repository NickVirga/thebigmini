import "./ResultsContent.scss";

function ResultsContent({ winState, gameId, score}) {
  return (
    <>
      <h2>{winState ? "Congratulations!" : "Good Try!"}</h2>
      <p>Game ID: {gameId}</p>
      <p>Score: {score}</p>
    </>
  );
}

export default ResultsContent;
