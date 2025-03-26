
import { forwardRef } from 'react';
import { Button } from 'primereact/button';

import styles from './BandBanner.module.css';

const BandBanner = forwardRef(( props, ref ) => {
  return (
    <nav
      ref={ ref }
      className={ styles.wrapper }
    >
      <div>
        <div className={ styles.navWrapper }>
          <div>
            <Button className={ styles.navButton } label={ "1234" } />
          </div>
          <div>
            <Button className={ styles.navButton } label={ "1234" } />
          </div>
          <div>
            <Button className={ styles.navButton } label={ "1234" } />
          </div>
        </div>
      </div>
    </nav>
  );
});

export default BandBanner;