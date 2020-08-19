var preload = {

  init: createLoadingPage,
  // function () {
  //   //TODO: LOAD RENJS OWN SPLASH SCREEN
  //   this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
  //   this.splash.anchor.set(0.5);
  //   if (globalConfig.splash.loadingBar) {
  //       var position = globalConfig.splash.loadingBar.position;
  //       this.loadingBar = game.add.sprite(position.x,position.y , "loading");
  //       if (this.loadingBar.animations.frameTotal > 1){
  //           // load second frame as full bar
  //           this.loadingBar = game.add.sprite(position.x,position.y , "loading",1);
  //       }
  //   }
  // },

  preload: function () {
    this.load.setPreloadSprite(this.loadingBar);
    //load external libraries
    game.load.script('esprima',  'libs/esprima.js');
    game.load.script('yaml',  'libs/js-yaml.min.js');
    // game.load.script('underscore',  'libs/underscore-min.js');
    //load RenJS
    game.load.script('Defaults',  'RenJS/Defaults.js');
    game.load.script('RenJSBuilderMadeGUI',  'RenJS/RenJSBuilderMadeGUI.js');
    game.load.script('SimpleGUI',  'RenJS/SimpleGUI.js');
    game.load.script('AudioManager',  'RenJS/AudioManager.js');
    game.load.script('BackgroundManager',  'RenJS/BackgroundManager.js');
    game.load.script('CGSManager',  'RenJS/CGSManager.js');
    game.load.script('CharactersManager',  'RenJS/CharactersManager.js');
    game.load.script('LogicManager',  'RenJS/LogicManager.js');
    game.load.script('TextManager',  'RenJS/TextManager.js');
    game.load.script('TweenManager',  'RenJS/TweenManager.js');
    game.load.script('StoryManager',  'RenJS/StoryManager.js');
    game.load.script('RenJS',  'RenJS/RenJS.js');
    game.load.script('Effects',  'RenJS/Effects.js');
    game.load.script('Ambient',  'RenJS/Ambient.js');
    game.load.script('Transitions',  'RenJS/Transitions.js');
    game.load.script('CustomContent',  'RenJS/CustomContent.js');
    //load Story Files
    loadStyle(preparePath(globalConfig.fonts));
    game.load.text("guiConfig", preparePath(globalConfig.guiConfig));
    game.load.text("storySetup", preparePath(globalConfig.storySetup));
    for (var i = globalConfig.storyText.length - 1; i >= 0; i--) {
      game.load.text("story"+i, preparePath(globalConfig.storyText[i]));
    };
  },

  create: function () {
    //load the setup
    RenJS.setup = jsyaml.load(game.cache.getText("storySetup"));
    //load the story text
    var story = {};
    globalConfig.storyText.forEach((file,index) => {
        var text = jsyaml.load(game.cache.getText("story"+index));
        story = {...story,...text};
    },this)
    RenJS.story = story;  
    //load and create the GUI
    var gui = jsyaml.load(game.cache.getText("guiConfig"));
    console.log(gui)
    if (gui.madeWithRenJSBuilder){
        RenJS.gui = new RenJSBuilderMadeGUI(gui);
    } else {
        RenJS.gui = new SimpleGUI(gui);
    }
    
    //preload the fonts by adding text, else they wont be fully loaded :\
    for (const font of RenJS.gui.getFonts()){
        game.add.text(20, 20, font, {font: '42px '+font});
    }
    //start preloading story
    game.state.add('preloadStory', preloadStory);
    game.state.start('preloadStory');
  }
}

var preloadStory = {
  init: createLoadingPage,
  // function () {
  //   this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
  //   this.splash.anchor.set(0.5);
  //   if (globalConfig.splash.loadingBar) {
  //       var position = globalConfig.splash.loadingBar.position;
  //       this.loadingBar = game.add.sprite(position.x,position.y , "loading");
  //   }
  // },

  preload: function () {
    this.load.setPreloadSprite(this.loadingBar);
    //preload gui
    for(const asset of RenJS.gui.getAssets()){
        if (asset.type == "spritesheet"){
            game.load.spritesheet(asset.key, preparePath(asset.file), asset.w, asset.h);
        } else {
            game.load[asset.type](asset.key, preparePath(asset.file));
        }
    };

    //preload backgrounds
    for (const background in RenJS.setup.backgrounds){
        var str = RenJS.setup.backgrounds[background].split(" ");
        if (str.length == 1){
            game.load.image(background, preparePath(str[0]));
        } else {
            game.load.spritesheet(background, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
        }
    };
    //preload cgs
    for (const key in RenJS.setup.cgs){
        var cgs = RenJS.setup.cgs[key];
        if (typeof cgs === 'string' || cgs instanceof String){
            // normal cgs
            game.load.image(key, preparePath(cgs));
        } else {
            // spritesheet animation      
            var str = cgs.spritesheet.split(" ");            
            game.load.spritesheet(key, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
        }
    };
    // preload background music
    for (const music in RenJS.setup.music){
        game.load.audio(music, preparePath(RenJS.setup.music[music]));
    }
    //preload sfx
    for (const sfx in RenJS.setup.sfx){
        game.load.audio(sfx, preparePath(RenJS.setup.sfx[sfx]));
    }
    //preload characters
    for (const name in RenJS.setup.characters){
        var char = RenJS.setup.characters[name];
        for (const look in char.looks){
            game.load.image(name+"_"+look, preparePath(char.looks[look]));
        }
    }
    if (RenJS.setup.extra){
        for (const type in RenJS.setup.extra){
            for (const asset in RenJS.setup.extra[type]){
                if (type == 'spritesheets') {
                    var str = RenJS.setup.extra[type][asset].split(" ");
                    game.load.spritesheet(asset, preparePath(str[0]), parseInt(str[1]),parseInt(str[2]));
                } else {
                    game.load[type](asset, preparePath(RenJS.setup.extra[type][asset]));
                }
            }
        }
    }
  },

  create: function() {
    //init game and start main menu
    game.state.add('init', init);
    game.state.start('init');
  }
}

var init = {
  create:function(){            
    RenJS.storyManager.setupStory();
    RenJS.gui.init();
    RenJS.initInput();
    RenJS.audioManager.init(function(){
        RenJS.gui.showMenu("main");    
    });
  },

  render: function() {

  }
}

//utils

function createLoadingPage() {
    this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
    this.splash.anchor.set(0.5);
    if (globalConfig.splash.loadingBar) {
        var position = globalConfig.splash.loadingBar.position;
        this.loadingBar = game.add.sprite(position.x,position.y , "loading");
        if (this.loadingBar.animations.frameTotal > 1){
            // load second frame as full bar
            this.loadingBar = game.add.sprite(position.x,position.y , "loading",1);
        }
    }
}

function loadStyle(href, callback){
    // avoid duplicates
    for(var i = 0; i < document.styleSheets.length; i++){
        if(document.styleSheets[i].href == href){
            return;
        }
    }
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    if (callback) { link.onload = function() { callback() } }
    head.appendChild(link);
}