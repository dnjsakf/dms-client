'use client';

import { forwardRef, useState, useEffect, useRef } from "react";
import BaseTree from "./BaseTree";

import MenuService from "@/services/common/MenuService";

const MenuTree = ( props, ref ) => {

  const {
    nodes: _nodes,
    onSelectNode,
    ...rest
  } = props;

  const treeRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  /**
   * 메뉴 목록 조회 API 호출
   * @param {*} params 
   */
  const callList = async ( params ) => {
    try {
      const result = await MenuService.getDataList(params);
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  /**
   * 상세 정보 조회 API 호출
   * @param {*} params 
   */
  const callDetail = async ( params ) => {
    try {
      const result = await MenuService.getDataDetail({
        menuId: params?.menuId,
      });
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  /**
   * 트리 선택 이벤트
   * @param {*} item 
   */
  const handleSelectNode = async ( item ) => {
    // 선택 노드 저장
    setSelectedNode(item);

    // 선택 노드 상세 정보 조회
    const detail = await callDetail(item.data);
    if( typeof onSelectNode === 'function' ){
      onSelectNode(item, detail);
    }
  }

  /**
   * 최초 목록 갱신
   */
  useEffect(()=>{
    callList().then((result)=>{
      setNodes(result);
    });
  }, []);

  /**
   * 참조 메소드/값 전달
   */
  useEffect(()=>{
    if( ref ){
      ref.current = {
        nodes: nodes,
        reload: async (params) => {
          const result = await callList(params);
          console.log(result);
          setNodes(result);
        },
        tree: treeRef.current,
      }
    }
  }, [ref, nodes]);

  return (
    <BaseTree
      ref={treeRef}
      { ...rest }
      nodes={ nodes }
      selectedNode={ selectedNode }
      onSelectNode={ handleSelectNode }
    />
  );
}

export default forwardRef(MenuTree);