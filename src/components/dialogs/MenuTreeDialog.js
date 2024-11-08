'use client';

import { useRef, useState } from "react";
import BaseDialog from "./BaseDialog";
import MenuTree from "../tree/MenuTree";

const MenuSelectDialog = ( props ) => {
  const {
    closeDialog,
    onClose,
    onOk,
    ...rest
  } = props;

  const treeRef = useRef();
  const [selected, setSelected] = useState(null);

  /**
   * 확인 버튼 클릭 이벤트
   * @param {*} e 
   */
  const handleClickOk = async ( e ) => {
    if( typeof onOk === 'function' ){
      onOk(selected)
    }
  }

  /**
   * 취소 버튼 클릭 이벤트
   * @param {*} e 
   */
  const handleClickCancel = async ( e ) => {
    if( typeof closeDialog === 'function' ){
      closeDialog();
    }
  }

  /**
   * 트리 노드 선택 이벤트
   * @param {*} node 
   */
  const handleSelectNode = ( node ) => {
    setSelected(node);
  }

  return (
    <BaseDialog
      headerLabel="메뉴 선택"
      cancelLabel="닫기"
      okLabel="선택"
      className="w-full md:w-5 h-full md:h-30rem"
      // style={{
      //   minWidth: '50vw',
      //   maxWidth: '50vw',
      //   width: '50vw',
      //   minHeight: '50vh',
      //   maxHeight: '50vh',
      //   height: '50vh',
      // }}
      onClose={ handleClickCancel }
      onSave={ handleClickOk }
    >
      <MenuTree
        ref={ treeRef }
        onSelectNode={ handleSelectNode }
      />
    </BaseDialog>
  );
}

export default MenuSelectDialog;