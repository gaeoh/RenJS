class SHOWTITLE extends RenJS.Plugin {

	onCall(params) {
		const bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        bg.alpha = 0;
        bg.anchor.set(0.5);
        const style = {...this.game.gui.getTextStyle('choice')};
        style.font = '50pt ' + this.game.gui.fonts[0];
        const title = this.game.add.text(0, -20, params.title, style);
        style.font = '25pt ' + this.game.gui.fonts[0];
        const subtitle = this.game.add.text(0, 40, params.subtitle, style);
        subtitle.anchor.set(0.5);
        title.anchor.set(0.5);
        bg.addChild(title);
        bg.addChild(subtitle);
        this.game.managers.tween.chain([
            {sprite: bg, tweenables: {alpha: 1}},
            {
                sprite: bg, tweenables: {alpha: 0}, callback: () => {
                    bg.destroy();
                    this.game.resolveAction();
                }, delay: this.game.storyConfig.fadetime * 2
            }
        ], true, this.game.storyConfig.fadetime * 2);
	}
}

RenJSGame.addPlugin('SHOWTITLE',SHOWTITLE);


class HEAVYRAIN extends RenJS.Plugin {

    // Ambients don't need to call resolveAction

    onCall(params) {
        this.game.managers.audio.play('rainBGS','bgs',true,null,'FADE');
        let maxLifespan = 1600;
        let ambientManager = this.game.screenEffects.ambient;
        let e1 = ambientManager.addEmitter({
            maxParticles: 400,
            sprite:'rain',
            frames: [0],
            scale: [0.1,0.5],
            speed: {y:[300,500],x:[-5,5]},
            rotation: [0,0]
        },[false, maxLifespan, 5, 0]);
        let e2 = ambientManager.addEmitter({
            maxParticles: 400,
            sprite:'rain',
            frames: [0],
            scale: [0.5,1],
            speed: {y:[500,700],x:[-5,5]},
            rotation: [0,0]
        },[false, maxLifespan, 5, 0]);

        ambientManager.clearFunctions.push(()=>{
            ambientManager.destroyEmitters([e1,e2],maxLifespan);
            this.game.managers.audio.stop('bgs','FADE');
        })
    }
}
RenJSGame.addPlugin('HEAVYRAIN',HEAVYRAIN)