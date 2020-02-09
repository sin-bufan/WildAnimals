export interface GameComponent {
  data: any;
}
export class GameData{
  type: string;
  intro: string;
  startDialog: StartGameDialog;
}

class StartGameDialog {
  guide: string;
  intro:string;
}