import { STAGE_WIDTH, STAGE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { Application } from 'pixi.js';
import assets from './assets';

import { MainScene, GameOverScene, GameReadyScene } from './scenes';

export default class App extends Application {
    constructor(args) {
        super(Object.assign(args, { width: STAGE_WIDTH, height: STAGE_HEIGHT }));

        this._init(!args.view);
    }

    /**
     * private 初始化
     *
     * @param {*} appendToBody
     * @memberof App
     */
    _init(appendToBody) {
        this.state = 'ready';
        this.loader.add(assets.textures);
        this.loader.onProgress.add(this.onProgress);
        this.loader.load(this.draw.bind(this));

        this.view.style = `position: absolute; width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px;`;

        if (appendToBody) {
            document.body.appendChild(this.view);
        }
    }

    /**
     * 开始绘制场景
     *
     * @memberof App
     */
    draw() {
        let setting = {
            stageWidth: STAGE_WIDTH,
            stageHeight: STAGE_HEIGHT,
        };
        this._mainScene = new MainScene(setting);
        this._gameOverScene = new GameOverScene(setting);
        this._gameReadyScene = new GameReadyScene(setting);
        this.stage.addChild(this._mainScene, this._gameReadyScene, this._gameOverScene);

        //初始化事件
        this.initEvent();
        this.gameReady();
    }

    /**
     * 初始化事件
     *
     * @memberof App
     */
    initEvent() {
        //添加事件处理
        this.stage.interactive = true;
        this.stage.on('pointerdown', () => {
            if (this.state != 'over') {
                //如果游戏没有结束
                if (this.state == 'ready') {
                    //开始玩了
                    this.startGame(); //开始玩了
                }
                this.birdFly();
            }
        });
        this._gameOverScene.on('restart', () => {
            this.gameReady();
        });

        this._mainScene.on('gameover', score => {
            this.gameOver(score);
        });

        //添加主循环的处理
        this.ticker.add(this.onUpdate.bind(this));
    }

    birdFly() {
        this._mainScene.birdFly();
    }
    startGame() {
        this.state = 'playing';
        this._gameReadyScene.visible = false;
        this._mainScene.startGame();
    }
    gameReady() {
        this.state = 'ready';
        this._gameOverScene.hide();
        this.score = 0;
        this._mainScene.ready();
        this._gameReadyScene.visible = true;
    }
    gameOver(score) {
        //设置当前状态为结束over
        this.state = 'over';
        let best = this.saveBestScore(score);
        //显示结束的场景
        this._gameOverScene.show(score, best);
    }

    saveBestScore(score) {
        let best = 0;
        if (window.localStorage) {
            best = parseInt(window.localStorage.getItem('pixi-flappy-best-score')) || 0;
        }
        if (score > best) {
            best = score;
            window.localStorage.setItem('pixi-flappy-best-score', score);
        }
        return best;
    }
    onProgress(loader, resources) {
        console.log('loading..', loader.progress, '%');
    }

    onUpdate(delta) {
        this._mainScene.onUpdate(delta);
        this._gameOverScene.onUpdate(delta);
        this._gameReadyScene.onUpdate(delta);
    }

    onResize() {}
}
