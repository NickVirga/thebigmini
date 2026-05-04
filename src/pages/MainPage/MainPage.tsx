import { useLayoutEffect, useRef } from "react";
import Grid from "@/components/Grid";
import ClueContainer from "@/components/ClueContainer";
import Keyboard from "@/components/Keyboard";
import ClueList from "@/components/ClueList";
import CheckRevealToolbar from "@/components/CheckRevealToolbar";
import { usePendingScore } from "@/hooks/usePendingScore";
import "./MainPage.scss";

const MainPage = () => {
  usePendingScore();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const gridEl = content.firstElementChild as HTMLElement;
    if (!gridEl) return;

    const observer = new ResizeObserver(() => {
      content.style.setProperty("--grid-height", `${gridEl.offsetHeight}px`);
    });
    observer.observe(gridEl);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="main">
      <div className="main__content" ref={contentRef}>
        <div className="main__grid-col">
          <Grid />
          <CheckRevealToolbar />
        </div>
        <ClueList />
      </div>
      <ClueContainer />
      <Keyboard />
    </main>
  );
};

export default MainPage;
