import Sprite = Phaser.GameObjects.Sprite;

export default class RJSSprite extends Sprite {
    background?: Sprite
    config?: any
    text?: {
        text?: any;
        fill?: any;
    }
    // constructor(scene, x, y, texture?, frame?) {
    //     super(game, x, y);
    // }

    destroy(): void {
    	if (this.background){
    		this.background.destroy();
    	}
    	super.destroy();
    }


}
