import { FigureElement } from './FigureElements';

// Torso is the parent of all other figure elements for the person figure
const personFigureTorso: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 100,
    width: 40,
  },
  id: 'figure_add_torso',
  parent: undefined,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Figure head is a child of the torso
const personFigureHead: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'circle',
    radius: 20,
  },
  id: 'figure_1_head',
  parent: personFigureTorso,
  offset_x: 20,
  offset_y: -20,
  offset_rotation: 0,
  offset_attach_rotation: Math.PI / 2,
  offset_attach_x: 0,
  offset_attach_y: 20,
  dragOverride: false,
};
// Left leg of the person figure is a child of the torso
const personFigureLeftLeg: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_1_left_leg',
  parent: personFigureTorso,
  offset_x: 0,
  offset_y: 90,
  offset_rotation: 0,
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Right leg of the person figure is a child of the torso
const personFigureRightLeg: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_1_right_leg',
  parent: personFigureTorso,
  offset_x: 30,
  offset_y: 90,
  offset_rotation: 0,
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Left arm of the person figure is a child of the torso
const personFigureLeftArm: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_1_left_arm',
  parent: personFigureTorso,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: -(Math.PI / 4),
  offset_attach_rotation: -(Math.PI / 2),
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Right arm of the person figure is a child of the torso
const personFigureRightArm: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_1_right_arm',
  parent: personFigureTorso,
  offset_x: 40,
  offset_y: 10,
  offset_rotation: (3 * Math.PI) / 4,
  offset_attach_rotation: Math.PI / 4,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure torso is the parent of all other animal figure elements
const animalFigureTorso: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 100,
    width: 40,
  },
  id: 'figure_3_torso',
  parent: undefined,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure head is a child of the torso
const animalFigureHead: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'circle',
    radius: 19,
  },
  id: 'figure_3_head',
  parent: animalFigureTorso,
  offset_x: 120,
  offset_y: -40,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: -20,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure leg 1 is a child of the torso
const animalFigureLeg1: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_3_leg_1',
  parent: animalFigureTorso,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure leg 2 is a child of the torso
const animalFigureLeg2: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_3_leg_2',
  parent: animalFigureTorso,
  offset_x: 30,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure leg 3 is a child of the torso
const animalFigureLeg3: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_3_leg_3',
  parent: animalFigureTorso,
  offset_x: 60,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Animal figure leg 4 is a child of the torso
const animalFigureLeg4: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 50,
    width: 10,
  },
  id: 'figure_3_leg_4',
  parent: animalFigureTorso,
  offset_x: 90,
  offset_y: 0,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: (-1 * Math.PI) / 2,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Bird figure torso is the parent of all other bird figure elements
const birdFigureTorso: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'rect',
    length: 40,
    width: 12,
  },
  id: 'figure_4_torso',
  parent: undefined,
  offset_x: 0,
  offset_y: 0,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: 0,
  offset_attach_y: 0,
  dragOverride: false,
};
// Bird figure head is a child of the torso
const birdFigureHead: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'circle',
    radius: 12,
  },
  id: 'figure_4_head',
  parent: birdFigureTorso,
  offset_x: 52,
  offset_y: 0,
  offset_rotation: 0,
  offset_attach_rotation: 0,
  offset_attach_x: -12,
  offset_attach_y: 0,
  dragOverride: false,
};
// Bird figure wing is a child of the torso
const birdFigureWing1: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'tri',
    radius: 20,
  },
  id: 'figure_4_wing_1',
  parent: birdFigureTorso,
  offset_x: 20,
  offset_y: -12,
  offset_rotation: (-1 * Math.PI) / 2,
  offset_attach_rotation: 0,
  offset_attach_x: -12,
  offset_attach_y: 0,
  dragOverride: true,
};
// Bird figure wing is a child of the torso
const birdFigureWing2: FigureElement = {
  type: 'figure',
  appearance: {
    type: 'tri',
    radius: 20,
  },
  id: 'figure_4_wing_2',
  parent: birdFigureTorso,
  offset_x: 20,
  offset_y: 0,
  offset_rotation: Math.PI / 2,
  offset_attach_rotation: 0,
  offset_attach_x: +12,
  offset_attach_y: 0,
  dragOverride: true,
};
// Combine all figure prototypes into one array
export const PERSON_FIGURE_PROTO = [
  personFigureHead,
  personFigureLeftLeg,
  personFigureRightLeg,
  personFigureLeftArm,
  personFigureRightArm,
  personFigureTorso,
];
// Combine all figure prototypes into one array
export const ANIMAL_FIGURE_PROTO = [
  animalFigureHead,
  animalFigureLeg1,
  animalFigureLeg2,
  animalFigureLeg3,
  animalFigureLeg4,
  animalFigureTorso,
];
// Combine all figure prototypes into one array
export const BIRD_FIGURE_PROTO = [
  birdFigureHead,
  birdFigureWing1,
  birdFigureWing2,
  birdFigureTorso,
];
