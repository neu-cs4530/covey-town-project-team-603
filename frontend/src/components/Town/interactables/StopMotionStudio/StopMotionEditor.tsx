import { Box, Flex, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FigureElement } from './FigureElements';
import { Frame } from './Frame';
import { ControlPanel } from './components/ControlPanel';
import { FiguresSelectionPanel } from './components/FiguresSelectionPanel';
import { Canvas } from './components/Canvas';
import { generateFigure, FigureType } from './FigureElements';
import GIF from 'gif.js';
import { workerBlob } from './WorkerSetup';
import { saveBlob } from './Util';

export function StopMotionEditor({ backHome }: { backHome: () => void }): JSX.Element {
  const [playbackMode, setPlaybackMode] = useState<boolean>(false);
  useEffect(() => {}, []);

  const activeLayerRef = React.useRef(null);

  const frame1: Frame = {
    frameID: 1,
    canvasElements: [],
  };

  const [frames, setFrames] = useState<Frame[]>([frame1]);

  // initialize current frame
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(frames.length - 1);

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

  const addPerson = () => {
    addFigure(generateFigure(FigureType.PERSON, 773, 500));
  };

  const addAnimal = () => {
    addFigure(generateFigure(FigureType.ANIMAL, 773, 500));
  };

  const addBird = () => {
    addFigure(generateFigure(FigureType.BIRD, 773, 500));
  };

  const addText = (text: string) => {
    addFigure([{ type: 'text', text: text, x: 773, y: 500, id: crypto.randomUUID() }]);
  };

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

      //const newFrameList = [...prevFrames, newFrame];

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

  // plays back the stop motion animation so far
  const exportMovie = async () => {
    const delay = 150; // 150 ms
    setPlaybackMode(true);
    setCurrentFrameIndex(0); // set the first frame to be first
    const canvas = activeLayerRef.current.canvas;
    const gif = new GIF({
      workers: 1,
      workerScript: URL.createObjectURL(workerBlob),
      quality: 10,
      height: canvas.height,
      width: canvas.width,
    });
    gif.on('finished', function (blob) {
      saveBlob(blob);
    });

    function sleep(ms) {
      return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
    }

    const doNextFrame = async (count: number) => {
      if (count < frames.length - 1) {
        console.log(count);
        await sleep(delay);
        const pixels = activeLayerRef.current.canvas.context._context;
        gif.addFrame(pixels, { copy: true });
        setCurrentFrameIndex(count + 1);
        await doNextFrame(count + 1);
      } else {
        setPlaybackMode(false);
      }
    };
    await doNextFrame(0);
    gif.render();
  };

  const handleFileChange = (event: Event) => {
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

  function saveAnimState() {
    const stranim = JSON.stringify(frames);
    const mimetype = 'application/json';
    const blob = new Blob([stranim], { type: mimetype });
    saveBlob(blob);
  }

  const triggerFileInput = () => {
    const element = document.getElementById('fileInput');
    if (element !== null) {
      element.click();
    }
  };

  return (
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
        />
      </Flex>
    </Box>
  );
}
