window.copyLink = function copy() {
  var copyText = document.querySelector("#cdn-link");
  copyText.value = "https://cdn.jsdelivr.net/gh/lunafromthemoon/RenJS-V2@master/dist/renjs.min.js";
  copyText.select();
  document.execCommand("copy");
}

window.copyTag = function copy() {
  var copyText = document.querySelector("#cdn-link");
  copyText.value = '<script src="https://cdn.jsdelivr.net/gh/lunafromthemoon/RenJS-V2@master/dist/renjs.min.js"></script>';
  copyText.select();
  document.execCommand("copy");
}



$(document).ready(function() {
	new Splide( '#about-gallery', {drag   : false,type   : 'loop',autoplay: true, interval: 10000} ).mount();

  new Splide( '#games-gallery', {
    type   : 'loop',
    width  : '70%',
    gap: 15,
    pagination: false,
    autoplay: true, interval: 3000,
    // height : '8rem',
    arrows:false,
    perPage: 3,
    rewind : true,
    perMove: 1,
    // cover      : true,
    autoWidth: true,
    // focus    : 'center',
  } ).mount();

	$(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    }); 

  $('#gui-builder-version').on('change',()=>{
    const version = $('#gui-builder-version').val();
    const files = {
      linux: "https://siasky.net/AACIhuB8XwriSWhNGrKWALde1LTV_tsPpm1J883fOkFtbA",
      win32: "https://siasky.net/AABUZS5oywILpfDTjYel3wPdNgSMCTiaDITTo6e-0q_exA",
      win64: "https://siasky.net/AADZtrzcBY6vplyPecsaf57-520pvAdGt_USv5cR87SoVg",
    }
    $("#download-gui-builder").attr("href", files[version]);
  })
});


