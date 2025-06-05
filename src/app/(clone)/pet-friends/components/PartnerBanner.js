
import { forwardRef } from 'react';
import { Button } from 'primereact/button';

import styles from './PartnerBanner.module.css';

const PartnerBanner = forwardRef(( props, ref ) => {
  return (
  <div className="flex flex-row gap-2">
    <div className="flex align-items-center justify-content-center" style={{ height: 48, width: 108 }}>1</div>
    <div className="flex align-items-center justify-content-center" style={{ height: 48, width: 108 }}>2</div>
    <div className="flex align-items-center justify-content-center" style={{ height: 48, width: 108 }}>3</div>
  </div>
  );
});

PartnerBanner.displayName = "PartnerBanner";

export default PartnerBanner;