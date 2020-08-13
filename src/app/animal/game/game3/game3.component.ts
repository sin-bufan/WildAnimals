import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';

import { GameComponent, GameData, GAME_STATE, RIGHT_SOUND, WRONG_SOUND } from '../game.component';
import { shuffle } from 'lodash';
import { GameCompleteComponent } from '../gameComplete/gameComplete.component';
import { ModalController } from '@ionic/angular';
import { AnimalsDataService } from 'src/app/animals-data.service';
@Component({
  selector: 'app-game3',
  templateUrl: './game3.component.html',
  styleUrls: ['./game3.component.scss'],
})
export class Game3Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game3Data;

  @Input()
  set data(value: Game3Data) {
    if (value != null && value.type != null) {
      this._data = value;
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game3Data {
    return this._data;
  }
  lang:string;
  constructor(
    private modalController:ModalController,
    private animalsDataService: AnimalsDataService) {
      this.lang = this.animalsDataService.language;
  }
  ngAfterViewInit() {
    this.initGame();
  }
  /********************************************************************************************************************/
  gameState: string = GAME_STATE.READY;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //离开游戏的时候重置
    let this_ = this;
    this.animalsDataService.$currentAnimalSection.subscribe(
      (value) => {
        //console.info("获取导航事件：",value);
        this_.resetGame();
      }
    );
    //初始化场景
    this.resetGame()
  }
  //重置游戏场景
  resetGame() {
    this.gameOptions = undefined;
    this.roundNo = -1;
    this.gameState = GAME_STATE.READY;
  }

  roundNo: number = -1;
  gameQuestion: GameQuestion;
  gameOptions: Array<GameOption>;
  gameQuestions: Array<GameQuestion>;
  optionNo: number;
  //开始游戏
  startGameHandler() {
    //乱序和复位
    this.gameOptions = shuffle(this.data.gameContents.options);
    this.gameOptions.forEach((o)=>{o.done=false});
    this.gameQuestions = shuffle(this.data.gameContents.questions);
    this.gameQuestions.forEach((q)=>{q.done=false});
    //开始
    this.startRound(0);
    this.gameState = GAME_STATE.PLAYING;
  }
  //开始回合
  startRound(roundNo: number) {
    this.roundNo = roundNo;
    this.gameQuestion = this.gameQuestions[roundNo];
  }
  //拖拽效果
  dragQuestionImageStartHandler(event){
    // console.info("dragQuestionImageStartHandler: ",event)
    event.target.style.opacity=0.2;
  }
  dragQuestionImageEndHandler(event){
    // console.info("dragQuestionImageStartHandler: ",event)
    event.target.style.opacity=1;
  }
  dragQuestionImageOverHandler(event,item){
    event.preventDefault();//允许放下
    // console.info("dragQuestionImageOverHandler: ",event,item)
    event.target.style.opacity=0.6;
  }
  dragQuestionImageLeaveHandler(event,item){
    // console.info("dragQuestionImageOutHandler: ",event,item)
    event.target.style.opacity=1;
  }
  //放下
  dropQuestionImageHandler(event,item){
    // console.info("dropQuestionImageHandler: ",event)
    event.target.style.opacity=1;
    this.selectOptionHandler(item)
  }
  //选择选项
  selectOptionHandler(option: GameOption) {
    if (option.value == 0)
      return;
    let this_ = this
    if (this.gameQuestion.value == option.value) {
      //选择正确
      RIGHT_SOUND.once('end', function () {
        if (this_.roundNo >= this_.gameQuestions.length - 1) {
          // 游戏结束
          this_.endGame();
        } else {
          //下一题
          this_.roundNo++;
          this_.startRound(this_.roundNo);
        }
      });
      RIGHT_SOUND.play();
      this.gameQuestion.done = true;
      option.done = true;
    } else {
      //选择错误
      WRONG_SOUND.once('end', function () {
        // this_.startRound(this_.roundNo);
      });
      WRONG_SOUND.play();
    }
  }

  async endGame() {
    this.gameQuestion = undefined;
    this.gameOptions = undefined;
    this.gameState = GAME_STATE.COMPLETED;
    console.info({imageURL:this.data.gameCompleteImageURL,text:this.data.gameCompleteTips})
    const modal = await this.modalController.create({
      component: GameCompleteComponent,
      cssClass: 'photo-modal',
      componentProps: {
        'data': {imageURL:this.data.gameCompleteImageURL,text:this.data.gameCompleteTips}
      }
    });
    await modal.present();
    this.resetGame();
  }
}
class Game3Data extends GameData {
  gameContents: MatchGameData;
}
class MatchGameData {
  questions: Array<GameQuestion>;
  options: Array<GameOption>;
}
class GameQuestion {
  imageURL: string;
  value: number;
  done:boolean=false;
}
class GameOption {
  imageURL: string;
  answerImageURL: string;
  value: number;
  done:boolean=false;
}