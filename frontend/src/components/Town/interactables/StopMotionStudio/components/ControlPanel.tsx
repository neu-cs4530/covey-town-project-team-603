import React, { ChangeEvent } from 'react';
import { Flex, Button, Box, Input } from '@chakra-ui/react';

/**
 * The Control Panel for the Stop Motion Studio represents the bar at the bottom of the screen
 * which contains controls for creating an animation out of the figures on the Canvas.
 * The actions included in the Control Panel buttons are:
 * - playing back the current animation locally
 * - going forwards and backwards in the frame list
 * - adding a new frame with the currently displayed Canvas
 * - loading a project file to the Animator to continue a previous session
 * - saving a project to a file to be worked on again later
 * - exporting a finished animation to a gif format for sharing
 * - navigating back to the home screen of the Animator
 */

// Type definition for props passed to ControlPanel component.
// These functions enable the ControlPanel to manage the animation state and UI.

type ControlPanelProps = {
  addNewFrame: () => void; // Function to add a new frame to the animation.
  saveAnimState: () => void; // Function to save the current state of the animation.
  fileInput: () => void; // Function to handle file input actions.
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void; // Function to handle changes in the file input.
  backHome: () => void; // Function to navigate back to the home screen.
  frameForward: () => void; // Function to move forward in the frame list.
  frameBackward: () => void; // Function to move backward in the frame list.
  playback: () => void; // Function to play back the animation.
  exportMovie: () => void; // Function to export the animation as a movie.
  reset: () => void; // Function to reset the frames and cleare out the existing animation
};

// Bottom control panel for progressing through and viewing animation
// ControlPanel component: provides UI for controlling the animation creation and playback.

export const ControlPanel: React.FC<ControlPanelProps> = ({
  addNewFrame: addFrame,
  saveAnimState: saveAnim,
  fileInput: fileInp,
  handleChange: handleChange,
  backHome: home,
  frameForward: frameForward,
  frameBackward: frameBackward,
  playback: playback,
  exportMovie: exportMovie,
  reset: reset,
}) => {
  return (
    // Main container for the control panel
    <Box display='flex' alignItems='center' justifyContent='center' width={'100%'}>
      <Flex direction={'row'} justifyContent={'space-between'} padding={'10px'} width={'80%'}>
        <Box>
          <Button size='md' height='48px' marginRight='5px' onClick={playback}>
            Play
          </Button>
        </Box>
        <Box>
          <Button size='md' height='48px' marginRight='5px' onClick={frameBackward}>
            {'<--'}
          </Button>
          <Button size='md' height='48px' onClick={frameForward}>
            {'-->'}
          </Button>
        </Box>

        <Button size='md' height='48px' onClick={addFrame}>
          Add Latest Frame
        </Button>

        <Button size='md' height='48px' onClick={reset}>
          Delete + Reset Animation
        </Button>

        <Button size='md' height='48px' onClick={home}>
          Navigate home
        </Button>

        <Button size='md' height='48px' onClick={saveAnim}>
          Save project
        </Button>

        <Input type='file' style={{ display: 'none' }} onChange={handleChange} id='fileInput' />

        <Button size='md' height='48px' onClick={fileInp}>
          Load project
        </Button>

        <Button size='md' height='48px' onClick={exportMovie}>
          Export Movie
        </Button>
      </Flex>
    </Box>
  );
};
