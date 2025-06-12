'use client';

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const BaseDialog = ( props ) => {
  const {
    headerLabel,
    cancelLabel,
    okLabel,
    closeDialog,
    onClose,
    onSave,
    children,
    ...rest
  } = props;


  const handleClickOk = async ( e ) => {
    let doClose = true;
    if( typeof onSave === 'function' ){
      const saved = await onSave();
      if( saved === false ){
        doClose = false;
      }
    }
    if( doClose ){
      handleClickCancel();
    }
  }

  const handleClickCancel = async ( e ) => {
    let doClose = true;
    if( typeof onClose === 'function' ){
      const closed = await onClose();
      if( closed === false ){
        doClose = closed;
      }
    }
    if( doClose && typeof closeDialog === 'function' ){
      closeDialog();
    }
  }

  const dialogHeader = (
    <div className="dialog-header">
      <span>{ headerLabel || 'Dialog' }</span>
    </div>
  );
  const dialogFooter = (
    <div className="dialog-footer btn-group">
      <Button
        className="btn-cancel p-button-text"
        icon="pi pi-times"
        label={ cancelLabel || 'Cancel' }
        onClick={ handleClickCancel }
      />
      <Button
        className="btn-ok"
        icon="pi pi-check"
        label={ okLabel || 'Ok' }
        onClick={ handleClickOk }
      />
    </div>
  );

  return (
    <Dialog
      className="w-full md:w-5 h-full md:h-30rem"
      header={ dialogHeader }
      visible={ true }
      closeOnEscape={ true }
      onHide={ handleClickCancel }
      footer={ dialogFooter }
      { ...rest }
    >
      <>{ children }</>
    </Dialog>
  );
}

export default BaseDialog;