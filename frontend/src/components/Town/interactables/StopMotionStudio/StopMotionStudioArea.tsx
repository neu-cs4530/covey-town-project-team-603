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
import { Stage, Layer, Star } from 'react-konva';

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
    const canvasRef = useRef<HTMLDivElement | null>(null);

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

        return [...Array(10)].map((_, i) => ({
          id: i.toString(),
          // x: randomNumber(canvasRect.left + padding, canvasRect.right - padding),
          // y: randomNumber(canvasRect.top + padding, canvasRect.bottom - padding),
          // x: canvasRect.left + Math.random() * canvasRect.width,
          // y: canvasRect.top + Math.random() * canvasRect.height,
          x: canvasRect.left,
          y: canvasRect.top,
          rotation: Math.random() * 180,
          isDragging: false,
        }));
      }

      return [];
    }

    const handleDragStart = (e: any) => {
      const id = e.target.id();
      setStars(
        stars.map(star => {
          return {
            ...star,
            isDragging: star.id === id,
          };
        }),
      );
    };

    const handleDragEnd = (e: any) => {
      const id = e.target.id();
      setStars(
        stars.map(star => {
          return {
            ...star,
            isDragging: false,
          };
        }),
      );
    };

    useEffect(() => {
      setStars(generateShapes());
    }, []);

    return (
      <Box
        ref={canvasRef}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: 'yellow',
        }}>
        <Stage width={window.innerWidth} height={window.innerHeight}>
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
              />
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
