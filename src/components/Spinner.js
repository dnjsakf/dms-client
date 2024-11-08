'use client';

import { ProgressSpinner } from "primereact/progressspinner";

const Sipnner = ( props ) => {
  return (
    <div className="flex justify-content-center align-items-center">
      <ProgressSpinner
        style={{
          width: '50px',
          height: '50px'
        }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration="1.0s"
      />
    </div>
  );
}

export default Sipnner;