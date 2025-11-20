import { useEffect, useRef, RefObject } from "react";

function hasAncestorWithAttribute(
  element: Node | null,
  attributeName: string,
  attributeValue: string,
  stopElement: HTMLElement | null
): boolean {
  let currentElement: (Node & ParentNode) | null = element as (Node & ParentNode);
  while (currentElement && currentElement !== stopElement) {
    if (
      currentElement instanceof HTMLElement &&
      currentElement.getAttribute(attributeName) === attributeValue
    ) {
      return true;
    }
    currentElement = currentElement.parentNode;
  }
  return false;
}

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        let shouldScroll = false;

        for (const mutation of mutations) {
          // Check if the mutation target or any of its ancestors should be ignored
          if (
            hasAncestorWithAttribute(
              mutation.target,
              "data-scroll-ignore",
              "true",
              container
            )
          ) {
            continue; // Ignore this mutation
          }

          switch (mutation.type) {
            case "childList":
              // Scroll when elements are added or removed
              if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldScroll = true;
              }
              break;

            case "characterData":
              // Scroll when text content changes significantly
              const oldText = mutation.oldValue || "";
              const newText = mutation.target.textContent || "";
              if (Math.abs(newText.length - oldText.length) > 10) {
                shouldScroll = true;
              }
              break;

            case "attributes":
              // Only scroll for attributes that might indicate content changes
              const relevantAttributes = [
                "src",
                "href",
                "alt",
                "title",
                "data-content",
              ];
              if (relevantAttributes.includes(mutation.attributeName || "")) {
                shouldScroll = true;
              }
              break;

            default:
              break;
          }
          if (shouldScroll) break; // If one mutation suggests scrolling, no need to check further
        }

        if (shouldScroll) {
          end.scrollIntoView({ behavior: "instant", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "href", "alt", "title", "data-content"],
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
