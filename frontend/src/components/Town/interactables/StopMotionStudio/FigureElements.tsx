import React from 'react';
import { Rect, Circle, RegularPolygon } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasElement, CanvasElementType } from './CanvasElements';

interface KonvaRect {
  type: 'rect';
  length: number;
  width: number;
}

interface KonvaCircle {
  type: 'circle';
  radius: number;
}

interface KonvaTri {
  type: 'tri';
  radius: number;
}

// Types of konva shape.
// Used in FigureElement to provide an appearance.
type KonvaShape = KonvaCircle | KonvaRect | KonvaTri;

// TODO: Movement is hierarchical.
// 1. Moving a "parent" node should move all of the children nodes.
// 2. However, in order to judge how a node should be moved, we need to know which node is the root, i.e., has no parent.

// The proposal is to use offsets to take care of requirement 1.
// Then, requirement 2 is satified by tracking the (nullable) parent.
export interface FigureElement extends CanvasElement {
  type: 'figure';
  appearance: KonvaShape;
  id: string;
  parent?: FigureElement;

  // If the parent is not null, these represent the offset from the parent.
  // If the parent is null, these represent the absolute.
  offset_x: number;
  offset_y: number;
  offset_rotation: number;

  // Where does this visually attach? encoded as an offset from the center
  offset_attach_x: number;
  offset_attach_y: number;

  // How do we project out from the attachment point?
  offset_attach_rotation: number;

  isDragging: boolean;
  dragOverride: boolean;
}

// Get the absolute position of a FigureElement by summing up the offsets.
function absolutePosn(elem: FigureElement) {
  let absolute_x = 0;
  let absolute_y = 0;
  let absolute_rotation = 0;

  let iter: FigureElement | undefined = elem;

  // not undefined
  while (iter !== undefined) {
    absolute_x += iter.offset_x;
    absolute_y += iter.offset_y;
    absolute_rotation += iter.offset_rotation;
    iter = iter.parent;
  }
  const retval = { absolute_x, absolute_y, absolute_rotation };

  return retval;
}

const rotatePointAround = (
  origin_x: number,
  origin_y: number,
  target_x: number,
  target_y: number,
  rad: number,
) => {
  const rcos = Math.cos(rad);
  const rsin = Math.sin(rad);

  return {
    x: rcos * (target_x - origin_x) - rsin * (target_y - origin_y) + origin_x,
    y: rsin * (target_x - origin_x) + rcos * (target_y - origin_y) + origin_y,
  };
};

const handleDragStartFigure = (
  e: KonvaEventObject<DragEvent>,
  figureList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
) => {
  const dragId = e.target.attrs.id;
  /*
  updateFrameElements(
    figureList.map(elem => {
      console.log('elem')
      if (elem.type === 'figure') {
        console.log('figure');
        const figureElem = elem as FigureElement;
        return {
          ...figureElem,
          isDragging: figureElem.id === dragId,
        };
      } else {
        return elem;
      }
    }),
  );
  */
};

const handleDragEndFigure = (
  e: KonvaEventObject<DragEvent>,
  figureList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
) => {
  const dragId = e.target.attrs.id;
  console.log(figureList);

  /*
  updateFrameElements(
    figureList.map(elem => {
      if (elem.type == 'figure') {
        const figureElem = elem as FigureElement;
        return {
          ...figureElem,
          isDragging: false,
        };
      } else {
        return elem;
      }
    }),
  );
  */

};

