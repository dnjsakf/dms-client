export const debounce = (handler, delay=300, ...args) => {
  if( slideRef.current.debounceTimeout ){
    clearTimeout(slideRef.current.debounceTimeout);
  }
  slideRef.current.debounceTimeout = setTimeout(()=>{
    slideRef.current.debounceTimeout = null;
    handler(...args);
  }, delay);
}