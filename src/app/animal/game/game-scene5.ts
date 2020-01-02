export class GameScene5 extends Phaser.Scene {
  //1.初始化
  init(data) {
    //console.info("GameScene5 receive data:", data)
  }
  //2.加载素材
  preload() {

  }
  //3.创建舞台内容
  create(data) {
    //let options:Phaser.GameObjects.DOMElement = new Phaser.GameObjects.DOMElement(this,100,100,'ion-text','background-color: lime; width: 220px; height: 100px; font: 48px Arial','test!!test!!')
    console.info(data)
    let options:string = `
  <div *ngIf="data.game" class="game5-weight-options">
    <ion-button class="image-button" expand="full" fill="clear" (click)="startGame()">
        <img src="assets/images/button/prevWeight.png" />
    </ion-button>
    <div>
        <ion-slides>
            <ion-slide *ngFor="let item of data.game.options">
                <img [src]="item.imageURL"/>
            </ion-slide>
        </ion-slides>
        <img src="assets/images/weightFrame.png"/>
    </div>
    <ion-button class="image-button" expand="full" fill="clear" (click)="startGame()">
        <img src="assets/images/button/nextWeight.png" />
    </ion-button>
  </div>`
    this.add.dom(500,100).createFromHTML(options);
  }
  //4.循环刷新（16ms）
  update() {

  }
}

export class Game5Data{
  options:Array<Game5Option>
}
class Game5Option{
  imageURL:string;
  value:string;
}

