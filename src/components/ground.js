import { Sprite, Texture } from "pixi.js";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../constants";

const GROUND_OFFSET = 60;

export default class Ground extends Sprite {
    constructor() {
        super(Texture.from("ground"));

        this._scaleX = (STAGE_WIDTH + GROUND_OFFSET * 2) / this.width;

        //移动总距离
        this._moveRange = GROUND_OFFSET * this._scaleX;

        //拆分单位移动距离
        this._moveUnit = this._moveRange / 60;

        this.draw();
    }

    draw() {
        this.scale.set(this._scaleX, 1);
        this.y = STAGE_HEIGHT - this.height;
    }

    onUpdate(delta) {
        //刷新时移动地面
        if (this.x <= -this._moveRange) {
            this.x = 0;
        } else {
            this.x -= this._moveUnit * delta * 2;
        }
    }

    onResize() {
        //如果是自适应的话 需要在这里做处理，本例中是固定窗口大小的
    }
}
