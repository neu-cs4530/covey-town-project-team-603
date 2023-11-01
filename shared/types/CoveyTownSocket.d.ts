export type TownJoinResponse = {
  /** Unique ID that represents this player * */
  userID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  sessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: Player[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Current state of interactables in this town */
  interactables: TypedInteractable[];
}

export type InteractableType = 'ConversationArea' | 'ViewingArea' | 'TicTacToeArea' | 'StopMotionArea';
export interface Interactable {
  type: InteractableType;
  id: InteractableID;
  occupants: PlayerID[];
}


export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export type Direction = 'front' | 'back' | 'left' | 'right';

export type PlayerID = string;
export interface Player {
  id: PlayerID;
  userName: string;
  location: PlayerLocation;
};

export type XY = { x: number, y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
};
export type ChatMessage = {
  author: string;
  sid: string;
  body: string;
  dateCreated: Date;
};

export interface ConversationArea extends Interactable {
  topic?: string;
};
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ViewingArea extends Interactable {
  video?: string;
  isPlaying: boolean;
  elapsedTimeSec: number;
}

export type GameStatus = 'IN_PROGRESS' | 'WAITING_TO_START' | 'OVER';
/**
 * Base type for the state of a game
 */
export interface GameState {
  status: GameStatus;
} 

/**
 * Type for the state of a game that can be won
 */
export interface WinnableGameState extends GameState {
  winner?: PlayerID;
}
/**
 * Base type for a move in a game. Implementers should also extend MoveType
 * @see MoveType
 */
export interface GameMove<MoveType> {
  playerID: PlayerID;
  gameID: GameInstanceID;
  move: MoveType;
}

export type TicTacToeGridPosition = 0 | 1 | 2;

/**
 * Type for a move in TicTacToe
 */
export interface TicTacToeMove {
  gamePiece: 'X' | 'O';
  row: TicTacToeGridPosition;
  col: TicTacToeGridPosition;
}

/**
 * Type for the state of a TicTacToe game
 * The state of the game is represented as a list of moves, and the playerIDs of the players (x and o)
 * The first player to join the game is x, the second is o
 */
export interface TicTacToeGameState extends WinnableGameState {
  moves: ReadonlyArray<TicTacToeMove>;
  x?: PlayerID;
  o?: PlayerID;
}

export type InteractableID = string;
export type GameInstanceID = string;

/**
 * Type for the result of a game
 */
export interface GameResult {
  gameID: GameInstanceID;
  scores: { [playerName: string]: number };
}

/**
 * Base type for an *instance* of a game. An instance of a game
 * consists of the present state of the game (which can change over time),
 * the players in the game, and the result of the game
 * @see GameState
 */
export interface GameInstance<T extends GameState> {
  state: T;
  id: GameInstanceID;
  players: PlayerID[];
  result?: GameResult;
}

/**
 * Base type for an area that can host a game
 * @see GameInstance
 */
export interface GameArea<T extends GameState> extends Interactable {
  game: GameInstance<T> | undefined;
  history: GameResult[];
}

/**
 * Base type for an area that can host a game
 * @see GameInstance
 */
export interface StopMotionArea extends Interactable {
  game: GameInstance<T> | undefined;
  player: PlayerID;
  // history: GameResult[];
  // update this
}

export type CommandID = string;

/**
 * Base type for a command that can be sent to an interactable.
 * This type is used only by the client/server interface, which decorates
 * an @see InteractableCommand with a commandID and interactableID
 */
interface InteractableCommandBase {
  /**
   * A unique ID for this command. This ID is used to match a command against a response
   */
  commandID: CommandID;
  /**
   * The ID of the interactable that this command is being sent to
   */
  interactableID: InteractableID;
  /**
   * The type of this command
   */
  type: string;
}

export type InteractableCommand =  ViewingAreaUpdateCommand | JoinGameCommand | GameMoveCommand<MoveType> | LeaveGameCommand;
export interface ViewingAreaUpdateCommand  { // changed GameMoveCommand<StopMotionGameMove> to GameMoveCommand<MoveType>
  type: 'ViewingAreaUpdate';
  update: ViewingArea;
}
export interface JoinGameCommand {
  type: 'JoinGame';
}
export interface LeaveGameCommand {
  type: 'LeaveGame';
  gameID: GameInstanceID;
}
export interface GameMoveCommand<MoveType> {
  type: 'GameMove';
  gameID: GameInstanceID;
  move: MoveType;
}
export type InteractableCommandReturnType<CommandType extends InteractableCommand> = 
  CommandType extends JoinGameCommand ? { gameID: string}:
  CommandType extends ViewingAreaUpdateCommand ? undefined :
  // CommandType extends GameMoveCommand<TicTacToeMove> ? undefined :
  CommandType extends GameMoveCommand<StopMotionGameMove> ? undefined :
  CommandType extends LeaveGameCommand ? undefined :
  never;

export type InteractableCommandResponse<MessageType> = {
  commandID: CommandID;
  interactableID: InteractableID;
  error?: string;
  payload?: InteractableCommandResponseMap[MessageType];
}

export interface ServerToClientEvents {
  playerMoved: (movedPlayer: Player) => void;
  playerDisconnect: (disconnectedPlayer: Player) => void;
  playerJoined: (newPlayer: Player) => void;
  initialize: (initialData: TownJoinResponse) => void;
  townSettingsUpdated: (update: TownSettingsUpdate) => void;
  townClosing: () => void;
  chatMessage: (message: ChatMessage) => void;
  interactableUpdate: (interactable: Interactable) => void;
  commandResponse: (response: InteractableCommandResponse) => void;
}

export interface ClientToServerEvents {
  chatMessage: (message: ChatMessage) => void;
  playerMovement: (movementData: PlayerLocation) => void;
  interactableUpdate: (update: Interactable) => void;
  interactableCommand: (command: InteractableCommand & InteractableCommandBase) => void;
}

export type StopMotionStudioStatus = 'UPDATE_FRAME' | 'CREATE_FRAME' | 'DELETE_FRAME';

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
    spectators: PlayerID[],

    // Satisfy interface
    status: StopMotionStudioStatus
}

// export interface StopMotionGameState extends GameState { // added gamestate extension
//     // Who is working the animation software?
//     // The software is not co-op, so there is a unique animator.
//     // That would require us to resolve race conditions etc.
//     animator?: PlayerID;

//     // The animation currently loaded, worked on by the animator.
//     animation: Animation;

//     // Who is viewing the created animations?
//     // Multiple readers of data does not produce a race condition, so 
//     // there can be many spectators.
//     spectators: PlayerID[],

//     // Satisfy interface
//     status: GameStatus
// }

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