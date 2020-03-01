import { Container, Texture, Sprite } from 'pixi.js';

import utils from '../utils';

export default class GameReadyScene extends Container {
    constructor(setting) {
        super();
        this._init(setting);
    }
    _init(setting) {
        this._textureBase = Texture.from('ready');
        this._setting = setting;
        this.draw();
    }

    draw() {
        let arr = utils.spriteFrame(this._textureBase, [
            [0, 0, 508, 158],
            [0, 158, 286, 246],
        ]);
        let getready = new Sprite(arr[0]);

        let tap = new Sprite(arr[1]);

        tap.x = (this._setting.stageWidth - tap.width) >> 1;
        tap.y = (this._setting.stageHeight - tap.height + 40) >> 1;
        getready.x = (this._setting.stageWidth - getready.width) >> 1;
        getready.y = (tap.y - getready.height) >> 0;

        this.addChild(tap, getready);
    }

    onUpdate() {}
}
