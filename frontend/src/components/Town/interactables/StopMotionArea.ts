import { InteractableType } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';

/**
 * StopMotionArea class extends the Interactable class to represent a specific interactive area
 * within a game scene, specifically designed for stop motion animation interactions.
 */

export default class StopMotionArea extends Interactable {
  private _isInteracting = false; // Flag to track the interaction state of the stop motion area.

  /**
   * Called when the StopMotionArea is added to the scene.
   * It sets up the visual appearance and text label of the interactable area.
   */

  public occupants = [];

  public game = undefined;

  public name = 'Stop Motion Studio';

  public player = 'foobar';

  public type = 'StopMotionArea' as InteractableType;

  addedToScene() {
    super.addedToScene(); // Call the parent class's addedToScene method.
    this.setTintFill(); // Set tint color for the interactable area.
    this.setAlpha(0.3); // Set the alpha (transparency) to make it slightly see-through.
    this.setDepth(-1); // Set the rendering depth to ensure it appears behind other objects.

    // Add a text label at the interactable area's position.
    this.scene.add.text(
      this.x - this.displayWidth / 2, // Horizontal position of the text.
      this.y + this.displayHeight / 2, // Vertical position of the text.
      this.name, // The name of the interactable area.
      { color: '#FFFFFF', backgroundColor: '#000000' }, // Text styling with white color and black background.
    );
  }

  /**
   * Called when a player exits the overlap with the interactable area.
   * If the player was interacting with the area, it emits an event to end the interaction.
   */

  overlapExit(): void {
    if (this._isInteracting) {
      this.townController.interactableEmitter.emit('endInteraction', this);
      this._isInteracting = false;
    }
  }

  /**
   * Called when a player interacts with the area.
   * Sets the interaction flag to true.
   */

  interact(): void {
    this._isInteracting = true;
  }

  /**
   * Returns the type of this interactable.
   * @return {KnownInteractableTypes} The specific type of this interactable.
   */

  getType(): KnownInteractableTypes {
    return 'stopMotionArea';
  }
}
