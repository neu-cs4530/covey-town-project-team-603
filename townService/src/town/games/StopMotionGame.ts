import Game from './Game';
import { GameMove, StopMotionGameState, StopMotionMove, TicTacToeGameState, TicTacToeMove } from '../../types/CoveyTownSocket';
import Player from '../../lib/Player';
import InvalidParametersError, { GAME_FULL_MESSAGE, PLAYER_NOT_IN_GAME_MESSAGE } from '../../lib/InvalidParametersError';

/**
 * A StopMotionGame is a Game that implements stop motion animation software.
 */
export default class StopMotionGame extends Game<StopMotionGameState, StopMotionMove> {
    public constructor() {
        // On init, the animation is empty.
        super({
            animator: undefined,
            animation: {frames: []},
            spectators: []
        });
    }


    public applyMove() {

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