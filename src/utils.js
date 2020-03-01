import * as PIXI from 'pixi.js';

//import SpriteUtilities from './helpers/spriteUtilities';
//import './helpers/charm';
import Bump from './helpers/bump';

export default {
    bump: new Bump(PIXI),

    spriteFrame(base, rectArray) {
        let textureArray = [];
        for (let i = 0; i < rectArray.length; i++) {
            let t1 = new PIXI.Texture(base, new PIXI.Rectangle(rectArray[i][0], rectArray[i][1], rectArray[i][2], rectArray[i][3]));
            textureArray.push(t1);
        }
        return textureArray;
    },
};
