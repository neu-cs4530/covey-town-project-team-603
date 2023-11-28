import { Box, Flex, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState, ChangeEvent } from 'react';
import Konva from 'konva';
import { FigureElement } from './FigureElements';
import { Frame } from './Frame';
import { ControlPanel } from './components/ControlPanel';
import { FiguresSelectionPanel } from './components/FiguresSelectionPanel';
import { Canvas } from './components/Canvas';
import { generateFigure, FigureType } from './FigureElements';
import { SimpleShape, TextShape, createSimpleShape } from './components/SimpleShape';
import GIF from 'gif.js';
import { workerBlob } from './WorkerSetup';
import { saveBlob } from './Util';

/**
 * StopMotionEditor component allows users to create and edit stop motion animations.
 * It comprises a canvas for rendering the animation frames, a control panel for managing the frames,
 * and a selection panel for adding new elements to the animation.
 * Users can save, load, and export animations, as well as navigate through different frames.
 *
 * @param {function} backHome - Callback function to navigate back to the home screen.
 */

export function StopMotionEditor({ backHome }: { backHome: () => void }): JSX.Element {
  const [playbackMode, setPlaybackMode] = useState<boolean>(false);
  useEffect(() => {}, []);

  const activeLayerRef = React.useRef<Konva.Layer>(null);

  // Initialize the default frame for the animation
  const defaultFrame: Frame = {
    frameID: 1,
    canvasElements: [],
  };

  const [frames, setFrames] = useState<Frame[]>([defaultFrame]);

  // Track the current frame index for editing and playback
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(frames.length - 1);

  // Function to add new figures to the current frame
  const addFigure = (newElems: FigureElement[]) => {
    setCurrentFrameIndex(frames.length - 1);
    setFrames((prevFrames: Frame[]) => {
      const updatedFrames = prevFrames.slice(0, -1);
      const lastFrame = prevFrames[prevFrames.length - 1];
      lastFrame.canvasElements = [...lastFrame.canvasElements, ...newElems];
      updatedFrames.push(lastFrame);
      return updatedFrames;
    });
  };

  // Adds new simple shapes to screen
  const addSimpleShape = (newElem: SimpleShape) => {
    setCurrentFrameIndex(frames.length - 1);
    setFrames((prevFrames: Frame[]) => {
      const updatedFrames = prevFrames.slice(0, -1);
      const lastFrame = prevFrames[prevFrames.length - 1];
      lastFrame.canvasElements = [...lastFrame.canvasElements, newElem];
      updatedFrames.push(lastFrame);
      return updatedFrames;
    });
  };

  // Adds new text elements
  const addTextShape = (text: string) => {
    setCurrentFrameIndex(frames.length - 1);
    setFrames((prevFrames: Frame[]) => {
      const updatedFrames = prevFrames.slice(0, -1);
      const lastFrame = prevFrames[prevFrames.length - 1];

      const newElem: TextShape = {
        type: 'textShape',
        text: text,
        x: 773,
        y: 500,
        id: crypto.randomUUID(),
        isDragging: false,
        rotation: 0,
      };

      lastFrame.canvasElements = [...lastFrame.canvasElements, newElem];
      updatedFrames.push(lastFrame);
      return updatedFrames;
    });
  };

  // add person
  const addPerson = () => {
    addFigure(generateFigure(FigureType.PERSON, 773, 500));
  };

  // add animal
  const addAnimal = () => {
    addFigure(generateFigure(FigureType.ANIMAL, 773, 500));
  };

  // add bird
  const addBird = () => {
    addFigure(generateFigure(FigureType.BIRD, 773, 500));
  };

  const addText = (text: string) => {
    // addFigure([{ type: 'text', text: text, x: 773, y: 500, id: crypto.randomUUID() }]);
    addTextShape(text);
  };

  // add circle
  const addCircle = () => {
    addSimpleShape(createSimpleShape('circle'));
  };

  // add star
  const addStar = () => {
    addSimpleShape(createSimpleShape('star'));
  };

  // add rectangle
  const addRect = () => {
    addSimpleShape(createSimpleShape('rect'));
  };

  // add new frame
  function addNewFrame() {
    setCurrentFrameIndex(frames.length);
    setFrames((prevFrames: Frame[]) => {
      // Clone the last frame's elements to create a new frame
      const newFrameElements = prevFrames[prevFrames.length - 1].canvasElements.map(elem => {
        return { ...elem }; // Shallow copy each element
      });

      // Create a new frame with current elements and new ID
      const newFrame = {
        frameID: prevFrames.length + 1,
        canvasElements: newFrameElements,
      };

      return [...prevFrames, newFrame]; //add new frame
    });
  }

  // increments the frame forward
  const frameForward = () => {
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    }
  };

  // increments the frame backwards
  const frameBackward = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
    }
  };

  // plays back the stop motion animation so far
  const playback = async () => {
    const delay = 150; // 150 ms
    setPlaybackMode(true);
    setCurrentFrameIndex(0); // set the first frame to be first

    // plays next frame
    const playNextFrame = async (count: number) => {
      if (count < frames.length - 1) {
        setTimeout(() => {
          setCurrentFrameIndex(count + 1);
          playNextFrame(count + 1);
        }, delay); // Adjust the delay time as needed
      } else {
        setPlaybackMode(false);
      }
    };

    await playNextFrame(0);
  };

  // Function to export the animation as a GIF
  const exportMovie = async () => {
    const delay = 150; // 150 ms
    setPlaybackMode(true);
    setCurrentFrameIndex(0); // set the first frame to be first
    let gif: GIF;
    let canvas;
    if (activeLayerRef.current !== null) {
      canvas = activeLayerRef.current.canvas;
      gif = new GIF({
        workers: 1,
        workerScript: URL.createObjectURL(workerBlob),
        quality: 10,
        height: canvas.height,
        width: canvas.width,
      });
      gif.on('finished', function (blob: Blob) {
        saveBlob(blob);
      });
    } else {
      throw new Error();
    }
    // Adds a delay in ms
    function sleep(ms: number) {
      return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
    }
    // Creates the gif and renders it
    const doNextFrame = async (count: number) => {
      if (count < frames.length - 1) {
        console.log(count);
        await sleep(delay);
        if (activeLayerRef.current !== null) {
          const pixels = activeLayerRef.current.canvas.context._context;
          gif.addFrame(pixels, { copy: true });
        }
        setCurrentFrameIndex(count + 1);
        await doNextFrame(count + 1);
      } else {
        setPlaybackMode(false);
      }
    };
    await doNextFrame(0);
    gif.render();
  };

  // Function to handle file input for loading animations
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target !== null && e.target.result !== null) {
          const content = e.target.result as string;
          const savedFrames = JSON.parse(content);
          if (savedFrames.length !== 0) {
            setCurrentFrameIndex(0);
            setFrames(savedFrames);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to save the current animation state as JSON
  function saveAnimState() {
    const stranim = JSON.stringify(frames);
    const mimetype = 'application/json';
    const blob = new Blob([stranim], { type: mimetype });
    saveBlob(blob);
  }

  // Function to trigger file input for loading animations
  const triggerFileInput = () => {
    const element = document.getElementById('fileInput');
    if (element !== null) {
      element.click();
    }
  };

  // Function to trigger reset of frames
  const resetFrames = () => {
    setFrames([defaultFrame]);
    setCurrentFrameIndex(0);
  };

  return (
    // Render the editor layout with selection panel, canvas, and control panel
    <Box backgroundColor={'white'}>
      {/* vertical flex */}
      <Flex direction='column'>
        {/* items in row one */}
        <Flex>
          {/* panel for selecting new characters to drag onto the canvs */}
          <FiguresSelectionPanel
            addPerson={addPerson}
            addAnimal={addAnimal}
            addBird={addBird}
            addText={addText}
            addCircle={addCircle}
            addStar={addStar}
            addRect={addRect}
          />
          <Spacer />

          {/* canvas for creating stop motion scene */}
          <Canvas
            frames={frames}
            setFrames={setFrames}
            playbackMode={playbackMode}
            currentFrame={currentFrameIndex}
            activeLayerRef={activeLayerRef}
          />
        </Flex>

        {/* items in row two */}
        <ControlPanel
          addNewFrame={addNewFrame}
          playback={playback}
          frameBackward={frameBackward}
          frameForward={frameForward}
          backHome={backHome}
          fileInput={triggerFileInput}
          saveAnimState={saveAnimState}
          handleChange={handleFileChange}
          exportMovie={exportMovie}
          reset={resetFrames}
        />
      </Flex>
    </Box>
  );
}
