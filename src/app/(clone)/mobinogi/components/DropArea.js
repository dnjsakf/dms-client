import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableCard from './DraggableCard';

const DropArea = ( props ) => {

  const {
    accept: accept = 'none',
    maxItem: maxItem = 1,
    desc,
    onDrop,
    ...rest
  } = props;

  const [items, setItems] = useState([]);

  // useDrop 훅을 사용하여 드롭 상태와 드롭 참조를 설정한다
  const [{ isOver }, drop] = useDrop({
    accept: accept,
    drop: (item) => {
      if( items.length < maxItem ){
        setItems(items.concat(item));
      }
      onDrop(item.id);
    }, // 아이템이 드롭되었을 때 호출될 함수, 아이템의 id를 인자로 전달
    collect: (monitor) => ({
      isOver: monitor.isOver(), // 드롭 영역 위에 드래그 중인지 여부를 수집
    }),
  });

  return (
    // ref={drop}는 이 div 요소를 드롭 영역으로 설정한다
    <div
      className="w-full h-full flex justify-content-center align-items-center"
      ref={drop}
      style={{
        backgroundColor: isOver ? (items.length >= maxItem ? 'lightcoral' : 'lightgreen') : 'lightgray',
        overflow: 'hidden',
        maxHeight: 50,
        minHeight: 50,
        padding: 5
      }}
    >
      {
        items?.length > 0
        ? items.map((item, idx)=>(<DraggableCard key={`draggable-card-item-${idx}`} { ...item } item={ item } />))
        : <span style={{ fontSize: '0.8rem' }}>{ desc }</span>
      }
    </div>
  );
};

export default DropArea;