import { AnimatedSprite, Texture } from "pixi.js";
import anime from "animejs/lib/anime.es.js";
import utils from "../utils";

export default class Bird extends AnimatedSprite {
    constructor(setting) {
        let textureArray = utils.spriteFrame(Texture.from("bird"), [
            [0, 0, 86, 60],
            [0, 60, 86, 60],
            [0, 120, 86, 60]
        ]);

        super(textureArray);

        this._setting = Object.assign({}, setting);
        this._init();
    }

    _init() {
        this.isFlying = false;

        this._gravity = (10 / 1000) * 0.2; //重力加速度
        this._flyHeight = 80; //小鸟每次往上飞的高度
        this._initVelocity = Math.sqrt(2 * this._flyHeight * this._gravity); //小鸟往上飞的初速度
        this._isUp = false;

        //设置起始坐标
        this.x = this._setting.startX;
        this.y = this._setting.startY;

        this.anchor.set(0.5, 0.5);
        this.animationSpeed = 0.2;
        this.play();
        this._animate();
    }

    _animate() {
        if (!this._readyAnime) {
            this._readyAnime = anime({
                targets: this,
                y: "+=10",
                angle: "-=8",
                duration: 400,
                loop: true,
                direction: "alternate",
                easing: "linear"
            });
        }
        this._readyAnime.play();
    }

    ready() {
        this.angle = 0;
        this.x = this._setting.startX;
        this.y = this._setting.startY;
        this.play();
        this._animate();
    }
    fly() {
        this.isFlying = true;
        this._flyStartY = this.y;

        this._flyStartTime = +new Date();

        if (this._readyAnime) {
            this._readyAnime.pause();
        }

        if (this._flyAnimate) {
            this._flyAnimate.pause();
            this._flyAnimate = null;
        }
    }
    flying() {
        if (!this.isFlying) return;

        //飞行时间
        let time = +new Date() - this._flyStartTime;

        //飞行距离
        let distance =
            this._initVelocity * time - 0.5 * this._gravity * time * time;
        //console.log('distance=',distance)
        //y轴坐标
        let y = this._flyStartY - distance;

        if (y <= this._setting.groundY) {
            //小鸟未落地
            this.y = y;
            if (distance > 0 && !this._isUp) {
                //往上飞时，角度上仰20度
                /**/
                this._flyAnimate = anime({
                    targets: this,
                    angle: -20,
                    duration: 200
                });

                this._isUp = true;
            } else if (distance < 0 && this._isUp) {
                /**/
                this._flyAnimate = anime({
                    targets: this,
                    angle: 90,
                    duration: 300
                });
                this._isUp = false;
            }
            this.isFlying = true;
        } else {
            //小鸟已经落地，即死亡
            this.y = this._setting.groundY;
            this.isFlying = false;
        }
    }
    onUpdate(delta) {
        this.flying();
    }
}
