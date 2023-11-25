import { Box, Flex, Spacer } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FigureElement } from './FigureElements';
import { Frame } from './Frame';
import { ControlPanel } from './components/ControlPanel';
import { FiguresSelectionPanel } from './components/FiguresSelectionPanel';
import { Canvas } from './components/Canvas';
import { generateFigure, FigureType } from './FigureElements';
import { SimpleShape } from './components/SimpleShape';

export function StopMotionEditor({ backHome }: { backHome: () => void }): JSX.Element {
  const [playbackMode, setPlaybackMode] = useState<boolean>(false);
  useEffect(() => {}, []);

  const frame1: Frame = {
    frameID: 1,
    canvasElements: [],
  };

  const [frames, setFrames] = useState<Frame[]>([frame1]);

  // initialize current frame
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(frames.length - 1);

  // adds new figures to screen
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

  // adds new simple shapes to screen
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

  const addPerson = () => {
    addFigure(generateFigure(FigureType.PERSON, 773, 500));
  };

  const addAnimal = () => {
    addFigure(generateFigure(FigureType.ANIMAL, 773, 500));
  };

  const addBird = () => {
    addFigure(generateFigure(FigureType.BIRD, 773, 500));
  };

  const addCircle = () => {
    const newCircle: SimpleShape = {
      shape: 'circle',
      type: 'simpleShape',
      id: crypto.randomUUID(),
      x: 773,
      y: 521,
      rotation: 0,
      isDragging: false,
    };

    addSimpleShape(newCircle);
  };

  const addStar = () => {
    const newStar: SimpleShape = {
      shape: 'star',
      type: 'simpleShape',
      id: crypto.randomUUID(),
      x: 773,
      y: 521,
      rotation: 0,
      isDragging: false,
    };
    addSimpleShape(newStar);
  };

  const addRect = () => {
    const newRect: SimpleShape = {
      shape: 'rect',
      type: 'simpleShape',
      id: crypto.randomUUID(),
      x: 773,
      y: 521,
      rotation: 0,
      isDragging: false,
    };
    addSimpleShape(newRect);
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
    const bloburl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.cssText = 'display: none';
    a.href = bloburl;

    a.download = 'animation.json';
    a.click();

    URL.revokeObjectURL(bloburl);

    document.body.removeChild(a);
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
        />
      </Flex>
    </Box>
  );
}
