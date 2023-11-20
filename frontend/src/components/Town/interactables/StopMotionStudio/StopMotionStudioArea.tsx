import {
  Box,
  Button,
  Container,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Flex,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Text as KonvaText } from 'react-konva';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useInteractable, useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { InteractableID } from '../../../../types/CoveyTownSocket';
// import StopMotionArea from '../StopMotionArea';
import StopMotionAreaInteractable from '../StopMotionArea';
//import StopMotionAreaController from '../../../../classes/interactable/StopMotionAreaController';
import { Stage, Layer, Star, Group } from 'react-konva';
//import { blue } from '@material-ui/core/colors';
//import Konva from 'konva';
//import { Vector2d } from 'konva/lib/types';
import { toKonvaElement, FigureElement } from './FigureElements';
import { CanvasElement, StarShape } from './CanvasElements';
//import { KonvaEventObject } from 'konva/lib/Node';
import { Frame } from './Frame';

function StopMotionStudioArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  useEffect(() => {}, []);

  // the left side panel which allows users to select and drag new items on to the canvas
  const FiguresSelectionPanel = () => {
    return (
      <Box width={'100%'} backgroundColor={'orange'} padding={10}>
        <Text>Figure Selection Window</Text>
      </Box>
    );
  };

  type CanvasProps = {
    frames: Frame[];
    setFrames: React.Dispatch<React.SetStateAction<Frame[]>>;
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

  // this is the first default frame, which allows users to go back and edit the
  // first frame, without running out of bounds on the previous layer
  const defaultFrame: Frame = {
    frameID: 0,
    canvasElements: [],
  };

  // const [frames, setFrames] = useState<Frame[]>([default]);

  const [frames, setFrames] = useState<Frame[]>([defaultFrame, frame1, frame2]);

  // initialize current frame
  const [currentFrame, setCurrentFrame] = useState<number>(frames.length - 1);

  function addNewFrame() {
    setCurrentFrame(frames.length);
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

  const frameForward = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const frameBackward = () => {
    if (currentFrame > 1) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  // the interactable canvas to construct the stop motion scenes
  const Canvas: React.FC<CanvasProps> = ({ setFrames: update, frames: canvasFrames }) => {
    // the canvas should always be displaying two screens
    // 1. past frame which is not interactable
    // 2. current editable frame with full opacity on top

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const canvasWidth = 1300;
    const canvasHeight = 800;
    function updateFrameElements(elems: CanvasElement[]) {
      update((frames: Frame[]) => {
        // Make a shallow copy of the previous frames
        //const updatedFrames = [...prevFrames];
        const updatedFrames = frames.slice(0, -1);
        //console.log(updatedFrames);
        // Update the last frame (assuming there is at least one frame)
        const lastFrame = frames[frames.length - 1];
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
          {canvasFrames.length > 1 && (
            <Layer opacity={0.1}>
              {canvasFrames[currentFrame - 1].canvasElements.map(elem => {
                // Render each element of the second-to-last frame
                if (elem.type == 'figure') {
                  const figureElem = elem as FigureElement; // case current element to figure element
                  return toKonvaElement(
                    figureElem,
                    canvasFrames[currentFrame - 1].canvasElements,
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
          <Layer>
            {canvasFrames[currentFrame].canvasElements.map(elem => {
              // Render each element of the last frame (current frame)
              if (elem.type == 'figure') {
                const figureElem = elem as FigureElement; // case current element to figure element
                return toKonvaElement(
                  figureElem,
                  canvasFrames[currentFrame].canvasElements,
                  updateFrameElements,
                  currentFrame == frames.length - 1,
                );
              } else if (elem.type == 'simpleShape') {
                // return some other type here
                return {};
              }
            })}
          </Layer>
          <Layer>
            {/* layer displays current frame count */}
            <KonvaText
              offsetX={-10}
              offsetY={-10}
              fontSize={25}
              text={'Current Frame: ' + currentFrame + ' / ' + (frames.length - 1)}
            />
          </Layer>
        </Stage>
      </Box>
    );
  };

  type ControlPanelProps = {
    addNewFrame: () => void;
  };

  // Bottom controll panel for progressing through and viewing animation
  const ControlPanel: React.FC<ControlPanelProps> = ({ addNewFrame: addFrame }) => {
    return (
      <Box display='flex' alignItems='center' justifyContent='center' width={'100%'}>
        <Flex direction={'row'} justifyContent={'space-between'} padding={'10px'} width={'80%'}>
          <Box>
            <Button size='md' height='48px' marginRight='5px'>
              Play
            </Button>
            <Button size='md' height='48px'>
              Pause
            </Button>
          </Box>

          <Box>
            <Button size='md' height='48px' marginRight='5px' onClick={frameBackward}>
              {'<--'}
            </Button>
            <Button size='md' height='48px' onClick={frameForward}>
              {'-->'}
            </Button>
          </Box>

          <Button size='md' height='48px' onClick={addFrame}>
            Add Latest Frame
          </Button>

          <Button size='md' height='48px'>
            Navigate home
          </Button>

          <Button size='md' height='48px'>
            Other Button
          </Button>
        </Flex>
      </Box>
    );
  };

  return (
    <Box backgroundColor={'white'}>
      {/* vertical flex */}
      <Flex direction='column'>
        {/* items in row one */}
        <Flex>
          {/* panel for selecting new characters to drag onto the canvs */}
          <FiguresSelectionPanel />
          <Spacer />

          {/* canvas for creating stop motion scene */}
          <Canvas frames={frames} setFrames={setFrames} />
        </Flex>

        {/* items in row two */}
        <ControlPanel addNewFrame={addNewFrame} />
      </Flex>
    </Box>
  );
}

/**
 * A wrapper component for the TicTacToeArea component.
 * Determines if the player is currently in a tic tac toe area on the map, and if so,
 * renders the TicTacToeArea component in a modal.
 *
 */
export default function StopMotionStudioAreaWrapper(): JSX.Element {
  const stopMotionArea = useInteractable<StopMotionAreaInteractable>('stopMotionArea');
  const townController = useTownController();

  const closeModal = useCallback(() => {
    if (stopMotionArea) {
      townController.interactEnd(stopMotionArea);
      const controller = townController.getStopMotionAreaController(stopMotionArea);
      controller.leaveGame();
    }
  }, [townController, stopMotionArea]);

  if (stopMotionArea) {
    return (
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent height='900px' maxW='1600px'>
          <ModalHeader>Stop Motion Studio</ModalHeader>
          <ModalCloseButton />
          <StopMotionStudioArea interactableID={stopMotionArea.name}></StopMotionStudioArea>
        </ModalContent>
      </Modal>
    );
  }

  return <></>;
}
