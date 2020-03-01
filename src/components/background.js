import { Sprite, Texture } from 'pixi.js';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants';

/**
 * 背景组件
 * 静止不动的图片
 * @export
 * @class Background
 * @extends {Sprite}
 */
export default class Background extends Sprite {
    constructor() {
        super(Texture.from('bg'));

        this.scale.set(STAGE_WIDTH / this.width, STAGE_HEIGHT / this.height);
    }

    onUpdate(delta) {}
}
