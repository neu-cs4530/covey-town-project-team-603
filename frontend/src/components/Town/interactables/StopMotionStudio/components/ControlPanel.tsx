import React, { useEffect, useState, useRef } from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';

type ControlPanelProps = {
  addNewFrame: () => void;
  saveAnimState: () => void;
  loadAnimState: () => void;
  fileInput: () => void;
  handleChange: (event: any) => void;
  backHome: () => void;
  frameForward: () => void;
  frameBackward: () => void;
  playback: () => void;
};

// Bottom controll panel for progressing through and viewing animation
export const ControlPanel: React.FC<ControlPanelProps> = ({
  addNewFrame: addFrame,
  saveAnimState: saveAnim,
  loadAnimState: loadState,
  fileInput: fileInp,
  handleChange: handleChange,
  backHome: home,
  frameForward: frameForward,
  frameBackward: frameBackward,
  playback: playback,
}) => {
  return (
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

        <Button size='md' height='48px' onClick={home}>
          Navigate home
        </Button>

        <Button size='md' height='48px'>
          Other Button
        </Button>
      </Flex>
    </Box>
  );
};