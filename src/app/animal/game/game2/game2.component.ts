import { Component, AfterViewInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Animation } from '@ionic/core';
import { GameComponent, GameData, GAME_STATE, RIGHT_SOUND, WRONG_SOUND, GAME_RESULT } from '../game.component';
import { shuffle } from 'lodash';
import { GameCompleteComponent } from '../gameComplete/gameComplete.component';
import { ModalController, IonSlides, AnimationController } from '@ionic/angular';
import { AnimalsDataService } from 'src/app/animals-data.service';
import { TimeInterval, interval, Subscription } from 'rxjs';
const ENEMY_ENTER_Y: number = -220;
const ENEMY_EXIT_Y: number = 270;
const LOSE_CONDITION: number = 3;
@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.scss'],
})
export class Game2Component implements AfterViewInit, GameComponent {
  //数据
  _data: Game2Data;

  @Input()
  set data(value: Game2Data) {
    if (value != null && value.type != null) {
      this._data = value;
      if (!this._data.startDialog) {
        this.startGameHandler();
      }
    }
  };
  get data(): Game2Data {
    return this._data;
  }
  lang: string;
  constructor(
    private modalController: ModalController,
    private animalsDataService: AnimalsDataService,
    private animationCtrl: AnimationController,
    private cdRef: ChangeDetectorRef) {
    this.lang = this.animalsDataService.language;
  }
  ngAfterViewInit() {
    this.initGame();
  }
  /********************************************************************************************************************/
  gameState: string = GAME_STATE.READY;
  //初始化游戏，不能放到set data里面，因为phaser-div-game5可能还没生成
  initGame() {
    //初始化游戏

    //初始化场景
    this.resetGame()
  }
  //重置游戏场景
  resetGame() {
    this.puzzle = undefined;
    this.roundNo = -1;
    this.gameState = GAME_STATE.READY;
    if (this.battleTimerSubscribe) {
      this.battleTimerSubscribe.unsubscribe();
    }
  }
  /****************************************************************/
  //拼图
  roundNo: number = -1;
  gameQuestions: Array<GameQuestion>;
  gameQuestion: GameQuestion;
  gameResult: string;
  puzzle: Array<Array<PuzzleItem>>;
  slideOpts = {
    direction: "vertical",
    loop: true
  };
  //开始游戏
  startGameHandler() {
    //乱序和复位
    this.gameQuestions = this.data.gameContents.questions;
    this.puzzle = new Array<Array<PuzzleItem>>();
    for (let i: number = 0; i < this.data.gameContents.puzzle.length; i++) {
      this.puzzle.push(shuffle(this.data.gameContents.puzzle[i]))
    }
    // this.gameQuestions.forEach((q)=>{q.done=false});
    //开始
    this.startRound(0);
    this.startBattle();
    this.gameState = GAME_STATE.PLAYING;
    this.gameResult = GAME_RESULT.EMPTY;
  }
  //开始回合
  startRound(roundNo: number) {
    this.roundNo = roundNo;
    this.gameQuestion = this.gameQuestions[roundNo];
    this.puzzleInPosition = new Array<boolean>();
    for (let i: number = 0; i < this.puzzle.length; i++) {
      this.puzzleInPosition.push(false);
    }
    this.puzzleComplete = false;
    if (this.roundNo >= this.gameQuestions.length - 1) {
      this.skipButtonEnabled = false;
    } else {
      this.skipButtonEnabled = true;
    }
    let a: Animation = this.animationCtrl.create()
      .addElement(document.querySelector(".question"))
      .duration(500)
      .delay(200)
      .easing('ease-out')
      .iterations(1)
      .fromTo('opacity', "0", "1")
      .onFinish(() => {
      });
    a.play()
  }
  skipButtonEnabled: boolean = true;
  nextRound() {
    //下一题
    this.roundNo++;
    this.startRound(this.roundNo);
  }
  puzzleInPosition: Array<boolean>;
  puzzleComplete: boolean = false;
  //选择选项
  async selectPuzzleHandler(puzzleItemsSlides: IonSlides, puzzleCatalogIndex: number) {
    let selectedIndex: number = await puzzleItemsSlides.getActiveIndex();
    //循环模式下activeIndex的纠正
    if (puzzleItemsSlides.options.loop) {
      if (selectedIndex <= 0) {
        selectedIndex = this.puzzle[puzzleCatalogIndex].length - 1
      } else if (selectedIndex <= this.puzzle[puzzleCatalogIndex].length) {
        selectedIndex = selectedIndex - 1;
      } else {
        selectedIndex = 0;
      }
    }
    // console.info(puzzleItemsSlides, selectedIndex)
    let this_ = this
    if (this.gameQuestion.value == this.puzzle[puzzleCatalogIndex][selectedIndex].value) {
      //选择正确
      this.puzzleInPosition[puzzleCatalogIndex] = true;
      //判断拼图是否完成
      for (let i: number = 0; i < this.puzzle.length; i++) {
        if (!this.puzzleInPosition[i]) {
          return;
        }
      }
      this.puzzleComplete = true;
      RIGHT_SOUND.once('end', async function () {
        await this_.showRight(this_.roundNo);
        if (this_.roundNo >= this_.gameQuestions.length - 1) {
          // 游戏结束
          // this_.endGame();
        } else {
          //下一题
          this_.roundNo++;
          this_.startRound(this_.roundNo);
        }
      });
      RIGHT_SOUND.play();
    } else {
      this.puzzleInPosition[puzzleCatalogIndex] = false;
    }
  }
  //完成
  async endGame() {
    if (this.battleTimerSubscribe) {
      this.battleTimerSubscribe.unsubscribe();
    }
    this.gameQuestion = undefined;
    this.puzzle = undefined;
    this.gameState = GAME_STATE.COMPLETED;
    // console.info({ imageURL: this.data.gameCompleteImageURL, text: this.data.gameCompleteTips })
    const modal = await this.modalController.create({
      component: GameCompleteComponent,
      cssClass: 'photo-modal',
      componentProps: {
        'data': { imageURL: this.data.gameCompleteImageURL, text: this.data.gameCompleteTips }
      }
    });
    await modal.present();
    this.resetGame();
  }
  /******************************************************************************/
  //完成一个拼图
  async showRight(puzzleCatalogIndex: number) {
    //虎符闪烁
    let a: Animation = this.animationCtrl.create()
      .addElement(document.querySelector(".question"))
      .duration(500)
      .easing('ease-out')
      .iterations(1)
      .fromTo('opacity', "0", "1")
      .onFinish(() => {
      });
    let b: Animation = this.animationCtrl.create()
      .addElement(document.querySelector(".question"))
      .duration(300)
      .delay(200)
      .easing('ease-out')
      .iterations(1)
      .fromTo('transform', "translate(0, 0) scale(1)", "translate(-480px, 450px) scale(0.3)")
      .onFinish(() => {
      });
    await a.play();
    await b.play();

    console.info("援军出城：", puzzleCatalogIndex);
    let this_ = this;
    this.fights.forEach((fight) => {
      if (fight.soldierQuestionValue == this.gameQuestion.value && fight.fighting != FIGHTING_STATE.LOSE) {
        fight.soldierInPosition = true;
      }
    })
    let c: Animation = this.animationCtrl.create()
      .addElement(document.querySelector(".question"))
      .duration(500)
      .iterations(1)
      .fromTo('opacity', "1", "0")
      .onFinish(() => {
      });
    let d: Animation = this.animationCtrl.create()
      .addElement(document.querySelector(".question"))
      .duration(0)
      .iterations(1)
      .to('transform', "translate(0, 0) scale(1)")
      .onFinish(() => {
      });
    await c.play();
    await d.play();
  }
  fights: Array<FightData>;
  fire: Array<string>;
  battleTimer = interval(80);;
  battleTimerSubscribe: Subscription;
  startBattle() {
    this.fights = this.data.gameContents.fights;
    this.fire = this.data.gameContents.fireImageURL;
    this.fights.forEach((fight) => {
      fight.fighting = FIGHTING_STATE.NOT_MEET;
      fight.enemyPositionY = ENEMY_ENTER_Y;
      fight.soldierInPosition = false;
    })
    this.fireIndex = -1;
    this.battleTimerSubscribe = this.battleTimer.subscribe(this.battleLoop.bind(this));
  }
  //战役循环
  fireIndex: number = -1;
  battleLoop(n: number) {
    // console.info("battle timer: ", n,this,this.fights);
    let battleEnd: boolean = false;
    if (this.fights) {
      battleEnd = true;
      this.fights.forEach((fight) => {
        //敌军前进
        if (n <= fight.enemyEnterTime) {
          //敌军未入场
          fight.enemyPositionY = ENEMY_ENTER_Y;
        }
        else {
          if (fight.enemyPositionY < ENEMY_EXIT_Y) {
            //敌军前进
            fight.enemyPositionY = fight.enemyPositionY + 1;
            // this.cdRef.detectChanges();
          } else if (fight.enemyPositionY == ENEMY_EXIT_Y && fight.fighting != FIGHTING_STATE.WIN && fight.fighting != FIGHTING_STATE.LOSE) {
            //兵临城下
            if (fight.soldierInPosition) {
              //城下有兵
              if (fight.fighting == FIGHTING_STATE.NOT_MEET) {
                //开打
                console.info("开打！");
                fight.fighting = FIGHTING_STATE.START_FIGHT;
                // this.cdRef.detectChanges();
              } else if (fight.fighting > FIGHTING_STATE.WIN) {
                //还在打
                fight.fighting = fight.fighting - 1;
                console.info("胜利倒计时：", fight.fighting);
              }
            } else {
              console.info("失守");
              fight.fighting = FIGHTING_STATE.LOSE;
              this.fireIndex++;
            }
          }
        }
        //看一下当前战斗状态
        if (fight.fighting != FIGHTING_STATE.WIN && fight.fighting != FIGHTING_STATE.LOSE) {
          battleEnd = false;
        }
      })
    }
    if (battleEnd) {
      console.info("游戏结束！");
      this.battleTimerSubscribe.unsubscribe();
      if (this.fireIndex >= LOSE_CONDITION) {
        console.info("游戏失败！");
        this.gameResult = GAME_RESULT.LOST;
      } else {
        console.info("游戏胜利！");
        this.gameResult = GAME_RESULT.WIN;
      }
      setTimeout(this.endGame.bind(this), 3000);
    }
  }
}
class Game2Data extends GameData {
  gameContents: PuzzleGameData;
  gameWinImageURL: string;
  gameLostImageURL: string;
}
class PuzzleGameData {
  questions: Array<GameQuestion>;
  puzzle: Array<Array<PuzzleItem>>;
  fights: Array<FightData>;
  fireImageURL: Array<string>;
}
class GameQuestion {
  imageURL: string;
  value: number;
  done: boolean = false;
}
class PuzzleItem {
  imageURL: string;
  value: number;
  done: boolean = false;
}
class FightData {
  enemyImageURL: string;
  soldierImageURL: string;
  fightImageURL: string;
  enemyEnterTime: number;
  enemyPositionY: number;
  soldierQuestionValue: number;
  soldierInPosition: boolean = false;
  fighting: number = FIGHTING_STATE.NOT_MEET;
}
// enum ENEMY_STATE {
//   NO_ENEMY = -1,
//   ENEMY_COMMING = 0,
//   ENEMY_ARRIVED = 1,
//   ENEMY_DEFEATED = 2,
// }
// enum SOLDIER_STATE {
//   SOLDIER_NOT_READY = 0,
//   SOLDIER_READY = 1
// }
enum FIGHTING_STATE {
  NOT_MEET = -100,
  START_FIGHT = 40,
  WIN = 0,
  LOSE = -1
}