'use client';
import useWindowStore from '@/store/windowStore';
import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const { width, height, visibility, setState } = useWindowStore();

  const handleResize = () => {
    setState({
      width: window.innerWidth,
      height: window.innerHeight,
      visibility: (document.visibilityState === 'visible'),
    });
  };

  useEffect(() => {
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('visibilitychange', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('visibilitychange', handleResize);
    };
  }, []);

  return {
    width,
    height,
    visibility
  };
};

export default useWindowSize;

