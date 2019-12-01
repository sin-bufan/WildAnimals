export class GameScene1  extends Phaser.Scene{
    //1.初始化
    init () {
        this.cameras.main.setBackgroundColor('#ff0000');
      }
      //2.加载素材
    preload(){
        this.load.image('bg','assets/bg.png')
      }
      helloWorld: Phaser.GameObjects.Text;
      //3.创建舞台内容
      create(){
        this.add.image(
          this.cameras.main.centerX, 
          this.cameras.main.centerY,
          'bg').setScale(0.2);
    
        this.helloWorld = this.add.text(
          this.cameras.main.centerX, 
          this.cameras.main.centerY, 
          "Hello World", { 
            font: "40px Arial", 
            fill: "#0000ff" 
          }
        );
        this.helloWorld.setOrigin(0.5);
      }
    //4.循环刷新（16ms）
     update () {
      this.helloWorld.angle -= 1;
      }
}
