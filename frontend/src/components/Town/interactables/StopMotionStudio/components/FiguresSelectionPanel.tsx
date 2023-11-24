import { Button, Box, Text } from '@chakra-ui/react';
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
      <Text>Figure Selection Window</Text>

      <Button onClick={addPerson}>Add Person</Button>

      <Button onClick={addAnimal}>Add Animal</Button>

      <Button onClick={addBird}>Add Bird</Button>
    </Box>
  );
};
