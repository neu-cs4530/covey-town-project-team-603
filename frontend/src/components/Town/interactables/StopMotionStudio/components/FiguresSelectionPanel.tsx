import { Flex, Button, Box, Input, Text } from '@chakra-ui/react';

type FiguresSelectProps = {
  addPerson: () => void;
  addAnimal: () => void;
};

// the left side panel which allows users to select and drag new items on to the canvas
export const FiguresSelectionPanel: React.FC<FiguresSelectProps> = ({addPerson: addPerson, addAnimal: addAnimal}) => {
    return (
        <Box width={'100%'} backgroundColor={'orange'} padding={10}>
        <Text>Figure Selection Window</Text>
    
        <Button onClick={addPerson}>Add Person</Button>

        <Button onClick={addAnimal}>Add Animal</Button>
        </Box>
    );
};