import {Howl, Howler} from 'howler';
export interface GameComponent {
  data: any;
}

export const RIGHT_SOUND = new Howl({
  src: ['assets/sound/right.mp3']
});
export const WRONG_SOUND = new Howl({
  src: ['assets/sound/wrong.mp3']
});
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