import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Hook to get window dimensions with debounced resize handling
function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Debounce resize event handler
    const debouncedHandleResize = debounce(handleResize, 100);

    // Add event listener
    window.addEventListener("resize", debouncedHandleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      debouncedHandleResize.cancel(); // Cancel the debounce on cleanup
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
