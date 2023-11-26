import React from 'react';
import { Text } from 'react-konva';

// callback for the ondrag call
export const handleDragMoveText = (
  e: KonvaEventObject<DragEvent>,
  shapeList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
) => {
  // we need to get the absolute "attachment point" to rotate a limb properly.
  const newX = e.target.position().x;
  const newY = e.target.position().y;

  updateFrameElements(
    shapeList.map(elem => {
      if (elem.type === 'text') {
        const simpleShapeElem = elem as SimpleShape;
        const dragId = e.target.attrs.id;

        if (simpleShapeElem.id == dragId) {
          return {
            ...simpleShapeElem,
            x: newX,
            y: newY,
          };
        } else {
          return simpleShapeElem;
        }
      } else {
        return elem;
      }
    }),
  );
};

export function textToKonvaText(
  elem,
  textList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
  interactable: boolean,
) {
  console.log(interactable);
  return (
    <Text
      id={elem.id}
      key={elem.id}
      x={elem.x}
      y={elem.y}
      fontSize={25}
      text={elem.text}
      draggable={interactable}
      onDragMove={e => handleDragMoveText(e, textList, updateFrameElements)}
    />
  );
}
