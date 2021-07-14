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
  'scaleMode': Phaser.ScaleManager.NO_SCALE,
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

const RenJSGame = new RenJS.game(RenJSConfig)
RenJSGame.launch()
