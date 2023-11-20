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
  Input,
} from '@chakra-ui/react';
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

  const [frames, setFrames] = useState<Frame[]>([frame1, frame2]);

  function addNewFrame() {
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


      console.log(newFrame)

      //const newFrameList = [...prevFrames, newFrame];

      return [...prevFrames, newFrame]; //add new frame
    });
  }

  /**
   * Turns the state into JSON, and downloads it.
   */
  function saveAnimState() {
    let stranim = JSON.stringify(frames);
    let mimetype = "application/json";
    let blob = new Blob([stranim], {type: mimetype});
    let bloburl = URL.createObjectURL(blob);


    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = bloburl;

    a.download = "animation.json"
    a.click();

    URL.revokeObjectURL(bloburl);


    document.body.removeChild(a);

  }

  /**
   * 
   */
  function saveAnimState() {
    let stranim = JSON.stringify(frames);
    let mimetype = "application/json";
    let blob = new Blob([stranim], {type: mimetype});
    let bloburl = URL.createObjectURL(blob);


    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = bloburl;

    a.download = "animation.json"
    a.click();

    URL.revokeObjectURL(bloburl);


    document.body.removeChild(a);

  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        console.log('setting frames!');
        setFrames((prevFrames: Frame[]) => {
          return JSON.parse(content);
        });
      }
      reader.readAsText(file);
    }
  }



  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  }

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
        const updatedFrames = frames.slice(0,-1);
        //console.log(updatedFrames);
        // Update the last frame (assuming there is at least one frame)
        const lastFrame = frames[frames.length - 1];
        lastFrame.canvasElements = elems;
        updatedFrames.push(lastFrame)
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
              {canvasFrames[canvasFrames.length - 2].canvasElements.map(elem => {
                // Render each element of the second-to-last frame
                if (elem.type == 'figure') {
                  const figureElem = elem as FigureElement; // case current element to figure element
                  return toKonvaElement(
                    figureElem,
                    canvasFrames[canvasFrames.length - 2].canvasElements,
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
            {canvasFrames[canvasFrames.length - 1].canvasElements.map(elem => {
              // Render each element of the last frame (current frame)
              if (elem.type == 'figure') {
                const figureElem = elem as FigureElement; // case current element to figure element
                return toKonvaElement(
                  figureElem,
                  canvasFrames[canvasFrames.length - 1].canvasElements,
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

  type ControlPanelProps = {
    addNewFrame: () => void;
    saveAnimState: () => void;
    loadAnimState: () => void;
    fileInput: () => void;
    handleChange: (event) => void;
  };

  // Bottom controll panel for progressing through and viewing animation
  const ControlPanel: React.FC<ControlPanelProps> = ({ addNewFrame: addFrame, saveAnimState: saveState, fileInput: triggerFileInput, handleChange: handleFileChange }) => {

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

          <Button size='md' height='48px' onClick={addFrame}>
            Add Latest Frame
          </Button>

          <Button size='md' height='48px'>
            Navigate home
          </Button>

          <Button size='md' height='48px' onClick={saveState}>
            Save project 
          </Button>

          <Input type='file' style={{ display: 'none' }} onChange={handleFileChange} id='fileInput'/>

          <Button size='md' height='48px' onClick={triggerFileInput}>
            Load project 
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
        <ControlPanel addNewFrame={addNewFrame} saveAnimState={saveAnimState} handleChange={handleFileChange} fileInput={triggerFileInput}/>
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
