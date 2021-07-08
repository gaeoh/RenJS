
const RenJSConfig =  {
  'w': 512,
  'h': 384,
  parent: 'test-game',
  'guiConfig': 'story/GUI.yaml',
  'storySetup': 'story/Setup.yaml',
  'storyConfig': 'story/Config.yaml',
  'storyText': [
    'story/Story.yaml'
  ],
  'name': "flick3",
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
  "loadingBar": {
    "asset": "assets/gui/loaderasset2.png",
    "position": {
      "x": 8,
      "y": 190
    },
    "size": {
      "w": 498,
      "h": 22
    }
  }
},
  'fonts': 'assets/gui/fonts.css'
}

let RenJSGame = null; 

function launchGame(){
  // if (RenJSGame){
  //   RenJSGame.destroy();
  // }
  RenJSGame = new RenJS.game(RenJSConfig)
  RenJSGame.launch()


  class LoadStoryText extends RenJS.Plugin {

    onInit(params) {
      // replace story text
      this.game.story = this.game.tools.jsyaml.load(codeEditor.getValue());

      // add characters and assets?
      for (let character in editor.characters){
        if (editor.characters[character].asset!='none'){
          this.game.load.image(character+"_normal", editor.assets[editor.characters[character].asset].img);
        }
        
      }
      const bgConfig = {};
      for (let bg in editor.backgrounds){
        this.game.load.image(bg, editor.assets[editor.backgrounds[bg].asset].img);
        bgConfig[bg] = "";
      }

      this.game.load.onLoadComplete.addOnce(()=>{
        this.game.setup.characters = editor.characters;
        this.game.managers.character.loadCharacters();

        this.game.setup.backgrounds = editor.backgrounds;
        this.game.managers.background.backgrounds = bgConfig;
      }, this);
      this.game.load.start();
    }
  }

  RenJSGame.addPlugin('LoadStoryText',LoadStoryText)
}








// $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
//   console.log(e.target)
//   if (e.target.id.includes('test')){
//     RenJSGame.story = RenJSGame.tools.jsyaml.load(codeEditor.getValue());
//     RenJSGame.input.enabled = true;
//   } else {
//     RenJSGame.input.enabled = false;
//     RenJSGame.endGame()
//   }
// })

