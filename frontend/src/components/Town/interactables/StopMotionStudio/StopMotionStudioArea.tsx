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
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useInteractable, useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { InteractableID } from '../../../../types/CoveyTownSocket';
// import StopMotionArea from '../StopMotionArea';
import StopMotionAreaInteractable from '../StopMotionArea';
import StopMotionAreaController from '../../../../classes/interactable/StopMotionAreaController';
import { Stage, Layer, Star, Group } from 'react-konva';
import { blue } from '@material-ui/core/colors';
import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { toKonvaElement, FigureElement } from './FigureElements';
import { CanvasElement, StarShape } from './CanvasElements';
import { KonvaEventObject } from 'konva/lib/Node';
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

  function addNewFrame() {}

  // the interactable canvas to construct the stop motion scenes
  const Canvas = () => {
    // the canvas should always be displaying two screens
    // 1. past frame which is not interactable
    // 2. current editable frame with full opacity on top

    const canvasRef = useRef<HTMLDivElement | null>(null);

    const canvasWidth = 1300;
    const canvasHeight = 800;

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

    const figure2Head: FigureElement = {
      type: 'figure',
      // a KonvaCircle
      appearance: {
        type: 'circle',
        radius: 10,
      },
      id: 'figure_1_head',
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
      id: 'figure_1_left_leg',
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
      canvasElements: [figure2Head, figure2LeftLeg, figure2Torso],
    };

    // stores the canvas frames
    const [frames, setFrames] = useState<Frame[]>([frame1, frame2]);

    // this use effect currently manually sets one frame for testing
    useEffect(() => {}, []);

    // updater callback for current frame elements
    function updateFrameElements(elems: CanvasElement[]) {
      setFrames(prevFrames => {
        // Make a shallow copy of the previous frames
        const updatedFrames = [...prevFrames];
        // Update the last frame (assuming there is at least one frame)
        const lastFrame = updatedFrames[updatedFrames.length - 1];
        lastFrame.canvasElements = elems;

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
          <Layer opacity={0.1}>
            {frames[frames.length - 2]
              ? frames[frames.length - 2].canvasElements.map(elem => {
                  if (elem.type == 'figure') {
                    const figureElem = elem as FigureElement; // case current element to figure element
                    return toKonvaElement(
                      figureElem,
                      frames[frames.length - 1].canvasElements,
                      updateFrameElements,
                      false,
                    );
                  } else if (elem.type == 'simpleShape') {
                    // return some other type here
                    return {};
                  }
                })
              : undefined}
          </Layer>
          {/* interactable layer (interactable) */}
          <Layer>
            {frames[frames.length - 1].canvasElements.map(elem => {
              if (elem.type == 'figure') {
                const figureElem = elem as FigureElement; // case current element to figure element
                return toKonvaElement(
                  figureElem,
                  frames[frames.length - 1].canvasElements,
                  updateFrameElements,
                  true,
                );
              } else if (elem.type == 'simpleShape') {
                // return some other type here
                return {};
              }
            })}
          </Layer>
        </Stage>
      </Box>
    );
  };

  // Bottom controll panel for progressing through and viewing animation
  const ControlPanel = () => {
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
            <Button size='md' height='48px' marginRight='5px'>
              {'<--'}
            </Button>
            <Button size='md' height='48px'>
              {'-->'}
            </Button>
          </Box>

          <Button size='md' height='48px' onClick={addNewFrame}>
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
          <Canvas />
        </Flex>

        {/* items in row two */}
        <ControlPanel />
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
