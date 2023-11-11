import { CanvasElement } from './CanvasElements';

/**
 * Interface for a savable game Frame
 */
export interface Frame {
  frameID: number;
  canvasElements: CanvasElement[];
  interactable: boolean;
}
