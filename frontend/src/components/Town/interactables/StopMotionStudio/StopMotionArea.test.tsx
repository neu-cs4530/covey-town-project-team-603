import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ChakraProvider } from "@chakra-ui/react";
import TownControllerContext from '../../../../contexts/TownControllerContext';
import StopMotionStudioAreaWrapper from "./StopMotionStudioArea";
import { mock, mockReset } from 'jest-mock-extended';
import TownController, * as TownControllerHooks from '../../../../classes/TownController';

  const townController = mock<TownController>();

  function renderStopMotionArea() {
    return render(
      <ChakraProvider>
        <TownControllerContext.Provider value={townController}>
          <StopMotionStudioAreaWrapper />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );
  }
  describe('Rendering the StopMotionStudioArea', () => {
    it('Should render the modal, with a tutorial', () => {
      renderStopMotionArea();
      // Test
      expect(screen.queryByText('Join New Game')).not.toBeInTheDocument();
      expect(screen.queryByText('Stop')).toBeInTheDocument();
    })
  })


/*
describe('[T2.4] Rendering the current observers', () => {
    beforeEach(() => {
      gameAreaController.mockObservers = [
        new PlayerController('player 1', 'player 1', randomLocation()),
        new PlayerController('player 2', 'player 2', randomLocation()),
        new PlayerController('player 3', 'player 3', randomLocation()),
      ];
      gameAreaController.mockStatus = 'IN_PROGRESS';
      gameAreaController.mockIsPlayer = false;
      gameAreaController.mockX = new PlayerController('player X', 'player X', randomLocation());
      gameAreaController.mockO = new PlayerController('player O', 'player O', randomLocation());
    });
    it('Displays the correct observers when the component is mounted', () => {
      renderTicTacToeArea();
      const observerList = screen.getByLabelText('list of observers in the game');
      const observerItems = observerList.querySelectorAll('li');
      expect(observerItems).toHaveLength(gameAreaController.mockObservers.length);
      for (let i = 0; i < observerItems.length; i++) {
        expect(observerItems[i]).toHaveTextContent(gameAreaController.mockObservers[i].userName);
      }
    });
*/