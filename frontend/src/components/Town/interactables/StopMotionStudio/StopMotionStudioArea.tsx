import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Flex,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Text as KonvaText } from 'react-konva';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useInteractable } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { InteractableID } from '../../../../types/CoveyTownSocket';
// import StopMotionArea from '../StopMotionArea';
import StopMotionAreaInteractable from '../StopMotionArea';
//import StopMotionAreaController from '../../../../classes/interactable/StopMotionAreaController';
import { Stage, Layer } from 'react-konva';
//import { blue } from '@material-ui/core/colors';
//import Konva from 'konva';
//import { Vector2d } from 'konva/lib/types';
import { toKonvaElement, FigureElement } from './FigureElements';
import { CanvasElement } from './CanvasElements';
//import { KonvaEventObject } from 'konva/lib/Node';
import { Frame } from './Frame';
import { StopMotionEditor } from './StopMotionEditor';

function StopMotionStudioArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  type Screen = 'home' | 'studio' | 'view screen';
  const [screen, setScreen] = useState<Screen>('home');

  const goBackHome = () => {
    setScreen('home');
  };

  if (screen == 'home') {
    return (
      <Box backgroundColor={'blue'} height={'900'}>
        <VStack>
          <Box
            paddingY={20}
            paddingX={20}
            backgroundColor={'green'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text fontSize={30}>Stop motion studio</Text>
          </Box>
          <Button onClick={() => setScreen('studio')}>Go to editor</Button>
        </VStack>
      </Box>
    );
  } else if (screen == 'studio') {
    return <StopMotionEditor backHome={goBackHome} />;
  }
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
        <ModalContent height='900px' maxW='1600px' maxH='900px'>
          <ModalHeader>Stop Motion Studio</ModalHeader>
          <ModalCloseButton />
          <StopMotionStudioArea interactableID={stopMotionArea.name}></StopMotionStudioArea>
        </ModalContent>
      </Modal>
    );
  }

  return <></>;
}
