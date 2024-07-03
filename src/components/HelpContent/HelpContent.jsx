import "./HelpContent.scss";

function HelpContent() {
  return (
    <>
      <h2 className="help__title">About The BigMini Crossword</h2>
      <ul className="help__list">
        <li className="help__item">No puzzle symmetry</li>
        <li className="help__item">Mini sections are separated by thick boundaries</li>
        <li className="help__item">Long words can span multiple mini sections through gaps in bondaries </li>
      </ul>
    </>
  );
}

export default HelpContent;
