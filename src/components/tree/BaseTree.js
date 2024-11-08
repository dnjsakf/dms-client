'use client';

import { forwardRef, useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { Tree } from "primereact/tree";

const BaseTree = ( props, ref ) => {

  const {
    nodes,
    expanded,
    selectedNode,
    onSelectNode,
    ...rest
  } = props;

  const lockEvent = useRef({
    timer: null,
    lock: false,
  });
  const treeRef = useRef();
  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedKey, setSelectedKey] = useState(selectedNode?.key || '');

  /**
   * 특정 노드 펼치기
   * @param {*} node 
   * @param {*} _expandedKeys 
   */
  const expandNode = (node, _expandedKeys={}) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;
      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  }

  /**
   * 노드 전체 펼치기
   */
  const expandAll = () => {
    let _expandedKeys = {};
    for (let node of nodes) {
      expandNode(node, _expandedKeys);
    }
    setExpandedKeys(_expandedKeys);
  }

  /**
   * 노드 토글 이벤트
   * @param {*} event 
   */
  const handleToggleNode = (event) => {
    if( lockEvent.current.timer !== null ){
      clearTimeout(lockEvent.current.timer);
    }
    lockEvent.current.lock = true;
    lockEvent.current.timer = setTimeout(() => {
      lockEvent.current.timer = null;
      lockEvent.current.lock = false;
    }, 300);
    setExpandedKeys(event.value);
  }

  /**
   * 선택 노드 변경 이벤트
   * @param {*} event
   */
  const handleChangeSelection = (event) => {
    setSelectedKey(event.value);
  }

  /**
   * 노드 클릭 이벤트
   * @param {*} event 
   */
  const handleClickNode = (event) => {
    const node = event.node;
    setSelectedKey(node.key);
    if( typeof onSelectNode === 'function' ){
      onSelectNode(node);
    }
  }

  /**
   * 노드 더블 클릭 이벤트
   * @param {*} event 
   */
  const handleDoubleClickNode = (event)=>{
    if( lockEvent.current.lock ){
      return false;
    }
    const node = event.node;
    if( node?.key ){
      const tempExpandedKeys = {
        ...expandedKeys,
      }
      if( !tempExpandedKeys[node.key] ){
        tempExpandedKeys[node.key] = true;
      } else {
        delete tempExpandedKeys[node.key];
      }

      setExpandedKeys(tempExpandedKeys);
    }
  }

  /**
   * 트리 노드 랜더링
   * @param {*} node 
   * @param {*} options 
   * @returns 
   */
  const nodeTemplate = (node, options) => {
    let label = (
      <a
        className="cursor-pointer text-700 hover:text-primary"
        // onClick={(originalEvent)=>handleClickNode({ originalEvent, node })}
        >
        { node.label }
      </a>
    );
    return (
      <span className={options.className}>{ label }</span>
    );
  }

  /**
   * 트리 노드 확장 버튼 랜더링
   * @param {*} node 
   * @param {*} options 
   * @returns 
   */
  const togglerTemplate = (node, options) => {
    if (!node) {
      return;
    }
    const expanded = options.expanded;
    const iconClassName = classNames('p-tree-toggler-icon pi pi-fw', {
      'pi-caret-right': !expanded,
      'pi-caret-down': expanded
    });
    return (
      <button type="button" className="p-tree-toggler p-link" tabIndex={-1} onClick={options.onClick}>
        <span className={iconClassName} aria-hidden="true"></span>
      </button>
    );
  };

  /**
   * 트리가 준비되면 전체 확장
   */
  useEffect(()=>{
    if( expanded === true ){
      expandAll();
    }
  }, [nodes]);

  /**
   * Ref 함수 정의
   */
  useEffect(()=>{
    if( ref ){
      ref.current = {
        expandAll: expandAll,
      }
    }
  }, [ref, nodes]);

  return (
    <Tree
      ref={treeRef}
      className="h-full w-full"
      filter
      filterMode="strict" 
      filterPlaceholder="검색" 
      emptyMessage="Not matched"
      value={nodes}
      expandedKeys={expandedKeys}
      onNodeDoubleClick={handleDoubleClickNode}
      onNodeClick={handleClickNode}
      nodeTemplate={nodeTemplate}
      togglerTemplate={togglerTemplate}
      onToggle={handleToggleNode}
      selectionMode="single"
      selectionKeys={selectedKey} 
      onSelectionChange={handleChangeSelection}
      onSelect={handleClickNode}
      pt={{
        root: {
          className: "overflow-y-hidden",
        },
        container: {
          className: "h-full overflow-y-scroll"
        },
      }}
    />
  );
}

export default forwardRef(BaseTree);