
function refreshTree(){
  let tree = [
    {
      text: "  Assets",
      icon: "fas fa-pencil-alt",
      selectable: false,
      nodes: [
        // { 
        //   text: "  New",
        //   icon: "fas fa-plus",
        //   window: "newAssetWindow"
        // }
      ]
    },
    {
      text: "  Characters",
      icon: "fas fa-child",
      selectable: false,
      nodes: [
        { 
          text: "  New",
          icon: "fas fa-plus",
          window: "newCharacterWindow"
        }
      ]
    },
    {
      text: "  Backgrounds",
      icon: "fas fa-mountain",
      selectable: false,
      nodes: [
        { 
          text: "  New",
          icon: "fas fa-plus",
          window: "newBackgroundWindow"
        }
      ]
    },
    {
      text: "  CGs",
      icon: "fas fa-star",
      selectable: false,
      nodes: [
        { 
          text: "  New",
          icon: "fas fa-plus",
          window: "newCGSWindow"
        }
      ]
    },
    // {
    //   text: "  Music & Audio",
    //   icon: "fas fa-music"
    // },
  ];
  for (let asset in editor.assets){
    tree[0].nodes.push({text:asset,name:asset,gameType:'assets'});
  }

  for (let char in editor.characters){
    tree[1].nodes.push({text:char,name:char,gameType:'characters'});
  }

  for (let bg in editor.backgrounds){
    tree[2].nodes.push({text:bg,name:bg,gameType:'backgrounds'});
  }

  $('#component-tree').treeview({
    data: tree,
    onNodeSelected: function(event, data) {
      if (data.window){
        windows[data.window].open();
      } else {
        createWindow(data);
      }
    }
  });
}

let previewContentFactory = {
  assets: (name)=>{
    const preview = $("#asset-preview").clone().prop('id', "");
    preview.find(".img-preview").attr('src', editor.assets[name].img);
    preview.find(".asset-tag").val(name);
    return preview;
  },
  characters: (name)=>{
    const char = editor.characters[name];
    const preview = $("#character-preview").clone().prop('id', "");
    if (char.asset!='none'){
      preview.find(".look-preview").attr('src', editor.assets[char.asset].img);
    }
    preview.find(".char-tag").val(name);
    preview.find(".char-name").val(char.displayName);
    preview.find(".char-color").val(char.speechColour);

    preview.find('.asset-select').on('change',function(e){
      const asset = $(this).val();
      if (asset == 'none') {
        preview.find(".look-preview").attr('src',"");
      } else {
        preview.find(".look-preview").attr('src', editor.assets[asset].img);
      }
    });
    return preview;
  },

  backgrounds: (name)=>{
    const preview = $("#background-preview").clone().prop('id', "");
    preview.find(".bg-preview").attr('src', editor.assets[editor.backgrounds[name].asset].img);
    preview.find('.asset-select').on('change',function(e){
      const asset = $(this).val();
      preview.find(".bg-preview").attr('src', editor.assets[asset].img);
    });
    return preview;
  },

  cgs: (name)=>{
    const preview = $("#background-preview").clone().prop('id', "");
    preview.find(".bg-preview").attr('src', editor.assets[editor.cgs[name].asset].img);
    preview.find('.asset-select').on('change',function(e){
      const asset = $(this).val();
      preview.find(".bg-preview").attr('src', editor.assets[asset].img);
    });
    return preview;
  },

}

let elementProperties = {
  characters: {displayName:'char-name',speechColour:"char-color",asset:'asset-select'},
  backgrounds: {asset:'asset-select'},
  cgs: {asset:'asset-select'},
}

function createWindow(data){
  let content = previewContentFactory[data.gameType](data.name);
  let win = new jBox('Modal', {
    appendTo: '#workspace',
    target: '#workspace',
    closeButton: 'title',
    width: 'auto',
    title: data.name,
    overlay: false,
    position: {x: 'left', y: 'top'},
    content: content,
    draggable: 'title',
    repositionOnOpen: false,
    repositionOnContent: false,
    responsiveWidth: true,
    responsiveHeight: true,
    onCloseComplete: ()=>{
      win.destroy();
    }
  });

  content.find(".remove-btn").click(function(){
    delete editor[data.gameType][data.name];
    if (data.gameType=='assets'){
      $(`.asset-${data.name}`).remove();
    }
    win.close();
    refreshTree();    
  });

  content.find(".update-btn").click(function(){
    for (let prop in elementProperties[data.gameType]){
      const element = elementProperties[data.gameType][prop]; 
      editor[data.gameType][data.name][prop] = content.find("."+element).val();
    }
    refreshTree();
  });

  win.open();
}


