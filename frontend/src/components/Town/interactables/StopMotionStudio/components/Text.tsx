import React from 'react';
import { Text } from 'react-konva';
import { CanvasElement } from '../CanvasElements';
import { KonvaEventObject } from 'konva/lib/Node';

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
      if (elem.type === 'textShape') {
        const textShapeElem = elem as TextShape;
        const dragId = e.target.attrs.id;

        if (textShapeElem.id == dragId) {
          return {
            ...textShapeElem,
            x: newX,
            y: newY,
          };
        } else {
          return textShapeElem;
        }
      } else {
        return elem;
      }
    }),
  );
};

export function textToKonvaText(
  elem: CanvasElement,
  elementList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
  interactable: boolean,
) {
  const textElem = elem as TextShape;
  return (
    <Text
      id={textElem.id}
      key={textElem.id}
      x={textElem.x}
      y={textElem.y}
      fontSize={25}
      text={textElem.text}
      draggable={interactable}
      onDragMove={e => handleDragMoveText(e, elementList, updateFrameElements)}
    />
  );
}

// TextShape interface
export interface TextShape extends CanvasElement {
  type: 'textShape';
  text: string;
  id: string;
  x: number;
  y: number;
}
