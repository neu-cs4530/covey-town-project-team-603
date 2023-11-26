import { Button, Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

type FiguresSelectProps = {
  addPerson: () => void;
  addAnimal: () => void;
  addBird: () => void;
};

// the left side panel which allows users to select and drag new items on to the canvas
export const FiguresSelectionPanel: React.FC<FiguresSelectProps> = ({
  addPerson: addPerson,
  addAnimal: addAnimal,
  addBird: addBird,
}) => {
  return (
    <Box width={'100%'} backgroundColor={'orange'} padding={10}>
      <Flex direction={'column'} justifyContent={'space-between'} padding={'10px'} height={'80%'}>
        <Text>Figure Selection Window</Text>

        <Box>
          <Button size='md' height='48px' onClick={addPerson}>
            Add Person
          </Button>
        </Box>

        <Box>
          <Button size='md' height='48px' onClick={addAnimal}>
            Add Animal
          </Button>
        </Box>
        <Box>
          <Button size='md' height='48px' onClick={addBird}>
            Add Bird
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
