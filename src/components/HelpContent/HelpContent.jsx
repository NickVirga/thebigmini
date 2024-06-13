import "./HelpContent.scss";

function HelpContent() {
  return (
    <>
      <h2>How to Play 2DOZENQ</h2>
      <p>
        There is a secret word from the given category that you must figure out.
      </p>
      <p>Ask up to two dozen questions to narrow down what it could be.</p>
      <p>Example</p>
      <p>Category: Animals </p>
      <p>Secret word: dog</p>
      <ol>
        <li>Is it a mammal? Yes</li>
        <li>Does it have paws? Yes</li>
        <li>Is it a dog? Yes</li>
      </ol>
    </>
  );
}

export default HelpContent;
