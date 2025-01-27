import { useState, useEffect, RefObject, useRef } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

const useIntersectionObserver = <T extends Element>({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
}: UseIntersectionObserverProps = {}): [boolean, RefObject<T>] => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin]);

  return [isInView, ref as RefObject<T>];
};

export default useIntersectionObserver;
