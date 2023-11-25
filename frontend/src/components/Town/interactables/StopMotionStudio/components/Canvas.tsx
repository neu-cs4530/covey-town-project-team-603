import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Text, Rect } from 'react-konva';
import { CanvasElement } from '../CanvasElements';
import { FigureElement, toKonvaElement } from '../FigureElements';
import { Frame } from '../Frame';
import { Box } from '@chakra-ui/react';

type CanvasProps = {
  frames: Frame[];
  setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
  playbackMode: boolean;
  currentFrame: number;
  activeLayerRef: any;
};

// the interactable canvas to construct the stop motion scenes
export const Canvas: React.FC<CanvasProps> = ({
  setFrames: update,
  frames: canvasFrames,
  playbackMode: playbackMode,
  currentFrame: currentFrameIndex,
  activeLayerRef: activeLayerRef,
}) => {
  // the canvas should always be displaying two screens
  // 1. past frame which is not interactable
  // 2. current editable frame with full opacity on top

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const canvasWidth = 1300;
  const canvasHeight = 800;

  function updateFrameElements(elems: CanvasElement[]) {
    console.log('ypdate frame elements');
    update((previousFrames: Frame[]) => {
      // Make a shallow copy of the previous frames
      //const updatedFrames = [...prevFrames];
      const updatedFrames = previousFrames.slice(0, -1);
      // Update the last frame (assuming there is at least one frame)
      const lastFrame = previousFrames[previousFrames.length - 1];
      lastFrame.canvasElements = elems;
      updatedFrames.push(lastFrame);
      return updatedFrames;
    });
  }
  // stores the canvas frames
  //const [frames, setFrames] = useState<Frame[]>([frame1, frame2]);

  // this use effect currently manually sets one frame for testing
  useEffect(() => {}, []);

  // updater callback for current frame elements

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
              // Render each element of the second-to-last frame
              if (elem.type == 'figure') {
                const figureElem = elem as FigureElement; // case current element to figure element
                return toKonvaElement(
                  figureElem,
                  canvasFrames[currentFrameIndex - 1].canvasElements,
                  updateFrameElements,
                  false,
                );
              } else if (elem.type == 'simpleShape') {
                // return some other type here
                return {};
              }
            })}
          </Layer>
        )}

        {/* Render the last frame (current frame) */}
        <Layer ref={activeLayerRef}>
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
            if (elem.type == 'figure') {
              const figureElem = elem as FigureElement; // case current element to figure element
              return toKonvaElement(
                figureElem,
                canvasFrames[currentFrameIndex].canvasElements,
                updateFrameElements,
                currentFrameIndex == canvasFrames.length - 1,
              );
            } else if (elem.type == 'simpleShape') {
              // return some other type here
              return {};
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
