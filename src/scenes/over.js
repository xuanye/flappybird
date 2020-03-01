import { Container, Texture, Graphics, BitmapText, Sprite } from 'pixi.js';
import anime from 'animejs/lib/anime.es.js';

import utils from '../utils';

export default class GameOverScene extends Container {
    constructor(setting) {
        super();

        this._init(setting);
    }

    _init(setting) {
        this._setting = setting;
        this._textureBase = Texture.from('over');
        this.visible = false;

        this.draw();
    }

    draw() {
        let textureArray = utils.spriteFrame(this._textureBase, [
            [0, 0, 590, 298],
            [0, 298, 508, 158],
            [590, 0, 290, 176],
            [590, 176, 290, 176],
        ]);

        let board = new Sprite(textureArray[0]);
        board.name = 'board';
        this._board = board;

        let gameover = new Sprite(textureArray[1]);
        gameover.name = 'gameover';
        this._gameover = gameover;

        let startBtn = new Sprite(textureArray[2]);
        startBtn.name = 'startBtn';
        startBtn.interactive = true;
        startBtn.buttonMode = true;

        this._startBtn = startBtn;

        let gradeBtn = new Sprite(textureArray[3]);
        gradeBtn.name = 'gradeBtn';

        this._gradeBtn = gradeBtn;

        let scoreLabel = new BitmapText('0', { font: '32px fnum' });
        scoreLabel.letterSpacing = 14;
        scoreLabel.name = 'scoreLabel';
        this._scoreLabel = scoreLabel;

        let bestLabel = new BitmapText('0', { font: '32px fnum' });
        bestLabel.name = 'bestLabel';
        bestLabel.letterSpacing = 14;
        this._bestLabel = bestLabel;

        let whiteMask = new Container();
        whiteMask.name = 'whiteMask';
        whiteMask.width = this._setting.stageWidth;
        whiteMask.height = this._setting.stageHeight;
        whiteMask.alpha = 0;

        let graphics = new Graphics();
        graphics.beginFill(0xffffff);
        graphics.drawRect(0, 0, this._setting.stageWidth, this._setting.stageHeight);
        graphics.endFill();
        whiteMask.addChild(graphics);

        this._whiteMask = whiteMask;

        board.x = (this._setting.stageWidth - board.width) >> 1;
        board.y = (this._setting.stageHeight - board.height) >> 1;
        gameover.x = (this._setting.stageWidth - gameover.width) >> 1;
        gameover.y = board.y - gameover.height - 20;
        startBtn.x = board.x - 5;
        startBtn.y = (board.y + board.height + 20) >> 0;
        gradeBtn.x = (startBtn.x + startBtn.width + 20) >> 0;
        gradeBtn.y = startBtn.y;

        scoreLabel.x = (board.x + board.width - 140) >> 0;
        scoreLabel.y = board.y + 90;
        bestLabel.x = scoreLabel.x;
        bestLabel.y = scoreLabel.y + 105;

        this.addChild(gameover, board, startBtn, gradeBtn, scoreLabel, bestLabel, whiteMask);

        this.initEvents();
    }

    initEvents() {
        this._startBtn.on('pointerdown', e => {
            e.stopPropagation(); //组织冒泡
            if (!this.animating) this.fireRestart();
        });
    }
    fireRestart() {
        this.emit('restart');
    }
    show(score, bestScore) {
        this.animating = true;

        this.visible = true;

        this._scoreLabel.text = score;
        this._bestLabel.text = bestScore;

        this._whiteMask.alpha = 1;

        let tl = anime.timeline({
            easing: 'linear',
            duration: 700,
        });
        tl.complete = () => {
            this.animating = false;
            //console.log(this.animating)
        };
        tl.add({
            targets: this._gameover,
            alpha: 1,
            duration: 100,
        })
            .add(
                {
                    targets: [this._board, this._scoreLabel, this._bestLabel],
                    alpha: 1,
                    y: '-=150',
                    duration: 400,
                    easing: 'easeOutBack',
                },
                200
            )
            .add(
                {
                    targets: [this._startBtn, this._gradeBtn],
                    alpha: 1,
                    duration: 100,
                },
                300
            )
            .add(
                {
                    targets: this._whiteMask,
                    alpha: 0,
                    duration: 400,
                },
                0
            );

        console.log(tl);
        //easing: 'linear'
    }

    hide() {
        this.visible = false;
        this._scoreLabel.text = 99;
        this._bestLabel.text = 99;

        this._gameover.alpha = 0;
        this._scoreLabel.alpha = 0;
        this._bestLabel.alpha = 0;
        this._startBtn.alpha = 0;
        this._gradeBtn.alpha = 0;
        this._board.y += 150;
        this._scoreLabel.y += 150;
        this._bestLabel.y += 150;
    }

    onUpdate() {}
}