function createAssetToolbox(){

  const win = new jBox('Modal', {
    appendTo: '#workspace',
    target: '#workspace',
    closeButton: 'title',
    width: 'auto',
    title: "New Asset",
    overlay: false,
    position: {x: 'left', y: 'top'},
    content: $("#asset-toolbox"),
    draggable: 'title',
    repositionOnOpen: false,
    repositionOnContent: false,
    responsiveWidth: true,
    responsiveHeight: true,
    onClose: function(){
      // cleanup window
      $('#asset-input').val("");
      $('#img-preview').attr('src', "");
      // $('#uploaded-asset').hide();
    }
  });

  let lastUpload = null;

  $('#asset-input').on('change',function(e){
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function(){
        lastUpload = reader.result;
        $('#img-preview').attr('src', reader.result);
        // $('#asset-tag').val(e.target.files[0].name.replace(/\.[^/.]+$/, ""))
        // $('#uploaded-asset').show();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  $("#save-asset-btn").click(function(){
    addAsset(lastUpload);
  });

  window.addEventListener("message",  (event) => {
    console.log(event.data)
    if (event.data.port){
      // requesting guys
      event.data.port.postMessage({ requestGuys: true });
      event.data.port.onmessage = async (e)=>{
        
        const img = await resizedataURL(e.data.dataURI, 256, 256) ;
        addAsset(img);
      }
    } 
  });
 
  
  return win;
}

function addAsset(img){
    new jBox('Notice', {
      target: '#workspace',
      appendTo: '#workspace',
      content: 'New asset added!',
      color: 'blue',
      autoClose: 1000,
      attributes: {
        x: 'center',
        y: 'top'
      },
      position: {
        x: 150,
        y: 150
      },
      animation: 'tada'
    })
    const name = "asset_"+Date.now().toString().substr(8,5);
    editor.assets[name] = {name, img};
    $('.asset-select').append(`<option class="asset-${name}">${name}</option>`)
    refreshTree();
}

function createCharacterToolbox(){

  $('#char-asset-select').on('change',function(e){
    const asset = $(this).val();
    if (asset == 'none') {
      $('#look-preview').attr('src',"");
    } else {
      $('#look-preview').attr('src', editor.assets[asset].img);
    }
  });


  const win = new jBox('Modal', {
    appendTo: '#workspace',
    target: '#workspace',
    closeButton: 'title',
    width: 'auto',
    title: "New Character",
    overlay: false,
    position: {x: 'left', y: 'top'},
    content: $("#character-toolbox"),
    draggable: 'title',
    repositionOnOpen: false,
    repositionOnContent: false,
    responsiveWidth: true,
    responsiveHeight: true,
    onClose: function(){
      // cleanup window
      $('#char-tag').val("");
      $('#char-name').val("");
      $('#char-color').val("#FFFFFF");
      $('#char-asset-select').val("none");
      $('#look-preview').attr('src', "");
      // $('#uploaded-asset').hide();
    }
  });

  $("#save-char-btn").click(function(){
    $('#char-tag').removeClass("is-invalid");
    const name = $('#char-tag').val();
    if (editor.characters[name] || name.includes(" ") || name==""){
      $('#char-tag').addClass("is-invalid");
      return;
    }
    editor.characters[name] = {
      name: name, 
      displayName: $('#char-name').val(), 
      asset: $('#char-asset-select').val(),
      speechColour:$('#char-color').val()
    };
    refreshTree();
    win.close();
    
  });

  return win;
}

function createBackgroundToolbox(){

  $('#bg-asset-select').on('change',function(e){
    const asset = $(this).val();
    $('#bg-preview').attr('src', editor.assets[asset].img);
  });


  const win = new jBox('Modal', {
    appendTo: '#workspace',
    target: '#workspace',
    closeButton: 'title',
    width: 'auto',
    title: "New Background",
    overlay: false,
    position: {x: 'left', y: 'top'},
    content: $("#background-toolbox"),
    draggable: 'title',
    repositionOnOpen: false,
    repositionOnContent: false,
    responsiveWidth: true,
    responsiveHeight: true,
    onClose: function(){
      // cleanup window
      $('#bg-tag').val("");
      $('#bg-asset-select').val("");
      $('#bg-preview').attr('src', "");
    }
  });

  $("#save-bg-btn").click(function(){
    $('#bg-tag').removeClass("is-invalid");
    const name = $('#bg-tag').val();
    if (editor.backgrounds[name] || name.includes(" ") || name==""){
      $('#bg-tag').addClass("is-invalid");
      return;
    }
    editor.backgrounds[name] = {name: name, asset: $('#bg-asset-select').val()};
    win.close();
    refreshTree();
  });

  return win;
}

function createCGToolbox(){

  $('#cg-asset-select').on('change',function(e){
    const asset = $(this).val();
    $('#cg-preview').attr('src', editor.assets[asset].img);
  });


  const win = new jBox('Modal', {
    appendTo: '#workspace',
    target: '#workspace',
    closeButton: 'title',
    width: 'auto',
    title: "New CG",
    overlay: false,
    position: {x: 'left', y: 'top'},
    content: $("#cg-toolbox"),
    draggable: 'title',
    repositionOnOpen: false,
    repositionOnContent: false,
    responsiveWidth: true,
    responsiveHeight: true,
    onClose: function(){
      // cleanup window
      $('#cg-tag').val("");
      $('#cg-asset-select').val("");
      $('#cg-preview').attr('src', "");
    }
  });

  $("#save-bg-btn").click(function(){
    $('#cg-tag').removeClass("is-invalid");
    const name = $('#cg-tag').val();
    if (editor.backgrounds[name] || name.includes(" ") || name==""){
      $('#cg-tag').addClass("is-invalid");
      return;
    }
    editor.cgs[name] = {name: name, asset: $('#cg-asset-select').val()};
    win.close();
    refreshTree();
  });

  return win;
}


function saveWorkspace(){
  $('#save-btn').html('<i class="fas fa-save"></i> Saving!');
  setTimeout(()=>{
    $('#save-btn').html('<i class="fas fa-save"></i> Save');
  },1000);

  let gameName = $('#game-name-input').val();
  if (!gameName){
    gameName = "game_"+Date.now();
    $('#game-name-input').val(gameName)
  }

  editor.story = codeEditor.getValue();
  editor.name = gameName;
  // console.log(editor);
  const stringEditor = JSON.stringify(editor);
  // console.log("normal size "+stringEditor.length)

  const compressed = LZString.compress(stringEditor);
  // console.log("compressed size "+compressed.length)
  
  saveToLocalstorage(gameName,compressed)
}

function restoreWorkspace(){
  const compressed = localStorage.getItem('RenJSOnlineThingy');
  if (!compressed) return;
  const stringEditor = LZString.decompress(compressed);
  if (!stringEditor){
    return;
  }
  editor = JSON.parse(stringEditor);

  codeEditor.setValue(editor.story);
  $('#game-name-input').val(editor.name);
  // add assets to assets lists
  for (let asset in editor.assets){
    $('.asset-select').append(`<option class="asset-${asset}">${asset}</option>`)
  }
  
  refreshTree();
}

function saveToLocalstorage(name,content){
  // update games list
  // let list = localStorage.getItem('RenJSOnlineThingy_List');
  // list = list ? JSON.parse(list) : [];
  // if (!list.includes(name)){
  //   list.push(name);
  // }
  // localStorage.setItem('RenJSOnlineThingy_List', JSON.stringify(list));
  // // save game
  // localStorage.setItem('RenJSOnlineThingy_'+gameName, content);
  localStorage.setItem('RenJSOnlineThingy', content);
}

function getMimeType(base64){
  return base64.match(/[^:/]\w+(?=;|,)/)[0];
}


async function readTemplate(file){
  return new Promise(resolve=>{
    $.ajax({
      url: file,
      type: 'get',
      dataType: 'text',
      async: false,
      success: function(html) {
        resolve(html);
      }
    });
  });
}

async function loadZip(file,folder){
  return new Promise(resolve=>{
         // loading a zip file
    JSZipUtils.getBinaryContent(file, function (err, data) {
       if(err) {
          throw err; // or handle the error
       }
       folder.loadAsync(data).then(resolve)
       // resolve(data)
       // var zip = new JSZip(data);
    });
  })
 
}

function saveAsset(assetId,folder){
  const assetName = assetId+"."+getMimeType(editor.assets[assetId].img);
  const rawData = editor.assets[assetId].img.replace(/^data:image\/(png|jpg);base64,/, "")
  folder.file(assetName,rawData,{base64:true});
  return assetName;
}

async function exportRenJSGame(){
  saveWorkspace()

  const zip = new JSZip();
  zip.file("index.html", await readTemplate('templates/index.html'));
  zip.file("boot.js", await readTemplate('templates/boot.js'));

  const assetsFolder = zip.folder("assets");

  await loadZip("templates/gui.zip",assetsFolder)

  const characterFolder = assetsFolder.folder("characters");

  const setupObject = {characters:{},backgrounds:{},cgs:{}}

  for (let character in editor.characters){
    setupObject.characters[character] = {
      displayName: editor.characters[character].displayName,
      speechColour: editor.characters[character].speechColour
    }
    if (editor.characters[character].asset!='none'){
      const assetName = saveAsset(editor.characters[character].asset,characterFolder)
      setupObject.characters[character].looks = {normal: "assets/characters/"+assetName}
    }
  }

  const backgroundFolder = assetsFolder.folder("backgrounds");

  for (let bg in editor.backgrounds){
    const assetName = saveAsset(editor.backgrounds[bg].asset,backgroundFolder)
    setupObject.backgrounds[bg] = "assets/backgrounds/"+assetName;
  }

  const cgsFolder = assetsFolder.folder("cgs");

  for (let cgs in editor.cgs){
    const assetName = saveAsset(editor.cgs[cgs].asset,cgsFolder)
    setupObject.cgs[cgs] = "assets/cgs/"+assetName;
  }



  var storyFolder = zip.folder("story");

  storyFolder.file('Story.yaml',codeEditor.getValue());
  storyFolder.file('Setup.yaml',jsyaml.dump(setupObject));

  storyFolder.file('Config.yaml',await readTemplate('story/Config.yaml'));
  storyFolder.file('GUI.yaml',await readTemplate('story/GUI.yaml'));

  zip.generateAsync({type:"blob"})
  .then(function (blob) {
      saveAs(blob, editor.name+".zip");
  });

}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    window.codeEditor = CodeMirror(document.getElementById('code-container'), {
      // value: "asd: qwer",
      value: "start:",
      mode:  "yaml",
      lineWrapping: true,
      theme: 'ambiance',
      lineNumbers: true,
      scrollPastEnd: true,
      extraKeys: {
        "Tab": function(cm){
          cm.replaceSelection("  " , "end");
        }
       }
      // scrollbarStyle: 'simple'
    });

    $('#save-btn').on('click', function () {
        saveWorkspace();
    });

    $('#export-btn').on('click', function () {
        exportRenJSGame();
    });

    document.onkeydown = function(e) {
      if (e.ctrlKey && e.keyCode === 83) {
          saveWorkspace();
          return false;
      }
  };



    $("#playtest-btn").click(function(){
      $('#playtest-modal').modal('show');
      launchGame();
    })

  $("#story-btn").click(function(){

    if ($(this).hasClass("btn-secondary")){
      // codeEditor.setValue(RenJSGame.tools.jsyaml.dump(RenJSGame.story));
      $("#flickguy-container").hide();
      $("#code-container").show();
      codeEditor.refresh();
      codeEditor.focus();
    } else {
      $("#code-container").hide();
    }

    toggleBtn("story-btn",true);
    toggleBtn("gui-btn",false);
    toggleBtn("assets-btn",false);
  })

  $("#assets-btn").click(function(){

    if ($(this).hasClass("btn-secondary")){
      $("#code-container").hide();
      $("#flickguy-container").show();
    } else {
      $("#flickguy-container").hide();
    }


    toggleBtn("gui-btn",false);
    toggleBtn("story-btn",false);
    toggleBtn("assets-btn",true);
  })

  function toggleBtn(btn,show){
    if($(`#${btn}`).hasClass('btn-primary') || show){
      $(`#${btn}`).toggleClass("btn-secondary");
      $(`#${btn}`).toggleClass("btn-primary");
      $(`#${btn}`).find(".visibility").toggleClass("fa-eye");
      $(`#${btn}`).find(".visibility").toggleClass("fa-eye-slash");
    }
  }

  $('#playtest-modal').on('hidden.bs.modal', function () {
    RenJSGame.destroy();
  })

  windows = {
    newAssetWindow: createAssetToolbox(),
    newCharacterWindow: createCharacterToolbox(),
    newBackgroundWindow: createBackgroundToolbox(),
    newCGSWindow: createCGToolbox(),
  }

  editor = {
    assets: {},
    characters: {},
    backgrounds: {},
    cgs: {}
  }

  refreshTree();

  restoreWorkspace();

});


function resizedataURL(base64Str, width = 256, height = 256) {
  return new Promise((resolve) => {
    let img = new Image()
    img.src = base64Str
    img.onload = () => {
      let canvas = document.createElement('canvas')
      canvas.style['image-rendering'] = 'pixelated';
      canvas.width = width
      canvas.height = height
      let ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL())
    }
  })
}