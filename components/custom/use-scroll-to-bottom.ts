import { useEffect, useRef, RefObject } from "react";

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
        // Filter mutations to only scroll on meaningful content changes
        const shouldScroll = mutations.some((mutation) => {
          switch (mutation.type) {
            case 'childList':
              // Scroll when elements are added or removed
              return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
            
            case 'characterData':
              // Scroll when text content changes significantly
              const oldText = mutation.oldValue || '';
              const newText = mutation.target.textContent || '';
              // Only scroll if the text change is substantial (more than just a few characters)
              return Math.abs(newText.length - oldText.length) > 10;
            
            case 'attributes':
              // Ignore class changes and other attribute changes that don't affect content
              // Only scroll for attributes that might indicate content changes
              const relevantAttributes = ['src', 'href', 'alt', 'title', 'data-content'];
              return relevantAttributes.includes(mutation.attributeName || '');
            
            default:
              return false;
          }
        });

        if (shouldScroll) {
          end.scrollIntoView({ behavior: "instant", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'alt', 'title', 'data-content'],
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
