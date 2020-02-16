export interface GameComponent {
  data: any;
}
export class GameData {
  type: string;
  intro: string;
  startDialog: StartGameDialog;
  gameCompleteImageURL: string;
}

class StartGameDialog {
  guide: string;
  intro: string;
}

export const GAME_STATE = {
  READY: "gameReady",
  PLAYING: "gamePlaying",
  COMPLETED: "gameCompleted"
}
export const GAME_RESULT = {
  EMPTY:"empty",
  RIGHT: "gameRight",
  WRONG: "gameWrong"
}