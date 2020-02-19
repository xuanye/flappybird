import { Container, Texture, Sprite } from "pixi.js";
import anime from "animejs/lib/anime.es.js";
import utils from "../utils";

export default class HoldBacks extends Container {
    constructor(setting) {
        super();
        this._init(setting);
    }

    _init(setting) {
        this._setting = setting;
        //管子之间的水平间隔
        this._hoseSpacingX = 300;
        //上下管子之间的垂直间隔，即小鸟要穿越的空间大小
        this._hoseSpacingY = 290;
        //管子的总数（上下一对管子算一个）
        this._numHoses = 4;
        //移出屏幕左侧的管子数量，一般设置为管子总数的一半
        this._numOffscreenHoses = this._numHoses * 0.5;
        //管子的宽度（包括管子之间的间隔）
        this._hoseWidth = 148 + this._hoseSpacingX;

        //初始化障碍的宽和高
        this.width = this._hoseWidth * this._numHoses;
        this.height = setting.stageHeight;
        this.reset();

        this._hoseTexture = Texture.from("holdback");
        this.draw(this._hoseTexture);
    }

    _placeHose(downHose, upHose, index) {
        let downMinY =
            this._setting.groundY - downHose.height + this._hoseSpacingY;
        //下面障碍在y轴的最下的位置, 180管子顶端的部分
        let downMaxY = this._setting.groundY - 180;
        //在downMinY和downMaxY之间随机位置
        downHose.y = (downMinY + (downMaxY - downMinY) * Math.random()) >> 0;
        downHose.x = this._hoseWidth * index;

        upHose.y = downHose.y - this._hoseSpacingY - upHose.height;
        upHose.x = downHose.x;
    }
    _resetHoses() {
        var total = this.children.length;

        //把已移出屏幕外的管子放到队列最后面，并重置它们的可穿越位置
        for (let i = 0; i < this._numOffscreenHoses; i++) {
            let downHose = this.getChildAt(0);
            let upHose = this.getChildAt(1);
            this.setChildIndex(downHose, total - 1);
            this.setChildIndex(upHose, total - 1);
            this._placeHose(downHose, upHose, this._numOffscreenHoses + i);
        }

        //重新确定队列中所有管子的x轴坐标
        for (let i = 0; i < total - this._numOffscreenHoses * 2; i++) {
            let hose = this.getChildAt(i);
            hose.x = this._hoseWidth * ((i * 0.5) >> 0);
        }

        //重新确定障碍的x轴坐标
        this.x = 0;

        //更新穿过的管子数量
        this._passThrough += this._numOffscreenHoses;

        //继续移动
        this.startMove();
    }
    draw(hoseBase) {
        for (let i = 0; i < this._numHoses; i++) {
            let spriteArr = utils.spriteFrame(hoseBase, [
                [0, 0, 148, 820],
                [148, 0, 148, 820]
            ]);

            let downHose = new Sprite(spriteArr[0]);
            let upHose = new Sprite(spriteArr[1]);

            this.addChild(downHose, upHose);
            this._placeHose(downHose, upHose, i);
        }
    }

    startMove() {
        //设置缓动的x轴坐标
        var targetX = -this._hoseWidth * this._numOffscreenHoses;

        if (!this._startAnime) {
            this._startAnime = anime({
                targets: this,
                x: [this.x, targetX],
                duration: (this.x - targetX) * 4,
                autoplay: false,
                easing: "linear",
                complete: this._resetHoses.bind(this)
            });
        }

        if (!this._moveAnime && this.x == 0) {
            this._moveAnime = anime({
                targets: this,
                x: [this.x, targetX],
                duration: (this.x - targetX) * 4,
                autoplay: false,
                easing: "linear",
                complete: this._resetHoses.bind(this)
            });
            //启动缓动动画
        }

        if (this.x == 0) {
            this._moveAnime.play();
        } else {
            this._startAnime.play();
        }
    }
    stopMove() {
        if (this._moveAnime) {
            this._moveAnime.pause();
        }

        if (this._startAnime) {
            this._startAnime.pause();
        }
    }
    reset() {
        this.x = this._setting.startX;
        this._moveAnime = null;
        this._startAnime = null;
        this._passThrough = 0;
    }
    checkCollision(bird, cb) {
        return !!utils.bump.hit(
            bird,
            this.children,
            true,
            false,
            true,
            cb || function() {}
        );
    }

    calcPassThrough(x) {
        var count = 0;
        x = -this.x + x;
        if (x > 0) {
            var num = (x / this._hoseWidth + 0.5) >> 0;
            count += num;
        }
        count += this._passThrough;
        return count;
    }

    onUpdate() {}
}
