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

/**
 * Represents the main area of the Stop Motion Studio application.
 * It allows users to navigate between different screens including the home screen and the editor.
 * The home screen provides instructions and options to enter the editor.
 * The editor screen is where users can create and edit stop motion animations.
 */

function StopMotionStudioArea(): JSX.Element {
  // Screen types available in the Stop Motion Studio
  type Screen = 'home' | 'studio' | 'view screen';
  // State to manage the current screen
  const [screen, setScreen] = useState<Screen>('home');

  // Function to navigate back to the home screen
  const goBackHome = () => {
    setScreen('home');
  };
  // Render logic based on the current screen
  if (screen == 'home') {
    // Home screen layout with instructions and navigation button
    return (
      <Box backgroundColor={'white'} height={'900'}>
        <VStack>
          {/* Header text */}
          <Box
            paddingY={10}
            paddingX={20}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text fontSize={30}>Stop Motion Studio</Text>
          </Box>
          {/* Button to navigate to the editor */}
          <Button onClick={() => setScreen('studio')}>Go to editor</Button>
          {/* Instructional text for users */}
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
                - Load an existing project into the canvas using &apos;Load Project&apos;{' '}
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
    // Editor screen where stop motion animation is created
    return <StopMotionEditor backHome={goBackHome} />;
  } else return <></>;
}

/**
 * A wrapper component for the StopMotionStudioArea component.
 * Determines if the player is currently in a StopMotionAnimatorArea on the map, and if so,
 * renders the StopMotionStudioArea component in a modal.
 */
export default function StopMotionStudioAreaWrapper(): JSX.Element {
  const stopMotionArea = useInteractable<StopMotionAreaInteractable>('stopMotionArea');
  const townController = useTownController();

  const closeModal = useCallback(() => {
    townController.unPause();
    if (stopMotionArea) {
      townController.interactEnd(stopMotionArea);
      // const controller = townController.getStopMotionAreaController(stopMotionArea);
      // controller.leaveGame();
    }
  }, [townController, stopMotionArea]);

  if (stopMotionArea) {
    townController.pause();
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
