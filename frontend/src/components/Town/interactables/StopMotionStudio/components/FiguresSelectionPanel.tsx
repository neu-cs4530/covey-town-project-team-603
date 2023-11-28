import { Button, Box, Textarea, VStack } from '@chakra-ui/react';
import React, { useState, ChangeEvent } from 'react';

// parameter types for FigureSelectionPanel
type FiguresSelectProps = {
  addPerson: () => void;
  addAnimal: () => void;
  addBird: () => void;
  addText: (text: string) => void;
  addCircle: () => void;
  addStar: () => void;
  addRect: () => void;
};

// the left side panel which allows users to select and drag new items on to the canvas
export const FiguresSelectionPanel: React.FC<FiguresSelectProps> = ({
  addPerson: addPerson,
  addAnimal: addAnimal,
  addBird: addBird,
  addText: addText,
  addCircle: addCircle,
  addStar: addStar,
  addRect: addRect,
}) => {
  const [text, setText] = useState('');
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value);
  const handleSubmit = () => {
    addText(text);
  };

  return (
    <Box width={'100%'} backgroundColor={'white'} padding={10}>
      <VStack spacing={4}>
        <Button onClick={addPerson}>Add Person</Button>

        <Button onClick={addAnimal}>Add Animal</Button>

        <Button onClick={addBird}>Add Bird</Button>

        <Button onClick={addCircle}>Add Circle</Button>

        <Button onClick={addStar}>Add Star</Button>

        <Button onClick={addRect}>Add Rect</Button>
        <Textarea placeholder='Type here...' value={text} onChange={handleChange} />
        <Button colorScheme='blue' onClick={handleSubmit}>
          Add Text
        </Button>
      </VStack>
    </Box>
  );
};
