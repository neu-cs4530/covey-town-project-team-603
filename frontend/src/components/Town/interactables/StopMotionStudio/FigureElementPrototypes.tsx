import { FigureElement } from './FigureElements';

const personFigureTorso: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'rect',
    length: 50,
    width: 20,
  },
  id: 'figure_add_torso',
  // This is the root
  parent: undefined,
  // Because this is the root, these are absolute posns
  offset_x: 773, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: 521,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const personFigureHead: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'circle',
    radius: 10,
  },
  id: 'figure_1_head',
  parent: personFigureTorso,
  offset_x: 10,
  offset_y: -10,
  offset_rotation: 0,
  offset_attach_rotation: Math.PI / 2,
  offset_attach_x: 0,
  offset_attach_y: 10,
  isDragging: false,
};

const personFigureLeftLeg: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_1_left_leg',
  parent: personFigureTorso,
  offset_x: 0,
  offset_y: 45,
  // for now
  offset_rotation: 0,
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const personFigureRightLeg: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_1_right_leg',
  parent: personFigureTorso,
  offset_x: 15,
  offset_y: 45,
  // for now
  offset_rotation: 0,
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const personFigureLeftArm: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_1_left_arm',
  parent: personFigureTorso,
  offset_x: 0,
  offset_y: 0,
  // for now
  offset_rotation: -(Math.PI / 4),
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const personFigureRightArm: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_1_right_arm',
  parent: personFigureTorso,
  offset_x: 20,
  offset_y: 0,
  // for now
  offset_rotation: Math.PI / 4,
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureTorso: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'rect',
    length: 50,
    width: 20,
  },
  id: 'figure_3_torso',
  // This is the root
  parent: undefined,
  // Because this is the root, these are absolute posns
  offset_x: 773, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: 521,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureHead: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'circle',
    radius: 10,
  },
  id: 'figure_3_head',
  parent: animalFigureTorso,
  offset_x: 60,
  offset_y: -20,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: -10,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureLeg1: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_3_leg_1',
  parent: animalFigureTorso,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureLeg2: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_3_leg_2',
  parent: animalFigureTorso,
  offset_x: 15,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureLeg3: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_3_leg_3',
  parent: animalFigureTorso,
  offset_x: 30,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const animalFigureLeg4: FigureElement = {
  type: 'figure',
  // a KonvaCircle
  appearance: {
    type: 'rect',
    length: 25,
    width: 5,
  },
  id: 'figure_3_leg_4',
  parent: animalFigureTorso,
  offset_x: 45,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const birdFigureTorso: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'rect',
    length: 10,
    width: 3,
  },
  id: 'figure_4_torso',
  // This is the root
  parent: undefined,
  // Because this is the root, these are absolute posns
  offset_x: 773, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: 521,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  isDragging: false,
};

const birdFigureHead: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'circle',
    radius: 3,
  },
  id: 'figure_4_head',
  // This is the root
  parent: birdFigureTorso,
  // Because this is the root, these are absolute posns
  offset_x: 13, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: 0,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: -3,
  offset_attach_y: 0,
  isDragging: false,
};

const birdFigureWing1: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'tri',
    radius: 5,
  },
  id: 'figure_4_wing_1',
  // This is the root
  parent: birdFigureTorso,
  // Because this is the root, these are absolute posns
  offset_x: 5, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: -3,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: 0,
  offset_attach_x: -3,
  offset_attach_y: 0,
  isDragging: false,
  dragOverride: true,
};

const birdFigureWing2: FigureElement = {
  type: 'figure',
  // a KonvaRect
  appearance: {
    type: 'tri',
    radius: 5,
  },
  id: 'figure_4_wing_2',
  // This is the root
  parent: birdFigureTorso,
  // Because this is the root, these are absolute posns
  offset_x: 5, //----------------------------------------------------------> these offset x and y should probably not be hard coded
  offset_y: 0,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: +3,
  offset_attach_y: 0,
  isDragging: false,
  dragOverride: true,
};

export const PERSON_FIGURE_PROTO = [
  personFigureHead,
  personFigureLeftLeg,
  personFigureRightLeg,
  personFigureLeftArm,
  personFigureRightArm,
  personFigureTorso,
];

export const ANIMAL_FIGURE_PROTO = [
  animalFigureHead,
  animalFigureLeg1,
  animalFigureLeg2,
  animalFigureLeg3,
  animalFigureLeg4,
  animalFigureTorso,
];

export const BIRD_FIGURE_PROTO = [
  birdFigureHead,
  birdFigureWing1,
  birdFigureWing2,
  birdFigureTorso,
];
