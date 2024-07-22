import "./HelpContent.scss";
import grid from "../../assets/images/grid.png";
import boundaryGap from "../../assets/images/boundary-gap.png";

function HelpContent() {
  return (
    <>
      <h2 className="help__title">About The BigMini Crossword</h2>
      <ul className="help__list">
        <li className="help__item">No puzzle symmetry</li>
        <li className="help__item">Mini sections are separated by thick boundaries
          <img src={grid} className="help__grid" alt="grid" />
        </li>

        <li className="help__item">Long words can span multiple mini sections through gaps in boundaries
          <img src={boundaryGap} className="help__boundary-gap" alt="boundary gap example" />
        </li>
      </ul>
    </>
  );
}

export default HelpContent;
