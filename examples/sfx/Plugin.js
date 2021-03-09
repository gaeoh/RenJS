
class AttackEffect extends RenJS.Plugin {

	onCall(params) {
        let flashEffect = this.game.screenEffects.effects.FLASHIMAGE.bind(this.game.screenEffects.effects);
        flashEffect({
            image:"chainattack1",
            sfx:"lashSFX",
            shakeScreen:true
        }).then(()=>{
            flashEffect({
                image:"chainattack2",
                sfx:"lashSFX",
                shakeScreen:true
            }).then(()=>{
                flashEffect({
                    image:"chainattack3",
                    sfx:"lashSFX",
                    shakeScreen:true
                }).then(()=>{
                    // resolve to continue the story
                    this.game.resolveAction();
                });
            });
        });
	}
}

RenJSGame.addPlugin('ATTACK',AttackEffect)


class HEAVYRAIN extends RenJS.Plugin {

    // Ambients don't need to call resolveAction

    onCall(params) {
        this.game.managers.audio.play('rainBGS','bgs',true,'FADE');
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