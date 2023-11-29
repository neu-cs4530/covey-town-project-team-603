import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import TownControllerContext from '../../../../contexts/TownControllerContext';
import StopMotionStudioAreaWrapper from './StopMotionStudioArea';
import { mock, mockReset } from 'jest-mock-extended';
import TownController, * as TownControllerHooks from '../../../../classes/TownController';
import React from 'react';
import PhaserGameArea from '../GameArea';

const townController = mock<TownController>();
const mockGameArea = mock<PhaserGameArea>();
mockGameArea.getData.mockReturnValue('StopMotionArea');
jest.spyOn(TownControllerHooks, 'useInteractable').mockReturnValue(mockGameArea);
mockReset(townController);
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
  it('Should render the modal', () => {
    renderStopMotionArea();
    expect(screen.queryByText('Join New Game')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Stop Motion Studio')[0]).toBeInTheDocument();
  });
});
