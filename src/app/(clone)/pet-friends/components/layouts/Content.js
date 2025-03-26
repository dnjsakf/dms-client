'use client';

import { classNames } from "primereact/utils";
import { forwardRef } from "react";
import styles from './Content.module.css';

import useWindowEvent from "../../hooks/useWindowEvent";

const Content = forwardRef((props, ref) => {
  const {
    children,
    maxWidth,
    maxHeight,
    ...rest
  } = props;
  
  const { startEvent, dragging } = useWindowEvent();

  const handleMouseDown = ( e ) => {
    startEvent("scrollY", ref, e);
  }

  return (
    <div
      onMouseDown={ handleMouseDown }
      ref={ ref }
      className={ classNames(styles.contentWrapper, "no-scroll") }
      style={{
        maxHeight: maxHeight,
        userSelect: "none",
      }}
    >
      { children }
    </div>
  )
});

export default Content;