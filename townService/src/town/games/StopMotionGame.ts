import Game from './Game';
import { GameMove, StopMotionGameMove, StopMotionGameState, TicTacToeGameState, TicTacToeMove } from '../../types/CoveyTownSocket';
import Player from '../../lib/Player';
import InvalidParametersError, { GAME_FULL_MESSAGE, MOVE_NOT_YOUR_TURN_MESSAGE, PLAYER_NOT_IN_GAME_MESSAGE } from '../../lib/InvalidParametersError';

/**
 * A StopMotionGame is a Game that implements stop motion animation software.
 */
export default class StopMotionGame extends Game<StopMotionGameState, StopMotionGameMove> {
    public constructor() {
        // On init, the animation is empty.
        super({
            animator: undefined,
            animation: {frames: []},
            spectators: []
        });
    }

    public applyMove(move: GameMove<StopMotionGameMove>) {
        if (move.playerID !== this.state.animator) {
            throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
        } else {
            if (move.move.frame_index >= 0 && move.move.frame_index < this.state.animation.frames.length) {
                this.state.animation.frames[move.move.frame_index] = move.move.frame_update;
            } else {
                // TODO: The question becomes, how to add a new frame.
                // We could try to encode that in the frame_index as a sentinel value, or we could
                // use an enumerate.
                // Meaningful data would mean enumeration probably.
            }
        }
    }

    /**
     * Join as the animator, if available.
     * 
     * @param Player The player to join as the animator
     * @throws InvalidParametersError if there is already an animator (GAME_FULL_MESSAGE)
     */
    protected _join(player: Player): void {
        if (this.state.animator !== undefined) {
            throw new InvalidParametersError(GAME_FULL_MESSAGE);
        } else {
            this.state.animator = player.id;
        }
    }

    /**
     * Leave as the animator.
     * 
     * @param Player The player to remove as the animator
     * @throws InvalidParametersError if the player is not in the game
     */
    protected _leave(player: Player): void {
        if (this.state.animator !== player.id) {
            throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
        } else {
            this.state.animator = undefined;
        }
    }
}