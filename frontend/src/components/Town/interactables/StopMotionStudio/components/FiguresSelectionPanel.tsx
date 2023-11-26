import { Button, Box, Text, Flex, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';

type FiguresSelectProps = {
  addPerson: () => void;
  addAnimal: () => void;
  addBird: () => void;
  addText: (text: string) => void;
};

// the left side panel which allows users to select and drag new items on to the canvas
export const FiguresSelectionPanel: React.FC<FiguresSelectProps> = ({
  addPerson: addPerson,
  addAnimal: addAnimal,
  addBird: addBird,
  addText: addText
}) => {
    const [text, setText] = useState('');
    const handleChange = (event) => setText(event.target.value);
    const handleSubmit = () => {
    // Here you can handle the submission, e.g., send the data to an API or log it
    console.log('Submitted text:', text);
    addText(text);
  };


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
        <Textarea
        placeholder="Type here..."
        value={text}
        onChange={handleChange}
      />
      <Button colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
      </Flex>
    </Box>
  );
};
