import _ from 'lodash';
import { GameInstanceID, InteractableID, StopMotionArea } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import InteractableAreaController, { BaseInteractableEventMap } from './InteractableAreaController';

export type StopMotionStudioEventTypes = BaseInteractableEventMap & {
  // add more here
  frameAdded: () => void;
  playersChange: (newPlayers: PlayerController[]) => void;
};

/**
 * This class is the base class for all game controllers. It is responsible for managing the
 * state of the game, and for sending commands to the server to update the state of the game.
 * It is also responsible for notifying the UI when the state of the game changes, by emitting events.
 */
export default abstract class StopMotionAreaController extends InteractableAreaController<
  StopMotionStudioEventTypes,
  StopMotionArea
> {
  protected _instanceID?: GameInstanceID;

  protected _townController: TownController;

  protected _model: StopMotionArea;

  protected _player: PlayerController;

  constructor(id: InteractableID, stopMotionArea: StopMotionArea, townController: TownController) {
    super(id);
    this._model = stopMotionArea;
    this._townController = townController;

    this._player = this._townController.getPlayer(stopMotionArea.player);
  }

  protected _updateFrom(newModel: StopMotionArea): void {
    console.log('placeholder');
  }

  toInteractableAreaModel(): StopMotionArea {
    return this._model;
  }

  /**
   * Sends a request to the server to leave the current game in the game area.
   */
  public async leaveGame() {
    const instanceID = this._instanceID;
    // finish this
  }
}
