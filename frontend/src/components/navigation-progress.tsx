import { useEffect, useRef } from 'react'
// TODO: Replace with actual router state hook and loading bar component
// import { useLocation } from 'react-router-dom';
// import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

export function NavigationProgress() {
  // const ref = useRef<LoadingBarRef>(null);
  // const location = useLocation();

  useEffect(() => {
    // TODO: Implement loading bar logic based on router state
  }, [/* state.status */])

  return (
    <div style={{ height: 2, background: 'var(--muted-foreground)' }} />
  )
}