const handleDragMoveFigure = (
  e: KonvaEventObject<DragEvent>,
  figureList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
) => {
  const dragId = e.target.attrs.id;
  console.log('dragmove')
  console.log(`dragging the ${dragId}`)

  // we need to get the absolute "attachment point" to rotate a limb properly.
  const targetPositionX = e.target.position().x;
  const targetPositionY = e.target.position().y;

  updateFrameElements(
    figureList.map(elem => {
      if (elem.type == 'figure') {
        const figureElem = elem as FigureElement;

        let newOffsetX = figureElem.offset_x;
        let newOffsetY = figureElem.offset_y;
        let newOffsetAttachX = figureElem.offset_attach_x;
        let newOffsetAttachY = figureElem.offset_attach_y;

        let newAttachRot = figureElem.offset_attach_rotation;
        let newRot = figureElem.offset_rotation;

        const rotDiff = newRot - newAttachRot;

        // If the current map member is the target...
        const targetPointerPos = e.target.getStage()?.getPointerPosition();
        if (figureElem.id === dragId && targetPointerPos) {
          const cursorPosition = targetPointerPos;
          const rotationOriginX = targetPositionX + figureElem.offset_attach_x;
          const rotationOriginY = targetPositionY + figureElem.offset_attach_y;

          // To get the expected vector, we also have to invert the y-axis.
          // Due to the difference between standard math way, and computer graphics way.
          const dragVectorX = cursorPosition.x - rotationOriginX;
          const dragVectorY = -cursorPosition.y + rotationOriginY;

          // This is over the span of the drag.
          const dragRotationRadians = Math.atan2(dragVectorY, dragVectorX);

          // console.log(`Drag radians: ${dragRotationRadians}`);

          /// ... and if it is a root element...
          if (figureElem.parent === undefined) {
            // Update the linear position.
            newOffsetX = targetPositionX;
            newOffsetY = targetPositionY;
          } else {
            console.log('rotate child')
            // if it is a child element...

            // FIXME: every move will apply a rotation, so even when the /drag angle/ is constantly the same,
            // the same rotation is applied over and over again.

            // I think we need to keep track of the "rotation so far".
            // Additionally, we probably need to record a drag_init_rotation_degrees.

            const toRotate = figureElem.offset_attach_rotation - dragRotationRadians;
            // console.log(`Amount to rotate by: ${toRotate}`);

            const rotatedAttachmentOffset = rotatePointAround(
              0,
              0,
              figureElem.offset_attach_x,
              figureElem.offset_attach_y,
              toRotate,
            );

            const rotatedTargetPosn = rotatePointAround(
              rotationOriginX,
              rotationOriginY,
              targetPositionX,
              targetPositionY,
              toRotate,
            );

            // For a deep hierarchy we need to get absolute posn but this will do for now
            const parentTargetPosnX = figureElem.parent.offset_x;
            const parentTargetPosnY = figureElem.parent.offset_y;

            newOffsetX = rotatedTargetPosn.x - parentTargetPosnX;
            newOffsetY = rotatedTargetPosn.y - parentTargetPosnY;

            newOffsetAttachX = rotatedAttachmentOffset.x;
            newOffsetAttachY = rotatedAttachmentOffset.y;

            newAttachRot = dragRotationRadians;
            newRot = newAttachRot + rotDiff;

            // console.log(`Rotation difference: ${rotDiff}`);
            // console.log(`The saved rotation: ${newRot}`);
            // console.log(`The saved offset rotation: ${newAttachRot}`);
          }
        }

        // If the current map member's parent is the target...
        // This is necessary to avoid stale references.

        // FIXME: This won't work if it happens to be in the wrong order.
        // But it could also work if we make sure to lay it out in the 'right' way.
        if (figureElem.parent !== undefined && figureElem.parent.id === dragId) {
          console.log('Reference fix!')
          figureElem.parent = {
            ...figureElem.parent,
            offset_x: targetPositionX,
            offset_y: targetPositionY,
          };
        }

        return {
          ...figureElem,

          offset_x: newOffsetX,
          offset_y: newOffsetY,
          offset_rotation: newRot,

          offset_attach_x: newOffsetAttachX,
          offset_attach_y: newOffsetAttachY,
          offset_attach_rotation: newAttachRot,
        };
      } else {
        return elem;
      }
    }),
  );
};

export const toKonvaElement = (
  elem: FigureElement,
  figureList: CanvasElement[],
  updateFrameElements: (newValue: CanvasElement[]) => void,
  interactable: boolean,
) => {
  console.log(interactable);
  const absolutePosnVar = absolutePosn(elem);

  function identityPos(pos: Vector2d) {
    console.log('identity')
    const absolutePosnVar = absolutePosn(elem);
    return {
      x: absolutePosnVar.absolute_x,
      y: absolutePosnVar.absolute_y,
    };
  }

  switch (elem.appearance.type) {
    case 'rect':
      return (
        <Rect
          key={elem.id}
          id={elem.id}
          x={absolutePosnVar.absolute_x}
          y={absolutePosnVar.absolute_y}
          rotation={absolutePosnVar.absolute_rotation * (180 / Math.PI) * -1}
          height={elem.appearance.length}
          width={elem.appearance.width}
          draggable={!elem.dragOverride && interactable}
          dragBoundFunc={elem.parent && identityPos}
          onDragStart={e => handleDragStartFigure(e, figureList, updateFrameElements)}
          onDragEnd={e => handleDragEndFigure(e, figureList, updateFrameElements)}
          onDragMove={e => handleDragMoveFigure(e, figureList, updateFrameElements)}
          fill='#000000'
        />
      );
    case 'circle':
      return (
        <Circle
          key={elem.id}
          id={elem.id}
          x={absolutePosnVar.absolute_x}
          y={absolutePosnVar.absolute_y}
          rotation={absolutePosnVar.absolute_rotation * (180 / Math.PI) * -1}
          radius={elem.appearance.radius}
          draggable={!elem.dragOverride && interactable}
          dragBoundFunc={elem.parent && identityPos}
          onDragStart={e => handleDragStartFigure(e, figureList, updateFrameElements)}
          onDragMove={e => handleDragMoveFigure(e, figureList, updateFrameElements)}
          onDragEnd={e => handleDragEndFigure(e, figureList, updateFrameElements)}
          fill='#000000'
        />
      );
    case 'tri':
      return (
        <RegularPolygon
          sides={3}
          key={elem.id}
          id={elem.id}
          x={absolutePosnVar.absolute_x}
          y={absolutePosnVar.absolute_y}
          rotation={absolutePosnVar.absolute_rotation * (180 / Math.PI) * -1}
          draggable={!elem.dragOverride && interactable}
          radius={elem.appearance.radius}
          dragBoundFunc={elem.parent && identityPos}
          onDragStart={e => handleDragStartFigure(e, figureList, updateFrameElements)}
          onDragMove={e => handleDragMoveFigure(e, figureList, updateFrameElements)}
          onDragEnd={e => handleDragEndFigure(e, figureList, updateFrameElements)}
          fill='#000000'
        />      
        )
  }
};
