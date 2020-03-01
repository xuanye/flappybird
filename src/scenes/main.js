import { Container, BitmapText } from 'pixi.js';

import { Background, Ground, Bird, HoldBacks } from '../components';

/**
 * 游戏的主见面，包括背景，地面，和障碍物的初始化
 *
 * @export
 * @class MainScene
 * @extends {Container}
 */
export default class MainScene extends Container {
    constructor(setting) {
        super();

        this._init(setting);
    }

    _init(setting) {
        this._setting = Object.assign({}, setting);
        this._state = 'ready';
        this.draw();
    }

    draw() {
        //初始化背景
        this._background = new Background();
        this.addChild(this._background);

        //初始化地面
        this._ground = new Ground();
        this.addChild(this._ground);

        //初始化小鸟
        this._bird = new Bird({
            startX: 200,
            startY: this._setting.stageHeight >> 1,
            groundY: this._ground.y - 12,
        });
        this.addChildAt(this._bird, this.getChildIndex(this._ground));

        this._holdBacks = new HoldBacks({
            stageHeight: this._setting.stageHeight,
            startX: this._setting.stageWidth + 200,
            groundY: this._ground.y,
        });

        this.addChildAt(this._holdBacks, this.getChildIndex(this._ground) - 1);

        this._currentScoreLabel = new BitmapText('0', { font: '64px fnum' });
        this._currentScoreLabel.letterSpacing = 14;

        this._currentScoreLabel.x = (this._setting.stageWidth - this._currentScoreLabel.width) >> 1;
        this._currentScoreLabel.y = 180;

        this.addChild(this._currentScoreLabel);
    }

    ready() {
        this._state = 'ready';
        this.score = 0;

        this._currentScoreLabel.text = 0;
        this._currentScoreLabel.visible = true;

        this._bird.ready();

        //重置场景
        this._holdBacks.reset();
    }
    startGame() {
        this._state = 'playing';
        this._holdBacks.startMove();
    }
    gameOver() {
        if (this._state == 'over') {
            return;
        }

        this._state = 'over';
        this._bird.gotoAndStop(0);
        this._holdBacks.stopMove();
        this._currentScoreLabel.visible = false;

        this.emit('gameover', this.score || 0);
    }

    birdFly() {
        this._bird.fly();
    }
    testHit(delta) {
        if (this._state != 'playing') {
            return;
        }

        if (!this._bird.isFlying) {
            this.gameOver();
        } else {
            //计算分数
            this.score = this.calcScore();
            this._currentScoreLabel.text = this.score;

            let hit = this._holdBacks.checkCollision(this._bird, () => {
                console.log('hit2~~');
                this.gameOver();
            });
            if (hit) {
                console.log('hit~~');
                this.gameOver();
            }
        }
    }
    calcScore() {
        var count = this._holdBacks.calcPassThrough(this._bird.x);
        return (this.score = count);
    }

    /**
     * 页面刷新的方法
     *
     * @memberof MainScene
     */
    onUpdate(delta) {
        this.testHit();

        this._background.onUpdate(delta);
        this._ground.onUpdate(delta);
        this._bird.onUpdate(delta);
        this._holdBacks.onUpdate(delta);
    }
}
