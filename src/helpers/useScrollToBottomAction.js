import { useEffect } from "react";

export function useScrollToBottomAction(container, callback, offset = 0) {
  useEffect(() => {
    if (!container) return;
    const handleScroll = () => {
      let scrollContainer =
        container === document ? document.scrollingElement : container;

      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        console.log({ scrollContainer });
        callback();
      }
    };
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [container, offset]);
}
