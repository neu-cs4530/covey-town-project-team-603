import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useInteractable } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import StopMotionAreaInteractable from '../StopMotionArea';
import { StopMotionEditor } from './StopMotionEditor';

function StopMotionStudioArea(): JSX.Element {
  type Screen = 'home' | 'studio' | 'view screen';
  const [screen, setScreen] = useState<Screen>('home');

  const goBackHome = () => {
    setScreen('home');
  };

  if (screen == 'home') {
    return (
      <Box backgroundColor={'white'} height={'900'}>
        <VStack>
          <Box
            paddingY={10}
            paddingX={20}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text fontSize={30}>Stop Motion Studio</Text>
          </Box>
          <Button onClick={() => setScreen('studio')}>Go to editor</Button>
          <Box
            paddingY={20}
            paddingX={20}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}>
            <div style={{ marginTop: '30px' }}>
              <Text fontSize={20}>
                {' '}
                - Use the panel on the left to add new shapes to the canvas.{' '}
              </Text>
              <Text fontSize={20}>
                {' '}
                - Add a new frame by using the &apos;Add Latest Frame&apos; button{' '}
              </Text>
              <Text fontSize={20}>
                {' '}
                - Traverse through added frames by using the arrow buttons{' '}
              </Text>
              <Text fontSize={20}> - Use the play button to play animations. </Text>
              <Text fontSize={20}>
                {' '}
                - Loading an exisitng project into the canvas using &apos;Load Project&apos;{' '}
              </Text>
              <Text fontSize={20}>
                {' '}
                - Use &apos;Save Project&apos; to continue working in future sessions.{' '}
              </Text>
              <Text fontSize={20}>
                {' '}
                - Download your animation as a GIF using the &apos;Export Movie&apos; button{' '}
              </Text>
            </div>
          </Box>
        </VStack>
      </Box>
    );
  } else if (screen == 'studio') {
    return <StopMotionEditor backHome={goBackHome} />;
  } else return <></>;
}

/**
 * A wrapper component for the TicTacToeArea component.
 * Determines if the player is currently in a tic tac toe area on the map, and if so,
 * renders the TicTacToeArea component in a modal.
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
          <StopMotionStudioArea />
        </ModalContent>
      </Modal>
    );
  }

  return <></>;
}
