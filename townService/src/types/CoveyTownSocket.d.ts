/*
To avoid ripping-off the bandaid and switching to a proper multi-module workspace setup
we are sharing type definitions only, using tsconfig.json "references" to the shared project.
We still want to prevent relative package imports otherwise using ESLint, because importing anything
besides type declarations could become problematic from a compilation perspective.
*/

import { BroadcastOperator, Socket } from 'socket.io';
/* eslint-disable import/no-relative-packages */
import { ClientToServerEvents, ServerToClientEvents } from '../../../shared/types/CoveyTownSocket';
/* eslint-disable import/no-relative-packages */
export * from '../../../shared/types/CoveyTownSocket';

export type SocketData = Record<string, never>;
export type CoveyTownSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type TownEmitter = BroadcastOperator<ServerToClientEvents, SocketData>;
export type TownEmitterFactory = (townID: string) => TownEmitter;

export interface StopMotionGameState {
    // Who is working the animation software?
    // The software is not co-op, so there is a unique animator.
    // That would require us to resolve race conditions etc.
    animator?: PlayerID;

    // The animation currently loaded, worked on by the animator.
    animation: Animation;

    // Who is viewing the created animations?
    // Multiple readers of data does not produce a race condition, so 
    // there can be many spectators.
    spectators: PlayerID[]
}

export interface Animation {

    // The list of frames of the animation.
    frames: Frame[]
}

export interface Frame {
    // TODO: background_image

    // The list of figures of the animation.
    figures: FigureElement[]
}

/**
 * Represents an individual limb on a figure.
 * These are trees, so one root FigureElement is the representative of 
 * an entire figure.
 */
export interface FigureElement {

    // Is this a root?
    // A typical root for a stick figure is the torso.
    isRoot: boolean

    // TODO: We need to store information about
    // the actual visual representation of this limb.
    // One way to do it is to bake it into this FigureElement.
    // The next question is, what representation should be used?
    // In any case, that representation needs to connect to x, y, and rotation_degrees
    // To be rendered correctly on the animation canvas.

    // The x position on the canvas in pixels
    x: number

    // The y position on the canvas in pixels
    y: number

    // The rotation of the figure element in degrees.
    rotation_degrees: number
    children: FigureElement[]
}

/**
 * It would be complex to have the backend parse the actual raw clicks given to the frontend.
 * As such, a StopMotionMove consists of an update to the animation state.
 */
export interface StopMotionMove {
  // What frame was updated?
  frame_index: int

  // We do not use a delta-based encoding yet, since that's more complex.
  // Just send over the whole new frame to apply.
  frame_update: Frame
}