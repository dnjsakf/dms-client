'use client';

import { classNames } from 'primereact/utils';
import styles from './Header.module.css';

export default function Header(){
  return (
    <div className={ classNames(styles.headerWrapper) }>
      header
    </div>
  )
}