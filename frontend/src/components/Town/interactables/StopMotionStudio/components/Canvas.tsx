import React, { useRef, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer, Text, Rect } from 'react-konva';
import { CanvasElement } from '../CanvasElements';
import { FigureElement, toKonvaElement } from '../FigureElements';
import { Frame } from '../Frame';
import { Box } from '@chakra-ui/react';
import { SimpleShape, simpleShapeToKonvaElement } from './SimpleShape';
import { textToKonvaText } from './Text';

/**
 * The Canvas for the Stop Motion Studio represents the working area of the Stop Motion Animator.
 * Here figures can be dragged around and manipulated on the top layer, and the previous layer
 * is visible with low opacity in order to see edit history for smooth animation creation.
 * This represents the visual representation of the Canvas.
 */

type CanvasProps = {
  frames: Frame[]; // Array of frames representing the animation.
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>; // Function to update frames.
  playbackMode: boolean; // Flag to indicate if the canvas is in playback mode.
  currentFrame: number; // Index of the current frame being edited.
  activeLayerRef: React.RefObject<Konva.Layer>; // Ref to the active layer for additional manipulations.
};

// The interactable Canvas to construct the stop motion scenes
export const Canvas: React.FC<CanvasProps> = ({
  setFrames: update,
  frames: canvasFrames,
  playbackMode: playbackMode,
  currentFrame: currentFrameIndex,
  activeLayerRef: activeLayerRef,
}) => {
  // the Canvas should always be displaying two screens
  // 1. past frame which is not interactable
  // 2. current editable frame with full opacity on top

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const canvasWidth = 1300; // Width of the canvas.
  const canvasHeight = 800; // Height of the canvas.

  /**
   * Updates the elements within the current frame.
   * @param elems Array of CanvasElement to update the current frame with.
   */

  // Callback function updates elements on drag
  function updateFrameElements(elems: CanvasElement[]) {
    update((previousFrames: Frame[]) => {
      // Make a shallow copy of the previous frames
      const updatedFrames = previousFrames.slice(0, -1);
      // Update the last frame (assuming there is at least one frame)
      const lastFrame = previousFrames[previousFrames.length - 1];
      lastFrame.canvasElements = elems;
      updatedFrames.push(lastFrame);
      return updatedFrames;
    });
  }

  return (
    <Box
      ref={canvasRef}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#e5e5ea',
      }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        {/* previous layer (non interactable) */}
        {/* Render the second-to-last frame with lower opacity */}
        {/* only render if playback mode is not activated */}
        {canvasFrames.length > 1 && currentFrameIndex > 0 && !playbackMode && (
          <Layer opacity={0.1}>
            {canvasFrames[currentFrameIndex - 1].canvasElements.map(elem => {
              console.log('here first');
              // Render each element of the second-to-last frame
              if (elem.type == 'figure') {
                // if the element is a figure
                const figureElem = elem as FigureElement; // case current element to figure element
                return toKonvaElement(
                  figureElem,
                  canvasFrames[currentFrameIndex - 1].canvasElements,
                  updateFrameElements,
                  false,
                );
              } else if (elem.type == 'simpleShape') {
                // if the element is a simple shape
                const simpleShapeElem = elem as SimpleShape; // cast current element as simple shape
                return simpleShapeToKonvaElement(
                  simpleShapeElem,
                  canvasFrames[currentFrameIndex - 1].canvasElements,
                  updateFrameElements,
                  false,
                );
                // return some other type here
                return {};
              } else if (elem.type === 'textShape') {
                return textToKonvaText(
                  elem,
                  canvasFrames[currentFrameIndex - 1].canvasElements,
                  updateFrameElements,
                  false,
                );
              }
            })}
          </Layer>
        )}

        {/* Render the last frame (current frame) */}
        <Layer ref={activeLayerRef}>
          {/* background for export mode */}
          {playbackMode && (
            <Rect
              id='export-background'
              key='export-background'
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill='#e5e5ea'
              rotation={0}
            />
          )}
          {canvasFrames[currentFrameIndex].canvasElements.map(elem => {
            // Render each element of the last frame (current frame)
            // Figures
            if (elem.type == 'figure') {
              const figureElem = elem as FigureElement; // cast current element to figure element
              return toKonvaElement(
                figureElem,
                canvasFrames[currentFrameIndex].canvasElements,
                updateFrameElements,
                currentFrameIndex == canvasFrames.length - 1,
              ); // Simple Shapes
            } else if (elem.type == 'simpleShape') {
              const simpleShapeElem = elem as SimpleShape; // cast current element as simple shape
              return simpleShapeToKonvaElement(
                simpleShapeElem,
                canvasFrames[currentFrameIndex].canvasElements,
                updateFrameElements,
                currentFrameIndex == canvasFrames.length - 1,
              );
              // Text
            } else if (elem.type === 'textShape') {
              return textToKonvaText(
                elem,
                canvasFrames[currentFrameIndex].canvasElements,
                updateFrameElements,
                currentFrameIndex == canvasFrames.length - 1,
              );
            }
          })}
        </Layer>
        <Layer>
          {/* layer displays current frame count */}
          <Text
            offsetX={-10}
            offsetY={-10}
            fontSize={25}
            text={currentFrameIndex + 1 + ' / ' + canvasFrames.length}
          />
        </Layer>
      </Stage>
    </Box>
  );
};
