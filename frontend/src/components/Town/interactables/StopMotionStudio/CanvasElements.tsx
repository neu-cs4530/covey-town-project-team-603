// this file should store all the basic shapes that require interactions i.e. non person figure shapes

// types of canvas elements
export type CanvasElementType = 'figure' | 'simpleShape';

// parent interface for all canvas element types
export interface CanvasElement {
  type: CanvasElementType;
}

// star shape interface
export interface StarShape extends CanvasElement {
  type: 'simpleShape';
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}
