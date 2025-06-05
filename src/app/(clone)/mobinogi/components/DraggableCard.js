import { useState } from 'react';
import { useDrag } from 'react-dnd';

import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import styles from './DraggableCard.module.css';
import { classNames } from 'primereact/utils';

const DraggableCard = ( props ) => {

  const [showDialog, setShowDialog] = useState(false);

  const {
    dndType: dndType = 'DraggableCard',
    onClick: onClick = undefined,
    item: item = {
      id: null,
    },
    src: src = null,
    ...rest
  } = props;

  // useDrag 훅을 사용하여 드래그 상태와 드래그 참조 설정
  const [{ isDragging }, drag] = useDrag({
    type: dndType, // 드래그 아이템의 타입 설정
    item: item, // 드래그 시 전송될 아이템 데이터 설정
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // 드래그 중인지 여부를 수집
    }),
  });

  const handleClick = ( e ) => {
    setShowDialog(true);
    if( typeof onClick == 'function' ){
      onClick({
        value: item,
        nativeEvent: e,
      });
    }
  }

  return (
      <div 
        ref={ drag }
        style={{
          opacity: isDragging ? 0.5 : 1, // 드래그 중이면 반투명하게 표시
          // cursor: 'move', // 커서를 이동 아이콘으로 변경
        }}
        className={ classNames(styles.wrapper, 'w-full', 'h-full') }
      >
        <Button className={ classNames("p-0", 'm-0', 'w-full', 'h-full') } onClick={ handleClick }>
          <Image
            src={src}
            width={50}
            height={50}
            className={ classNames('p-0', 'm-0') }
          />
        </Button>
        <Dialog visible={ showDialog } header={`${item?.runeSlot}룬: ${item?.runeNm}`} onHide={() => setShowDialog(false) } modal>
          <p>{ item?.runeDesc }</p>
        </Dialog>
      </div >
  );
}

export default DraggableCard;