import React from 'react';
import { CanvasElement } from '../CanvasElements';
import { Rect, Circle, Star } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

// type for simple shape
export type SimpleShapeType = 'circle' | 'star' | 'rect';

// create simple shape
export function createSimpleShape(shape: string): SimpleShape {
  switch (shape) {
    // return simple circle
    case 'circle':
      return {
        shape: 'circle',
        type: 'simpleShape',
        id: crypto.randomUUID(),
        x: 773,
        y: 521,
        rotation: 0,
        isDragging: false,
      };
    // return a simple rectangle
    case 'rect':
      return {
        shape: 'rect',
        type: 'simpleShape',
        id: crypto.randomUUID(),
        x: 773,
        y: 521,
        rotation: 0,
        isDragging: false,
      };
    // return a simple star
    default:
      return {
        shape: 'star',
        type: 'simpleShape',
        id: crypto.randomUUID(),
        x: 773,
        y: 521,
        rotation: 0,
        isDragging: false,
      };
  }
}

// text shape interface
export interface TextShape extends CanvasElement {
  type: 'textShape';
  text: string;
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

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
  if (elem.shape === 'circle') {
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
  } else if (elem.shape === 'star') {
    return (
      <Star
        id={elem.id}
        key={elem.id}
        x={elem.x}
        y={elem.y}
        rotation={elem.rotation}
        numPoints={5}
        innerRadius={20}
        outerRadius={40}
        draggable={interactable}
        onDragMove={e => handleDragMove(e, shapeList, updateFrameElements)}
        fill='#000000'
      />
    );
  } else if (elem.shape === 'rect') {
    return (
      <Rect
        id={elem.id}
        key={elem.id}
        x={elem.x}
        y={elem.y}
        width={50}
        height={30}
        rotation={elem.rotation}
        draggable={interactable}
        onDragMove={e => handleDragMove(e, shapeList, updateFrameElements)}
        fill='#000000'
      />
    );
  }
};
