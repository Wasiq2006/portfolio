import { useState } from 'react';
import LoadingAnimation from './LoadingAnimation';

export const LoadingPage = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return <LoadingAnimation onComplete={() => setIsVisible(false)} />;
};

export default LoadingPage;
