'use client';

import { useState, useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import MenuService from '@/services/common/MenuService';

const Jobs = () => {
  const toast = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);

  const callDetail = async ( params ) => {
    try {
      const result = await MenuService.getDataDetail({
        menuId: params?.menuId,
      });
      setSelectedNode(result);
    } catch ( error ){
      console.error(error);
    }
  }

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  const nodeTemplate = (node, options) => {
    let label = (
      <a
        className="cursor-pointer text-700 hover:text-primary"
        onClick={(e)=>{
          e.preventDefault();
          callDetail(node.data);
        }}
        >{ node.label }</a>
    );
    return (
      <span className={options.className}>{ label }</span>
    );
  }

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

  useEffect(() => {
    MenuService.getDataList().then((data) => setNodes(data));
  }, []);
  
  return (
    <div className="flex h-full">
      <div className="flex md-12 col-4">
        <div className="w-full">
          <Tree
            className="h-full w-full"
            filter
            filterMode="strict" 
            filterPlaceholder="Strict Filter" 
            emptyMessage="Not matched"
            value={nodes}
            expandedKeys={expandedKeys}
            nodeTemplate={nodeTemplate}
            togglerTemplate={togglerTemplate}
            onToggle={(e) => setExpandedKeys(e.value)}
          />
        </div>
      </div>
      <div className="flex md-12 col-8 h-full">
        <div className="flex flex-column h-full w-full border-box">
          <div className="detail-view flex flex-grow-1 flex-column">
            <div className="detail-header align-content-center" style={{
              height: "38px"
            }}>
              <span><b>{ selectedNode?.menuName } 설정</b></span>
            </div>
            <div className="detail-content flex-grow-1">
              <pre>{ JSON.stringify(selectedNode, null, 4) }</pre>
            </div>
          </div>
          <div className="detail-buttons flex justify-content-end col-12">
            <Button className="p-button-text" label="삭제"/>
            <Button label="등록"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
