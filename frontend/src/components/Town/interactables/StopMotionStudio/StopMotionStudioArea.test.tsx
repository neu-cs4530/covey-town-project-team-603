import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ChakraProvider } from "@chakra-ui/react";
import TownControllerContext from '../../../../contexts/TownControllerContext';
import StopMotionStudioAreaWrapper from "./StopMotionStudioArea";
import { mock, mockReset } from 'jest-mock-extended';
import TownController, * as TownControllerHooks from '../../../../classes/TownController';
import React from 'react';

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
  describe('Dummy test', () => {
    it('Foobar', () => {
      expect(1).toEqual(1);
    })
  })
  describe('Rendering the StopMotionStudioArea', () => {
    it('Should render the modal, with a tutorial', () => {
      renderStopMotionArea();
      // Test
      expect(screen.queryByText('Join New Game')).not.toBeInTheDocument();
      expect(screen.queryByText('Stop')).toBeInTheDocument();
    })
  })