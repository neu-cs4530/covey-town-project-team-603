import {
  Box,
  Button,
  Container,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import TicTacToeAreaController from '../../../../classes/interactable/TicTacToeAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractable, useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameResult, GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import GameAreaInteractable from '../GameArea';
import TicTacToeLeaderboard from '../Leaderboard';
import TicTacToeArea from '../TicTacToe/TicTacToeArea';

function StopMotionStudioArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const gameAreaController = useInteractableAreaController<TicTacToeAreaController>(interactableID);
  const townController = useTownController();

  useEffect(() => {
    console.log('exists');
  }, []);

  return (
    <Container>
      <Button colorScheme='blue'>Button</Button>
    </Container>
  );
}

/**
 * A wrapper component for the TicTacToeArea component.
 * Determines if the player is currently in a tic tac toe area on the map, and if so,
 * renders the TicTacToeArea component in a modal.
 *
 */
export default function StopMotionStudioAreaWrapper(): JSX.Element {
  const gameArea = useInteractable<GameAreaInteractable>('StopMotionStudioArea');
  const townController = useTownController();

  const closeModal = useCallback(() => {
    if (gameArea) {
      townController.interactEnd(gameArea);
      const controller = townController.getGameAreaController(gameArea);
      controller.leaveGame();
    }
  }, [townController, gameArea]);

  return <Button colorScheme='blue'>BUTTTTTTTTONNNNNN</Button>;

  //   if (gameArea && gameArea.getData('type') === 'StopMotionStudio') {
  //     return (
  //       <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false}>
  //         <ModalOverlay />
  //         <ModalContent>
  //           <ModalHeader>{gameArea.name}</ModalHeader>
  //           <ModalCloseButton />
  //           <StopMotionStudioArea interactableID={gameArea.name}></StopMotionStudioArea>
  //         </ModalContent>
  //       </Modal>
  //     );
  //   }
  //   return <></>;
}
