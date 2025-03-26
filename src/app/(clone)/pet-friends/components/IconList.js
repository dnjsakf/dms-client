
import { forwardRef } from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

import styles from './IconList.module.css';

const IconList = forwardRef(( props, ref ) => {

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
      <div>
        <div className={ styles.navWrapper }>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
        </div>
        <div className={ styles.navWrapper }>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
          <div className={ styles.navButtonWrapper }>
            <Button className={ styles.navButton } icon="pi pi-search" />
          </div>
        </div>
      </div>
    </nav>
  );
});

export default IconList;