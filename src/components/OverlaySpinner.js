'use client';

import { ProgressSpinner } from "primereact/progressspinner";

import useLayoutStore from '@/store/layoutStore';

const OverlaySpinner = () => {

  const { loading } = useLayoutStore();

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(255,255,255,0.7)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ProgressSpinner
        style={{ width: '50px', height: '50px' }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration="1.0s"
      />
    </div>
  );
}

export default OverlaySpinner;