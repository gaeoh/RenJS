function CGSManager(){
    this.cgs = {};
    this.current = {};

    this.set = function (current) {
        this.hideAll('CUT');
        this.current = current;
        for (const cg in this.current) {
          this.show(cg,RenJS.transitions.CUT,this.current[cg])
        }
    }

    this.show = function(name,transition,props){
        var position = props.position ? props.position : {x:game.world.centerX,y:game.world.centerY};
        this.cgs[name] = RenJS.storyManager.cgsSprites.create(position.x,position.y,name);            
        this.cgs[name].anchor.set(0.5);        
        this.cgs[name].alpha = 0;
        if (props.zoom){
            this.cgs[name].scale.set(props.zoom);    
        }        
        if (props.angle){
            this.cgs[name].angle = props.angle;
        }    
        if (RenJS.setup.cgs[name].animations){
            console.log("Adding animation to "+name)
            // for (const [key, anim] of Object.entries(RenJS.setup.cgs[name].animations)) {
            for (const key in RenJS.setup.cgs[name].animations) {
                var str = RenJS.setup.cgs[name].animations[key].split(" ");
                var r = [parseInt(str[0]),parseInt(str[1])]
                // range of animation
                var frames = [...Array(r[1]-r[0]).keys()].map(i => i + r[0])
                frameRate = 24;
                if (str.length>2){
                    frameRate = parseInt(str[2])
                }
                console.log(frameRate)
                this.cgs[name].animations.add(key,frames,frameRate)
            }
        }
        this.current[name] = {name:name, position: position, zoom:props.zoom,angle: props.angle};
        return transition(null,this.cgs[name],position);
    }

    this.animate = function(name,toAnimate,time){
        // debugger;
        return new Promise(function(resolve, reject) {
            var tweenables = {};
            if (toAnimate.alpha != undefined && toAnimate.alpha != null) {
                tweenables.alpha = toAnimate.alpha;
            }
            if (toAnimate.angle != undefined && toAnimate.angle != null) {
                tweenables.angle = toAnimate.angle;
            }
            if (toAnimate.position != undefined && toAnimate.position != null) {
                tweenables.x = toAnimate.position.x;
                tweenables.y = toAnimate.position.y;
            }
            if (toAnimate.zoom != undefined && toAnimate.zoom != null){
                if (!this.cgs[name].originalScale){
                    this.cgs[name].originalScale = {width:this.cgs[name].width , height:this.cgs[name].height}
                }
                tweenables.height = this.cgs[name].originalScale.height*toAnimate.zoom;
                tweenables.width = this.cgs[name].originalScale.width*toAnimate.zoom;
            }
            this.current[name] = {...this.current[name],...toAnimate};
            var resolveFunction = resolve
            if (toAnimate.spritesheet){
                if (toAnimate.spritesheet == "stop"){
                    this.cgs[name].animations.stop();
                    this.cgs[name].frame = 0;
                } else {
                    str = toAnimate.spritesheet.split(" ");
                    animName = str[0];
                    looped = str.length > 1 && str[1] == "looped";
                    this.cgs[name].animations.play(animName,null,looped);
                    resolveFunction = function(){
                        RenJS.cgsManager.cgs[name].animations.stop();
                        RenJS.cgsManager.cgs[name].frame = 0;
                        resolve()
                    }
                }
            }
            if(!time){
                // stopping animation or looped animation
                return resolve();
            }

            // if (toAnimate.zoom != undefined && toAnimate.zoom != null) {
            //     RenJS.tweenManager.parallel([
            //         {sprite:this.cgs[name],tweenables:tweenables},
            //         {sprite:this.cgs[name].scale,tweenables:{x:toAnimate.zoom,y:toAnimate.zoom},callback:resolve},
            //     ],time);
            // } else {

                RenJS.tweenManager.tween(this.cgs[name],tweenables,resolveFunction,time,true);
            // }
        }.bind(this));
    }

    this.hide = function(name,transition){
        return new Promise(function(resolve, reject) {
            transition(this.cgs[name],null).then(function(){
                RenJS.cgsManager.cgs[name].destroy();
                delete RenJS.cgsManager.cgs[name];
                delete RenJS.cgsManager.current[name];
                resolve();
            })
        }.bind(this));
    }

    this.hideAll = function(transition){
        if (!transition) transition = 'FADEOUT'
        return new Promise(function(resolve,reject){
            var promises = []
            for (const cg in RenJS.cgsManager.cgs) {
              promises.push(RenJS.cgsManager.hide(cg,RenJS.transitions[transition]));
            }
            Promise.all(promises).then(resolve);
        });
    }

    this.isCGS = function(actor){    
        return actor in this.cgs;
    }
}

