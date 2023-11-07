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
import { Stage, Layer, Star, Group, Rect, Circle } from 'react-konva';
import { blue } from '@material-ui/core/colors';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

// const ColoredRect = () => {
//   const [color, setColor] = useState('blue');

//   const handleClick = () => {
//     setColor(Konva.Util.getRandomColor());
//   };

//   return (
//     <Rect x={20} y={20} width={50} height={100} fill={color} shadowBlur={5} onClick={handleClick} />
//   );
// };

function StopMotionStudioArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  // const stopMotionAreaController =
  //   useInteractableAreaController<StopMotionAreaController>(interactableID);
  // const townController = useTownController();

  useEffect(() => {
    console.log('exists');
  }, []);

  // the left side panel which allows users to select and drag new items on to the canvas
  const FiguresSelectionPanel = () => {
    return (
      <Box width={'100%'} backgroundColor={'orange'} padding={10}>
        <Text>Figure Selection Window</Text>
      </Box>
    );
  };

  // the interactable canvas to construct the stop motion scenes
  const Canvas = () => {
    const [stars, setStars] = useState<StarShape[]>([]);

    interface KonvaRect {
      type: "rect";
      length: number;
      width: number;
    }

    interface KonvaCircle {
      type: "circle";
      radius: number;
    }

    // Types of konva shape.
    // Used in FigureElement to provide an appearance.
    type KonvaShape = KonvaCircle | KonvaRect;

    // TODO: Movement is hierarchical.
    // 1. Moving a "parent" node should move all of the children nodes.
    // 2. However, in order to judge how a node should be moved, we need to know which node is the root, i.e., has no parent.

    // The proposal is to use offsets to take care of requirement 1.
    // Then, requirement 2 is satified by tracking the (nullable) parent.
    interface FigureElement {
      appearance: KonvaShape

      id: string;
      parent?: FigureElement;

      // If the parent is not null, these represent the offset from the parent.
      // If the parent is null, these represent the absolute.
      offset_x: number;
      offset_y: number;
      offset_rotation: number;

      isDragging: boolean;
    }

    // Get the absolute position of a FigureElement by summing up the offsets.
    function absolutePosn(elem: FigureElement) {
      let absolute_x = 0;
      let absolute_y = 0;
      let absolute_rotation = 0;

      let iter: FigureElement | undefined = elem;

      // not undefined
      while (iter) {
        absolute_x += iter.offset_x;
        absolute_y += iter.offset_y;
        absolute_rotation += iter.offset_rotation;
        iter = iter.parent;
      }
      let retval = {absolute_x, absolute_y, absolute_rotation};
      console.log(retval)

      return retval;
    }


    function toKonvaElement(elem: FigureElement) {
      let absolutePosnVar = absolutePosn(elem);
      switch(elem.appearance.type) {
        case "rect":
          console.log("Give a rect");
          return (
          <Rect
          key={elem.id}
          id={elem.id}
          x={absolutePosnVar.absolute_x}
          y={absolutePosnVar.absolute_y}
          rotation={absolutePosnVar.absolute_rotation}
          height={elem.appearance.length}
          width={elem.appearance.width}
          fill='#000000'
             />)
        case "circle":
          console.log("Give a circle");
          return (
          <Circle
          key={elem.id}
          id={elem.id}
          x={absolutePosnVar.absolute_x}
          y={absolutePosnVar.absolute_y}
          rotation={absolutePosnVar.absolute_rotation}
          radius={elem.appearance.radius}
          fill='#000000'
             />)
      }
    }

    const Figure1Torso: FigureElement = {
      // a KonvaRect
      appearance: {
        type: "rect",
        length: 50,
        width: 20
      },
      id: "figure_1_torso",
      // This is the root
      parent: undefined,
      // Because this is the root, these are absolute posns
      offset_x: 773,
      offset_y: 521,
      offset_rotation: 0,
      isDragging: false
    };

    const Figure1Head: FigureElement = {
      // a KonvaCircle
      appearance: {
        type: "circle",
        radius: 10
      },
      id: "figure_1_head",
      parent: Figure1Torso,
      offset_x: 10,
      offset_y: -10,
      offset_rotation: 0,
      isDragging: false
    };


    // These are stored as a list, because that's what Konva wants.
    // But the FigureElements implement a tree amongst themselves.
    const [figureElements, setFigureElements] = useState<FigureElement[]>([]);
    const canvasRef = useRef<HTMLDivElement | null>(null);

    const [canvasDim, setCanvasDim] = useState<CanvasDim>({ top: 0, left: 0 });

    const canvasWidth = 1300;
    const canvasHeight = 800;

    // star shape interface
    interface StarShape {
      id: string;
      x: number;
      y: number;
      rotation: number;
      isDragging: boolean;
    }



    interface CanvasDim {
      top: number;
      left: number;
    }

    // To implement animation of figures,
    // 1: Keep every FigureElement in a list here, map as necessary.
    // 2: If the FigureELement is not the root, do a polar motion.
    // 3: In any event, intercept the handleDrag{Start,End}.

    function generateShapes() {
      // ensure that the shapes are auto generated within the bounds of the canvas
      const canvasElement = canvasRef.current;
      const padding = 50;

      function randomNumber(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }


      if (canvasElement) {
        const canvasRect = canvasElement.getBoundingClientRect();
        console.log(canvasRect.left + canvasRect.width / 2);
        console.log(canvasRect.top + canvasRect.height / 2);

        return [...Array(10)].map((_, i) => ({
          id: i.toString(),
          x: canvasRect.left + canvasRect.width / 2,
          y: canvasRect.top + canvasRect.height / 2,
          // x: canvasRect.left,
          // y: canvasRect.top,
          rotation: Math.random() * 180,
          isDragging: false,
        }));
      }

      return [];
    }

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;

      

      setStars(
        stars.map(star => {
          let newX = star.x;
          let newY = star.y;



          console.log(newX);

          if (star.id === dragId) {
            // newX = canvasDim.left;
            // newY = canvasDim.top;
            //newX = Math.max(star.x, canvasDim.left + 20);
            //newY = Math.max(star.y, canvasDim.top + 20);
            newX = e.evt.x;
            newY = e.evt.y;
          }

          console.log(newX);

          return {
            ...star,
            x: newX,
            y: newY,
          };
        }),
      );
    };

    const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;
      setStars(
        stars.map(star => {
          return {
            ...star,
            isDragging: star.id === dragId,
          };
        }),
      );
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;
      setStars(
        stars.map(star => {
          return {
            ...star,
            isDragging: false,
          };
        }),
      );
    };

    const handleDragMoveFigure = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;

      setFigureElements(
        figureElements.map(elem => {
          let newX = elem.offset_x;
          let newY = elem.offset_y;
          let newRot = elem.offset_rotation;

          if (elem.id === dragId) {
            // newX = canvasDim.left;
            // newY = canvasDim.top;
            // newX = Math.max(star.x, canvasDim.left + 20);
            // newY = Math.max(star.x, canvasDim.top + 20);
            if (elem.parent === undefined) {
              //newX = 
            }
          }

          return {
            ...star,
            x: newX,
            y: newY,
          };
        }),
      );
    };

    const handleDragStartFigure = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;
      setStars(
        stars.map(star => {
          return {
            ...star,
            isDragging: star.id === dragId,
          };
        }),
      );
    };

    const handleDragEndFigure = (e: KonvaEventObject<DragEvent>) => {
      const dragId = e.target.attrs.id;
      setFigureElements(
        figureElements.map(elem => {
          return {
            ...elem,
            isDragging: false,
          };
        }),
      );
    };


    useEffect(() => {
      if (canvasRef.current) {
        setCanvasDim({
          top: canvasRef.current.getBoundingClientRect().top,
          left: canvasRef.current.getBoundingClientRect().left,
        });
      }
      setStars(generateShapes());
      setFigureElements([Figure1Head, Figure1Torso]);
    }, []);

    return (
      <Box
        ref={canvasRef}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: 'yellow',
        }}>
        <Stage
          offsetX={canvasDim.left}
          offsetY={canvasDim.top}
          width={canvasWidth}
          height={canvasHeight}>
          <Layer>
            {stars.map(star => (
              <Star
                key={star.id}
                id={star.id}
                x={star.x}
                y={star.y}
                numPoints={20}
                innerRadius={20}
                outerRadius={40}
                fill='#89b717'
                opacity={0.8}
                draggable
                rotation={star.rotation}
                shadowColor='black'
                shadowBlur={0}
                shadowOpacity={0.0}
                shadowOffsetX={star.isDragging ? 10 : 5}
                shadowOffsetY={star.isDragging ? 10 : 5}
                scaleX={star.isDragging ? 1.2 : 1}
                scaleY={star.isDragging ? 1.2 : 1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
              />
            ))}
            {figureElements.map(elem => (
              toKonvaElement(elem)
            ))}
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

          <Button size='md' height='48px'>
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
