import { CanvasElement } from './CanvasElements';

/**
 * Interface for a savable StopMotionStudio Frame
 * Contains the frame ID and the current list of elements on the Canvas.
 */
export interface Frame {
  frameID: number;
  canvasElements: CanvasElement[];
}
