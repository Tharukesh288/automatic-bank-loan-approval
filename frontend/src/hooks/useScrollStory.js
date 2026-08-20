import { useState, useEffect } from 'react';

/**
 * Hook to track scroll progress within a specific element (like a sticky section container).
 * Returns the scroll progress from 0 to 1.
 */
export function useScrollStory(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the element
      // start: top === 0 (element hits top of viewport)
      // end: top === - (height - windowHeight) (element bottoms out)
      
      if (top > 0) {
        setProgress(0);
        return;
      }
      
      const scrollableDistance = height - windowHeight;
      if (scrollableDistance <= 0) {
        setProgress(1);
        return;
      }
      
      let currentProgress = Math.abs(top) / scrollableDistance;
      
      if (currentProgress < 0) currentProgress = 0;
      if (currentProgress > 1) currentProgress = 1;
      
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}
