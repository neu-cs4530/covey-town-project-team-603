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
import React, { useCallback, useEffect, useState } from 'react';
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

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

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
    const [stars, setStars] = React.useState(generateShapes());

    const canvasWidth = 1300;
    const canvasHeight = 800;

    // To implement animation of figures,
    // 1: Keep every FigureElement in a list here, map as necessary.
    // 2: If the FigureELement is not the root, do a polar motion.
    // 3: In any event, intercept the handleDrag{Start,End}.

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

    return (
      <Box
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
                numPoints={5}
                innerRadius={20}
                outerRadius={40}
                fill='#89b717'
                opacity={0.8}
                draggable
                rotation={star.rotation}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.6}
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
      <Box width={'100%'} backgroundColor={'green'} padding={10}>
        <Text>Controll Panel</Text>
      </Box>
    );
  };

  return (
    <Box>
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
