import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FigureElement } from './FigureElements';
import { Frame } from './Frame';
import { ControlPanel } from './components/ControlPanel';
import { Canvas } from './components/Canvas';

export function StopMotionEditor({ backHome }: { backHome: () => void }): JSX.Element {
  const [playbackMode, setPlaybackMode] = useState<boolean>(false);
  useEffect(() => {}, []);

  // the left side panel which allows users to select and drag new items on to the canvas
  const FiguresSelectionPanel = () => {
    return (
      <Box width={'100%'} backgroundColor={'orange'} padding={10}>
        <Text>Figure Selection Window</Text>
      </Box>
    );
  };

  const figure1Torso: FigureElement = {
    type: 'figure',
    // a KonvaRect
    appearance: {
      type: 'rect',
      length: 50,
      width: 20,
    },
    id: 'figure_1_torso',
    // This is the root
    parent: undefined,
    // Because this is the root, these are absolute posns
    offset_x: 773, //----------------------------------------------------------> these offset x and y should probably not be hard coded
    offset_y: 521,
    offset_rotation: 0,
    offset_attach_rotation: 0,
    offset_attach_x: 0,
    offset_attach_y: 0,
    isDragging: false,
  };

  const figure1Head: FigureElement = {
    type: 'figure',
    // a KonvaCircle
    appearance: {
      type: 'circle',
      radius: 10,
    },
    id: 'figure_1_head',
    parent: figure1Torso,
    offset_x: 10,
    offset_y: -10,
    offset_rotation: 0,
    offset_attach_rotation: Math.PI / 2,
    offset_attach_x: 0,
    offset_attach_y: 10,
    isDragging: false,
  };

  const figure1LeftLeg: FigureElement = {
    type: 'figure',
    appearance: {
      type: 'rect',
      length: 25,
      width: 5,
    },
    id: 'figure_1_left_leg',
    parent: figure1Torso,
    offset_x: 0,
    offset_y: 45,
    // for now
    offset_rotation: 0,
    offset_attach_rotation: -(Math.PI / 2),
    offset_attach_x: 0,
    offset_attach_y: 0,
    isDragging: false,
  };

  const frame1: Frame = {
    frameID: 1,
    canvasElements: [figure1Head, figure1LeftLeg, figure1Torso],
  };

  const figure2Torso: FigureElement = {
    type: 'figure',
    // a KonvaRect
    appearance: {
      type: 'rect',
      length: 50,
      width: 20,
    },
    id: 'figure_2_torso',
    // This is the root
    parent: undefined,
    // Because this is the root, these are absolute posns
    offset_x: 773, //----------------------------------------------------------> these offset x and y should probably not be hard coded
    offset_y: 721,
    offset_rotation: 0,
    offset_attach_rotation: 0,
    offset_attach_x: 0,
    offset_attach_y: 0,
    isDragging: false,
  };

  const figure2Head: FigureElement = {
    type: 'figure',
    // a KonvaCircle
    appearance: {
      type: 'circle',
      radius: 10,
    },
    id: 'figure_2_head',
    parent: figure2Torso,
    offset_x: 10,
    offset_y: -10,
    offset_rotation: 0,
    offset_attach_rotation: Math.PI / 2,
    offset_attach_x: 0,
    offset_attach_y: 10,
    isDragging: false,
  };

  const figure2LeftLeg: FigureElement = {
    type: 'figure',
    appearance: {
      type: 'rect',
      length: 25,
      width: 5,
    },
    id: 'figure_2_left_leg',
    parent: figure2Torso,
    offset_x: 0,
    offset_y: 45,
    // for now
    offset_rotation: 0,
    offset_attach_rotation: -(Math.PI / 2),
    offset_attach_x: 0,
    offset_attach_y: 0,
    isDragging: false,
  };

  const frame2: Frame = {
    frameID: 2,
    canvasElements: [figure2Head, figure2Torso],
  };

  const [frames, setFrames] = useState<Frame[]>([frame1, frame2]);

  // initialize current frame
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(frames.length - 1);

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

  const handleFileChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        if (content !== null) {
          const savedFrames = JSON.parse(content);
          if (savedFrames.length !== 0) {
            setCurrentFrameIndex(0);
            setFrames(() => {
              return savedFrames;
            });
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
    document.getElementById('fileInput')?.click();
  };

  return (
    <Box backgroundColor={'white'}>
      {/* vertical flex */}
      <Flex direction='column'>
        {/* items in row one */}
        <Flex>
          {/* panel for selecting new characters to drag onto the canvas */}
          <FiguresSelectionPanel />
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
