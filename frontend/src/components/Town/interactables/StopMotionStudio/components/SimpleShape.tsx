import React from 'react';
import { CanvasElement } from '../CanvasElements';
import { Rect, Circle, Star } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

// type for simple shape
export type SimpleShapeType = 'circle' | 'star' | 'rect';

// simple shape interface
export interface SimpleShape extends CanvasElement {
  type: 'simpleShape';
  shape: SimpleShapeType;
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

// callback for the ondrag call
const handleDragMove = (
  e: KonvaEventObject<DragEvent>,
  shapeList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
) => {
  // we need to get the absolute "attachment point" to rotate a limb properly.
  const newX = e.target.position().x;
  const newY = e.target.position().y;

  updateFrameElements(
    shapeList.map(elem => {
      if (elem.type === 'simpleShape') {
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

// converts simple shape to konva element
export const simpleShapeToKonvaElement = (
  elem: SimpleShape,
  shapeList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
  interactable: boolean,
) => {
  console.log('here for sure');
  if (elem.shape === 'circle') {
    console.log(elem.x)
    console.log(elem.y)
    return (
      <Circle
        id={elem.id}
        key={elem.id}
        x={elem.x}
        y={elem.y}
        rotation={elem.rotation}
        radius={20}
        draggable={interactable}
        onDragMove={e => handleDragMove(e, shapeList, updateFrameElements)}
        fill='#000000'
      />
    );
  } else if (elem.shape == 'star') {
    return (
      <Star
        key={elem.id}
        x={elem.x}
        y={elem.y}
        numPoints={5}
        innerRadius={20}
        outerRadius={40}
        draggable
        onDragMove={e => handleDragMove(e, shapeList, updateFrameElements)}
      />
    );
  } else if (elem.shape == 'rect') {
    return (
      <Rect
        key={elem.id}
        x={elem.x}
        y={elem.y}
        width={50}
        height={30}
        draggable
        onDragMove={e => handleDragMove(e, shapeList, updateFrameElements)}
      />
    );
  }
};
