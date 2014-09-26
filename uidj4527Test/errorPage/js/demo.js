
// Helper function, used below.
// Usage: ['img1.jpg','img2.jpg'].remove('img1.jpg');
Array.prototype.remove = function(element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) { this.splice(i,1); }
  }
};

// Usage: $(['img1.jpg','img2.jpg']).preloadImages(function(){ ... });
// Callback function gets called after all images are preloaded
$.fn.preloadImages = function(callback) {
  checklist = this.toArray();
  this.each(function() {
    $('<img>').attr({ src: this }).load(function() {
      checklist.remove($(this).attr('src'));
      if (checklist.length == 0) { callback(); }
    });
  });
};


function preloadAllImages () {
	$(['images/home_button_pressed.png']).preloadImages(function(){
            // all images are pre loaded
    });
}

/**
 * do some initital stuff	
 */
$(document).ready(function() {
   preloadAllImages();
});

   

/**
 * Call to the native audio player
 */
function back_clicked() {
	jsDevApi.log("call native audio player");
	jsDevApi.requestNativeAudioPlayer(); 
	jsDevApi.log("called native audio player");
}


