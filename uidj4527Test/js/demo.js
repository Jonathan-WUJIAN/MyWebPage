var isPausedState      = 0;            // 1: pause mode active

var isRepeatOn  	   = 0;   		   // 1: repeat mode active

var isShuffleOn 	   = 0;   		   // 1: shuffle button active

//var isBackwardOn           = 0;

var showPopup   	   = 0;   		   // 1: show source popup window

var showBrowserScreen  = 0;   		   // 1: show browser screen - hide the audio player screen

var showSettingsScreen = 0;            // 1: show settings screen - hide the audio player screen

var playedIndex 	   = -1;  		   // holds the index of the before played item

var playingIndex 	   = -1;  		   // holds the index of the playing item

var playingItem 	   = -1;  		   // selected item in current tracklist

var jsonData           = new Array();  // holds the meta data info for the tracklist

var oNativeDevApi;                     // access to the CJsDeviceApi

var jsonDataLyrics  = new Array(); //uidj4527



var isCloudBrowsingActive = 1;        // 1: cloud mode 0: file mode

var audioElement;					  // reference object to the Javascript Audio API	



var LAST_PLAYED_INDEX      = "lastPlayedIndex";    // localstorage key which holds the last played list index from Dropbox playback

var DROPBOX_PATH           = "DropboxPath";        // localstorage key which holds the dropbox media directory

var DROPBOX_DEFAULT_PATH   = "";                   // localstorage value which holds the default dropbox media directory for synchronisation



var PLAYMODE_INTERNAL_STORAGE  = 0;

var PLAYMODE_CLOUD             = 1;

 

var PLAYMODE               = "Playmode"            // localstorage key for playmode (val=1:Cloud val=0:Internal storage)

var PLAYMODE_DEFAULT       = PLAYMODE_CLOUD;       // localstorage value which holds Source Type playmode (val=1:Cloud val=0:Internal storage)



var CONTINUOUS_PLAY           = "ContinuousPlay";     // localstorage key for continuous play 

var CONTINUOUS_PLAY_DEFAULT   = 1;                    // localstorage value for continuous play (val=1:on val=0:off)



var DROPBOX_SYNC_USAGE           = "UseDropbox";     // localstorage key for synchronization mode 

var DROPBOX_SYNC_USAGE_DEFAULT   = 0;                // localstorage value for ynchronization mode (val=1:Dropbox val=0:Web Server)


//uidj4527 test

//var DROPBOX__SYNC_URL        = "/cloudplayerOIP/mediaplayer/dummyCloud/FullSync.php?userid=";

//var DROPBOX__DELTA_SYNC_URL  = "/cloudplayerOIP/mediaplayer/dummyCloud/DeltaSync.php?userid=";

var DROPBOX__SYNC_URL        = "http://wujian1404.hostfreeweb.net/dummyCloud/FullSync.php?userid=";

var DROPBOX__DELTA_SYNC_URL  = "http://wujian1404.hostfreeweb.net/dummyCloud/DeltaSync.php?userid=";

//var DROPBOX__SYNC_URL        = "file:///usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/FullSync.php?userid=";

//var DROPBOX__DELTA_SYNC_URL  = "file:///usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/DeltaSync.php?userid=";

//var DROPBOX__SYNC_URL        = "http://212.77.190.201/cloudplayerOIP/mediaplayer/dummyCloud/FullSync.php?userid=";

//var DROPBOX__DELTA_SYNC_URL  = "http://212.77.190.201/cloudplayerOIP/mediaplayer/dummyCloud/DeltaSync.php?userid=";

//var DROPBOX__SYNC_URL        = "FullSync.php?userid=";

//var DROPBOX__DELTA_SYNC_URL  = "DeltaSync.php?userid=";

//var DROPBOX__SYNC_URL        = "http://192.168.1.1/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/FullSync.php?userid=";

//var DROPBOX__DELTA_SYNC_URL  = "http://192.168.1.1/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/DeltaSync.php?userid=";

var DROPBOX__TIMEOUT_SYNC  				   = 1000000;

var AUDISCROBBLER__LAZY_IMAGE_LOAD_TIMEOUT = 80000;



var selectedSourceID;



var myScroll;						// object for the main scroll list



var durationSet = false;



var USE_DROPBOX_CLOUD = false;      // flag which signalizes if Dropbox (0) or a web directory will be used for the synchronization

var USER_ID         = "UserID";     // unique id gets generated once and will be stored into localstorage

var myUserId;                       // user id



var browserWindowIsShown = false;   // true: the application gets shown from HMIMaster false: if laying invisible in background



var cursorPositionMainTrackList = 0;

var scrollListYValue = 0;

var showSongLyricsTextBox = 0; // 1: show song lyrics; 0: hide song lyrics

var changeMainWindowBackground = 0;

var update_confirm_dialog_show = 0;

var new_theme_selected = 0;

var test1_state = 0;

var test2_state = 0;

var recover_default_theme = 0;

var another_theme = 0;

var first_theme = 1;

var song_name = ""; //uidj4527

var songUrl = "";

var song_lyrics = "";

var song_title = "";

var lyrics_content = "";

var lyrics_visible = 0;

var button_theme_clicked = 0;
var button_update_clicked = 0;
/**

 * Generates a timestamp [minutes:seconds] out of milliseconds

 */

function convertTimeStamp(milliseconds) {

  

  // Determine the minutes and seconds portions of the time.

  var seconds = milliseconds / 1000;

  var m = Math.floor(seconds/60);

  var s = Math.round(seconds - (m * 60));



  // Add leading zeros to one-digit numbers.

  if (s < 10) {

    s = "0" + s;

  }

  return m + ":" + s;

}





/**

 * Removes all localstorage keys which hold metadata information for a dropbox audio track

 * Gets called at every full sync process 

 */

function clearAllTracksFromLocalStorage()

{

	 length = localStorage.length-1;

	 for (var i=0; i<=length; i++) {  

			key = localStorage.key(i);  

		    

		    if (key!=null) {

			    index = key.indexOf($('#dropbox_inputfield_path').val());

			    

			    if (index==0)

				{

					localStorage.removeItem(key);

				}

			}

		}

}





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







/**

 * String helper function

 */

String.prototype.truncate = function(length) {

	if (this.length > length) {

	    return this.slice(0, length - 3) + "...";

	} else {

	    return this;

	  }

};





/**

 * String helper function

 */

function truncme(str, length) {

	if (str.length > length) {

	    return str.slice(0, length - 3) + "...";

	} else {

	    return str;

	  }

};



function preloadAllImages () {

	$(['images/repeat_pressed.png', 

	   'images/play_pressed.png',

	   'images/forward_pressed.png',

	   'images/backward_pressed.png',

	   'images/browse_pressed.png',

	   'images/browser_album_normal.png',

	   'images/gen_popup_cursor_350_normal.png',

	   'images/browser_album_pressed.png',

	   'images/browser_album_selected.png',

	   'images/browser_artists_pressed.png',

	   'images/browser_artists_selected.png',

	   'images/browser_exit_pressed.png',

	   'images/browser_folders_pressed.png',

	   'images/browser_folders_selected.png',

	   'images/browser_genres_pressed.png',

	   'images/browser_genres_selected.png',

	   'images/browser_internal_selected.png',

	   'images/browser_tracks_selected.png',

	   'images/browser_tracks_pressed.png',

	   'images/gen_list_cursor_pressed.png',

	   'images/home_button_pressed.png',

	   'images/repeat_active_pressed.png',

	   'images/shuffle_active_pressed.png',

	   'images/source_cd_pressed.png',

	   'images/repeat_pressed.png',

	   'images/source_internal_storage_pressed.png',

	   'images/source_sdcard_pressed.png',

	   'images/source_usb_pressed.png',

	   'images/settings_pressed.png',

	   'images/browser_usb_pressed.png',

	   'images/browser_sdcard_pressed.png',

	   'images/browser_cd_pressed.png',

	   'images/browser_internal_pressed.png',

	   'images/browser_cloud_pressed.png',

      	   'images/pause_normal.png',

	   'images/pause_pressed.png',
	   
	   'images/background_set_120x80_normal.png',

	   'images/background_set_120x80_pressed.png',
	

	   'images/song_lyrics_bg.png',

	    'images/background_set_120x60_normal.png',

	    'images/background_set_120x80_pressed.png',
	
	   'images/repeat_pressed_uidj4527.png', 

	   'images/play_pressed_uidj4527.png',

	   'images/forward_pressed_uidj4527.png',

	   'images/backward_pressed_uidj4527.png',

	   'images/browse_pressed_uidj4527.png',

	   'images/browser_album_normal_uidj4527.png',

	   'images/gen_popup_cursor_350_normal_uidj4527.png',

	   'images/browser_album_pressed_uidj4527.png',

	   'images/browser_album_selected_uidj4527.png',

	   'images/browser_artists_pressed_uidj4527.png',

	   'images/browser_artists_selected_uidj4527.png',

	   'images/browser_exit_pressed_uidj4527.png',

	   'images/browser_folders_pressed_uidj4527.png',

	   'images/browser_folders_selected_uidj4527.png',

	   'images/browser_genres_pressed_uidj4527.png',

	   'images/browser_genres_selected_uidj4527.png',

	   'images/browser_internal_selected_uidj4527.png',

	   'images/browser_tracks_selected_uidj4527.png',

	   'images/browser_tracks_pressed_uidj4527.png',

	   'images/gen_list_cursor_pressed_uidj4527.png',

	   'images/home_button_pressed_uidj4527.png',

	   'images/repeat_active_pressed_uidj4527.png',

	   'images/shuffle_active_pressed_uidj4527.png',

	   'images/source_cd_pressed_uidj4527.png',

	   'images/repeat_pressed_uidj4527.png',

	   'images/source_internal_storage_pressed_uidj4527.png',

	   'images/source_sdcard_pressed_uidj4527.png',

	   'images/source_usb_pressed_uidj4527.png',

	   'images/settings_pressed_uidj4527.png',

	   'images/browser_usb_pressed_uidj4527.png',

	   'images/browser_sdcard_pressed_uidj4527.png',

	   'images/browser_cd_pressed_uidj4527.png',

	   'images/browser_internal_pressed_uidj4527.png',

	   'images/browser_cloud_pressed_uidj4527.png',

      	   'images/pause_normal_uidj4527.png',

	   'images/pause_pressed_uidj4527.png',
	   
	   'images/background_set_120x80_normal_uidj4527.png',

	   'images/background_set_120x80_pressed_uidj4527.png',
	   
	   'images/song_lyrics_300x300_bg.png',
	

	   'images/song_lyrics_bg_uidj4527.png',

	    'images/background_set_120x60_normal_uidj4527.png',

	    'images/background_set_120x80_pressed_uidj4527.png',
	    
	    'images/fushi_mountain.jpg',
	    
	    'images/chrismas_uidj4527.jpg']).preloadImages(function(){

            // all images are pre loaded

    });

}



function initScrollLists() {

	 var MyScrollx = new iScroll('genrelist_wrapper', { 

		checkDOMChanges: true,

		hideScrollbar: true,

		fadeScrollbar: true,

	 	scrollbarClass: 'myScrollbar' 

	 });

	 MyScrollx.scrollTo(0, 20, 0, true);

	 

	 MyScrollx = new iScroll('artistlist_wrapper', { 

		checkDOMChanges: true,

		hideScrollbar: true,

		fadeScrollbar: true,

	 	scrollbarClass: 'myScrollbar' 

	 });

	 MyScrollx.scrollTo(0, 20, 0, true);

	 

	 MyScrollx = new iScroll('albumlist_wrapper', { 

		checkDOMChanges: true,

		hideScrollbar: true,

		fadeScrollbar: true,

	 	scrollbarClass: 'myScrollbar' 

	 });

	 MyScrollx.scrollTo(0, 20, 0, true);

	 

	 MyScrollx = new iScroll('tracklist_wrapper', { 

		checkDOMChanges: true,

		hideScrollbar: true,

		fadeScrollbar: true,

	 	scrollbarClass: 'myScrollbar' 

	 });

	 MyScrollx.scrollTo(0, 20, 0, true);

}



/**

 * Generates an unique id 

 */

function uniqid() {

        var newDate = new Date;

        var partOne = newDate.getTime();

        var partTwo = 1 + Math.floor((Math.random()*32767));

        var partThree = 1 + Math.floor((Math.random()*32767));

        var id = partOne + '_' + partTwo + '_' + partThree;

        return id;

}









/**

 * do some initital stuff	

 */

$(document).ready(function() {

   

   preloadAllImages();



   myScroll = new iScroll('wrapper', { 

			onScrollEnd: function () {scrollListYValue = this.y;},

			checkDOMChanges: true,

			hideScrollbar: true,

			fadeScrollbar: true,

		 	scrollbarClass: 'myScrollbar' 

		 });

   myScroll.scrollTo(0, 20, 0, true);

	

   initScrollLists();

	

   $( "#progressbar" ).progressbar({ value: 0 });   

   $( "#slider" ).slider({'disabled' : true});

	

   $("#image_loader_icon").hide();        		// hide the image loader icon - gets only showed during AJAX load process

   $("#screen_audioplayer").show();       		// the main screen will be shown by default

   $("#source_popup_window").hide();     		// hide the source popup window from the audio player screen

   $("#screen_browser").hide();		      		// hide complete browser screen

   $("#screen_settings").hide();	      		// hide complete settings screen

   $("#progress_loading_div_haupt").hide();     // hide progress icon

   $("#textbox_song_lyrics").hide(); 		//uidj4527   hide song lyrics textbox

   $("#update_popup_window").hide();

   $("#uidj4527_test1_div").hide();

   $("#uidj4527_test2_div").hide();

   $("#button_set_default_div").hide();

//   $("#update_popup_window").hide();

   

   // check localstorage is supported by browser

	if (localStorage) {



	    // check persistency for last selected Source mode (Cloud or Internal storage)

		if (localStorage.getItem(PLAYMODE)==null) {

			// set cloud mode as default

			selectedSourceID="item_Cloud";

			isCloudBrowsingActive = 1;

			$("#item_Cloud").removeClass("source_normal_state");

			$("#item_Cloud").addClass("source_active_state");

			localStorage.setItem(PLAYMODE, PLAYMODE_CLOUD);

		}

		else if (localStorage.getItem(PLAYMODE)==PLAYMODE_INTERNAL_STORAGE) {

			isCloudBrowsingActive = 0;

			selectedSourceID="item_internal_storage";

			$("#item_internal_storage").removeClass("source_normal_state");

			$("#item_internal_storage").addClass("source_active_state");

		}

		else if (localStorage.getItem(PLAYMODE)==PLAYMODE_CLOUD) {

			isCloudBrowsingActive = 1;

			selectedSourceID="item_Cloud";

			$("#item_Cloud").removeClass("source_normal_state");

			$("#item_Cloud").addClass("source_active_state");

		}

		

		if (localStorage.getItem(DROPBOX_SYNC_USAGE)==null) {

			localStorage.setItem(DROPBOX_SYNC_USAGE, DROPBOX_SYNC_USAGE_DEFAULT);

		}

		

		if (localStorage.getItem(DROPBOX_SYNC_USAGE)==1) // Dropbox will be used for synchronization

			USE_DROPBOX_CLOUD = true;

		else

			USE_DROPBOX_CLOUD = false;	

			

		// check if an unique id was already generated and stored to the localstorage

		

		if (localStorage.getItem(USER_ID)==null) 	

		{

			myUserId = uniqid();

			localStorage.setItem(USER_ID, uniqid());

		}

		else {

			myUserId = localStorage.getItem(USER_ID);

		}

	}

   

   

   // selection handling within the "Source" popup screen 

   $("#source_selection_list li").click(function() {

         var index = $("#source_selection_list > li").index(this);

		 

		 // ui unselection

		 if (selectedSourceID!="undefined")

		 {	

				if (selectedSourceID=="item_Cloud") {

					$("#item_Cloud").removeClass("source_active_state");

					$("#item_Cloud").addClass("source_normal_state");

				}

				else if (selectedSourceID=="item_internal_storage") {

					$("#item_internal_storage").removeClass("source_active_state");	

					$("#item_internal_storage").addClass("source_normal_state");

				}	

		 }



         // ui selection

         if ( (this.id=="item_Cloud") || (this.id=="item_internal_storage")) {

			 $(this).removeClass("source_normal_state");

			 $(this).addClass("source_active_state");	// active li item	

			 

			 selectedSourceID = this.id;

			 

			 if (selectedSourceID=="item_Cloud") {

				 isCloudBrowsingActive = 1;  // cloud mode enabled

				 localStorage.setItem(PLAYMODE, PLAYMODE_CLOUD);

				 activateSource__Cloud();

			 }

			 else {

				 //isCloudBrowsingActive = 0;  // file mode enabled

				 //localStorage.setItem(PLAYMODE, PLAYMODE_INTERNAL_STORAGE);

				 //activateSource__Iternal_storage();

				 //oNativeDevApi.pause();



                                 if (isPausedState==1) // pause button gets shown so we're playing a song

      				     play_pause_clicked(); // pause audio playing to avoid parallxel audio

       

				 jsDevApi.requestNativeAudioPlayer(); 

				 console.log("switched to native audio player");

			 }

			 

			 $("#source_popup_window").hide(200);   // finally close the source selection popup

		     showPopup = 0;

		}

   });

      

   // avoid unneccessary selections within the tracklist during swipe gestures

   // should be improved

   $(".listItem").live('click', function(e) {

		if (!myScroll.animating)  {

			listItemSelectedByIndex($(this).index());

        }

   });

   



  if (!isCloudBrowsingActive) {	  // internal storage mode

      activateSource__Iternal_storage()

  }

  else {  // cloud mode

  	

	// check localstorage is supported by browser

	if (localStorage) {

			

		if (localStorage.getItem(DROPBOX_PATH)==null) {

			localStorage.setItem(DROPBOX_PATH, DROPBOX_DEFAULT_PATH);  // use the default path if nothing is stored in localStorage

		}

		

		$('#dropbox_inputfield_path').attr("value", localStorage.getItem(DROPBOX_PATH));

		

		activateSource__Cloud();  // check localstorage for already synced media information

	}

	else {

		console.log("LocalStorage feature not supported by this browser !!!");

	}

  }

    

    if 	(USE_DROPBOX_CLOUD)

		checkIfLoggedIn();

}); 



function checkIfLoggedIn() {

	

	jQuery.ajax({

	  type: 	   "POST",

	  url:         "/cloudplayerOIP/CodeIgniter_2.1.1/index.php/dropboxplayer/isLoggedIn",  

	  dataType:    "json",

	  data:		   {'json' : JSON.stringify(jsonData) },

	  timeout: 	   1000000,

	  beforeSend:  function(){ 

	  							$("#progress_loading_div_haupt").show();

								$("#progress_loading_text_haupt").text("Trying to login...");

							  },

	  complete:    function(){ 

	  					$("#progress_loading_div_haupt").hide();

	  				},

	  success:     function(data){

		  					if (data) {

								// $("#screen_login").hide();

								data = eval(data);

								

								for (i = 0; i < jsonData.length; i++) {

									jsonData[i].streamingURL = data[i].streamingURL;

								}

							} else {

								settings_login_clicked()

							}		

				   },

	  error:       function(e){

	  					$("#progress_loading_div").hide(); 

	  					console.log("Login failed outer!");

	  				}

  });

}



function mediadurationReceived(hours, mins, seconds, cents) {

   

    // just do something if this app gets shown

    if (browserWindowIsShown==true) {

       var millisec = (hours*3600000)+(mins*60000)+(seconds*1000);

       OnPlayLengthChanged(millisec);	

       OnPlayStateChanged(1);  // receiving timestamps means track is playing

    }

}



function mediatimeReceived(hours, mins, seconds, cents) {

   

    // just do something if this app gets shown

    if (browserWindowIsShown==true) {

       var millisec = (hours*3600000)+(mins*60000)+(seconds*1000);

       OnPlayPositionChanged(millisec);

    }	

}



// native callback which stores state if the browser is showing this app or not

function onHideReceived() { 

    browserWindowIsShown = false;

}





/*******************************/

/* TOUCHPAD / GESTURE HANDLING */

/*******************************/



function onGestureClickReceived() {

     if (browserWindowIsShown) {

	     console.log("[JS] onGestureClickReceived");

	     //play_pause_clicked();

	     

	     if (playingIndex==cursorPositionMainTrackList) {

	     	// cursor on same list entry which is already playing - so do pause instead of play by index

	     	play_pause_clicked();

	     }

	     else

	     	listItemSelectedByIndex(cursorPositionMainTrackList);

	 }

	 else {

	 	console.log("[JS] onGestureClickReceived ignored");

	 }

}



function onGestureSwipeLeftReceived() {

    if (browserWindowIsShown) {

	    console.log("[JS] onGestureSwipeLeftReceived");

	    backward_clicked();

	}

	else {

		 console.log("[JS] onGestureSwipeLeftReceived ignored");

	}

}



function onGestureSwipeRightReceived() {

    if (browserWindowIsShown) {

   		 console.log("[JS] onGestureSwipeRightReceived");

    	 forward_clicked();	

    }

    else {

    	 console.log("[JS] onGestureSwipeRightReceived ignored");

    }

    	

}



function onGestureSwipeUpReceived() {

	if (browserWindowIsShown) {

    	

    	if (cursorPositionMainTrackList>0) {  // check if we are already at the top of the list

	    	console.log("[JS] onGestureSwipeUpReceived");

	    	$("#scroller ol li[id=item_"+cursorPositionMainTrackList+"]").removeClass("withCursor");

	    	cursorPositionMainTrackList--;

	    	$("#scroller ol li[id=item_"+cursorPositionMainTrackList+"]").addClass("withCursor");

    		myScroll.scrollTo(0, -72, 500, true);

    	}

    	 

    }

    else {

    	console.log("[JS] onGestureSwipeUpReceived ignored");

    }

    

}



function onGestureSwipeDownReceived() {

	

    if (browserWindowIsShown) {

    	if ((cursorPositionMainTrackList+1)<jsonData.length) {  // check for end of list

    	    console.log("[JS] onGestureSwipeDownReceived");

	    	$("#scroller ol li[id=item_"+cursorPositionMainTrackList+"]").removeClass("withCursor");

	    	cursorPositionMainTrackList++;

	    	$("#scroller ol li[id=item_"+cursorPositionMainTrackList+"]").addClass("withCursor");

	    	

	        myScroll.scrollTo(0, 72, 500, true);

	    }

    }

    else {

    	console.log("[JS] onGestureSwipeDownReceived ignored");

    }

}







// native callback which stores state if the browser is showing this app or not

function onShowFullScreenReceived() {

    browserWindowIsShown = true;



    $("#item_Cloud").removeClass("source_normal_state");

    $("#item_Cloud").addClass("source_active_state");

				

    $("#item_internal_storage").removeClass("source_active_state");	

    $("#item_internal_storage").addClass("source_normal_state");

	

    selectedSourceID = "item_Cloud";

    isCloudBrowsingActive = 1;  // cloud mode enabled

    localStorage.setItem(PLAYMODE, PLAYMODE_CLOUD);	

}



function activateSource__Iternal_storage() {

 	try {

		  oNativeDevApi = jsDevApi.getNativeObject();

		

		  oNativeDevApi.OnPlayingListChanged.connect(OnPlayingListChanged);

		  oNativeDevApi.OnPlayingListReseted.connect(OnPlayingListReseted);

		  oNativeDevApi.OnPlayingListMetadataLoaded.connect(OnPlayingListMetadataLoaded);

		

		  oNativeDevApi.OnPlayStateChanged.connect(OnPlayStateChanged);

		  oNativeDevApi.OnPlayPositionChanged.connect(OnPlayPositionChanged);

		  oNativeDevApi.OnPlayLengthChanged.connect(OnPlayLengthChanged);

		  oNativeDevApi.OnRandomModeChanged.connect(OnRandomModeChanged);

		  oNativeDevApi.OnRepeatModeChanged.connect(OnRepeatModeChanged);

		  oNativeDevApi.OnAlbumCoverImageReady.connect(OnAlbumCoverImageReady)

		  alert("Slots are connected");

	 }

	 catch (e) {console.log("Native subsystem seems unavailable");}

}





function onFeatureModeReceived(level) {

	 

	 if (level==2) {

	    $("#button_settings_div").unbind('click');

	 }

	 else if (level==0) {

	     $("#button_settings_div").click(function (ev) {settings_button_clicked()});

	 }

}



function activateSource__Cloud() {

           try {

               oNativeDevApi = jsDevApi;

               oNativeDevApi.onShowFullScreenReceived.connect(onShowFullScreenReceived);

               oNativeDevApi.onHideReceived.connect(onHideReceived);

               oNativeDevApi.mediaduration.connect(mediadurationReceived);

               oNativeDevApi.mediatime.connect(mediatimeReceived);

               oNativeDevApi.onFeatureModeReceived.connect(onFeatureModeReceived);

               //oNativeDevApi.onGestureClick.connect(onGestureClickReceived);

               //oNativeDevApi.onGestureSwipeLeft.connect(onGestureSwipeLeftReceived);

               //oNativeDevApi.onGestureSwipeRight.connect(onGestureSwipeRightReceived);

               //oNativeDevApi.onGestureSwipeUp.connect(onGestureSwipeUpReceived);

               //oNativeDevApi.onGestureSwipeDown.connect(onGestureSwipeDownReceived);

           }

           catch (e) { console.log("HTMLCloudPlayer Native subsystem seems unavailable"); }

 

	   // read out local storage

	   for (i=0; i<=localStorage.length-1; i++) {  

			key = localStorage.key(i);  

			val = localStorage.getItem(key); 

				

                             if (key.lastIndexOf("/music", 0) === 0) {

                                myJason = JSON.parse(val);

				jsonData.push(myJason);

			}

		}  

		

		fillTracklist(jsonData);  

		 

		// replay last played track 

		index = localStorage.getItem(LAST_PLAYED_INDEX); 

		

		if ( (browserWindowIsShown) && (index!='undefined') && (index!=null)) {

			listItemSelectedByIndex(index);  

		}

}



function fillTracklist(jsonData) {

	

	jQuery('#scroller ol').html("");  // clear track list first

	//	console.log("jsonData.lengh="+jsonData.length);			   
   
		for(i = 0; i < jsonData.length; i++) {
	//			console.log("i="+i);
//				song_title = decodeHTMLTag(jsonData[i].artist)+"-"+decodeHTMLTag(jsonData[i].title)+".lrc";
				
//				songUrl = "http://wujian1404.hostfreeweb.net/dummyCloud/music/songLyrics.php?lrc_url="+song_title;
		
	//		song_title = decodeHTMLTag(jsonData[i].artist)+"-"+decodeHTMLTag(jsonData[i].title)+".lrc";
/*			song_title = 123;
				
			songUrl = "http://wujian1404.hostfreeweb.net/dummyCloud/music/songLyrics.php?lrc_url="+song_title;
		console.log(songUrl);
		jQuery.ajax({
 					url:         songUrl,

	  			dataType:    "json",

	 			  timeout: 	   DROPBOX__TIMEOUT_SYNC,
	 			  
	 			  success:     function(data){
	 			  						
	 			  							jsonDataLyrics = data;
	 			  					//		console.log("songLyrics="+jsonDataLyrics);
	 											console.log("songLyrics="+jsonDataLyrics[i].songLyrics);
	 				},
	 				
	 				error: function(e){  alert('Cannot read the song lyrics !');}
	 			  
 				});*/
				
				
		
				
//				console.log("song_title "+song_title);
		    if (i==0) {

		    	cursorPositionMainTrackList = 0;

		    	scrollListYValue = 0;

		    	jQuery('#scroller ol').append('<li class="listItem withCursor" id="item_'+i+'"><span class="list_text_entry">'+decodeHTMLTag(jsonData[i].title).truncate(16)+'</span></li>');

		    }

		    else

		    	jQuery('#scroller ol').append('<li class="listItem" id="item_'+i+'"><span class="list_text_entry">'+decodeHTMLTag(jsonData[i].title).truncate(16)+'</span></li>');

		}
		
		

}



function decodeHTMLTag(text) {

	return $("<div />").html(text).text();

}







/**

 * Callback function from Javascript Audio API - returns timimg information about current streaming song

 */

function audioControlTimeUpdates(event) {



	OnPlayPositionChanged(audioElement.currentTime*1000);

	

	if (!isNaN(audioElement.duration) && !durationSet)

		OnPlayLengthChanged(audioElement.duration*1000);

		

	OnPlayStateChanged(1);  // receiving timestamps means track is playing

}





function updatePlayingContext() {

	

	durationSet = false;


		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!updatePlayingContext called!!!!!!!!!!!!!!!!!!!");
	  if(jsonData.length>0 && playedIndex != playingIndex)

	  {

		if (playedIndex != -1)

		{

		  $("#item_"+playedIndex).html('<span class="list_text_entry">'+$("#item_"+playedIndex).text().truncate(16)+'</span>');

		  $("#item_"+playedIndex).removeClass('playing');  // unselect just by removing the class .playing of the li item

		}
        else
        {
            $('#streaming_div').css("background", "url(./images/player_cloud_animation_disabled.png)");
        }
	

		if(playingIndex != -1)

		{

			

		  $("#item_"+playingIndex).html('<span class="list_text_entry">'+$("#item_"+playingIndex).text().truncate(16)+'</span><div class="playing_icon"></div>');  // add class .playing_icon to get the loudspeaker symbol

		  $("#item_"+playingIndex).addClass('playing');  // class .playing sets background color

	

		  $('#streaming_div').css("background", "url(./images/player_cloud_animation.gif)");  	// show streaming icon

	      

		  if (isCloudBrowsingActive==0) {

			  var artist = jsonData.playingListItem[playingIndex].artist;

			  var title  = truncme(jsonData.playingListItem[playingIndex].title, 16);
			  
			  var title_lyrics = jsonData.playingListItem[playingIndex].title;

			  var album  = jsonData.playingListItem[playingIndex].albumname;

			  var cover  = jsonData.playingListItem[playingIndex].cover;  

		  }

		  else {

				  var path         = decodeHTMLTag(jsonData[playingIndex].path);  

				  var artist       = decodeHTMLTag(jsonData[playingIndex].artist);

				  var title        = truncme(decodeHTMLTag(jsonData[playingIndex].title), 16);
				  
				  var title_lyrics = decodeHTMLTag(jsonData[playingIndex].title);

				  var album        = decodeHTMLTag(jsonData[playingIndex].albumname);

				  var lastfmUrl    = decodeHTMLTag(jsonData[playingIndex].lastfmURL);     // LastFM AudioScrobbler REST URL

				  var coverArtUrl  = decodeHTMLTag(jsonData[playingIndex].coverArtUrl);   // extracted Cover Art Image URL

		

                       		  

				  if (navigator.platform.indexOf("armv7")==-1) {

					  if (audioElement==undefined) {

						  audioElement = new Audio();

						  audioElement.addEventListener("timeupdate", audioControlTimeUpdates, false);

					  }

					  

					  if (!audioElement.paused) // if playing - pause track before

					   audioElement.pause();

					  

					  audioElement.setAttribute('src', jsonData[playingIndex].streamingURL);

					  

					  audioElement.play(); 

				  }

				  else {

                            console.log("called native part to stream web url"+jsonData[playingIndex].streamingURL);

                            oNativeDevApi.setAttribute(artist+"|"+title, jsonData[playingIndex].streamingURL);

                  }



				  localStorage.setItem(LAST_PLAYED_INDEX, playingIndex);  // store index to make an autoplay at startup

		  }
		  
			
		  $("#player_info_artist").text(artist);

		  $("#player_info_title").text(title);

		  $("#player_info_album").text(album); 

		  

		  lazyImageLoad(playingIndex);



		  isPausedState = 1;

		  

		  if ((isCloudBrowsingActive==0) && jsonData.playingListItem[playingIndex].cover.length == 0)

		  {

			   oNativeDevApi.RequestAlbumCoverImage(playingIndex);

		  }

		}
		//uidj4527
	//	  var artist_lyrics = jsonData.playingListItem[playingIndex].artist;
	//	  var title_lyrics = jsonData.playingListItem[playingIndex].title;
			song_title = artist+"-"+title_lyrics+".lrc";
			console.log("song_title="+song_title);
			songUrl = "http://wujian1404.hostfreeweb.net/dummyCloud/music/songLyrics.php?lrc_url="+song_title;
		  jQuery.ajax({
 					url:         songUrl,

	  			dataType:    "json",

	 			  timeout: 	   DROPBOX__TIMEOUT_SYNC,
	 			  
	 			  success:     function(data){
	 			  						
	 			  							jsonDataLyrics = data;
//	 			  							console.log("songLyrics="+jsonDataLyrics);
	 			  							
	 			  							
	 						//					console.log("songLyrics="+lyrics_content);
	 				},
	 				
	 				error: function(e){  alert('Cannot read the song lyrics !');}
	 			  
 				});  	
 			jsonDataLyrics=jsonDataLyrics.toString();	
			jsonDataLyrics=jsonDataLyrics.replace(/\n/g,"<br/>");
			
			setTimeout(function(){$("#song_lyrics_text").text(jsonDataLyrics);},1000);

	  }

}



function update() {

	var blub = { 'json' : JSON.stringify(jsonData) };

	blub = JSON.stringify(blub);

	// alert(blub);

	$.post('/cloudplayerOIP/CodeIgniter_2.1.1/index.php/dropboxplayer/update_media_urls', {'json' : JSON.stringify(jsonData) }, function(data) {

	  // alert(data);

	  data = eval(data);

	  $.each(data, function(key, value) { 

		   alert("path: " + value.path + "\n streamingURL: " + value.streamingURL); 

		});

	});

}



/**

 * @param : audioscrobbler__REST_URL: LastFM RestAPI URL to get information about a particular Album

 *          path:                     unique Dropbox Path  

 */

function lazyImageLoad(playingIndex) {

	

	 var audioscrobbler__REST_URL = jsonData[playingIndex].lastfmURL;

	 var path                     = jsonData[playingIndex].path;

	 coverArtUrl                  = jsonData[playingIndex].coverArtUrl;

	 

	 $("#image_loader_icon").show();

	 if (coverArtUrl=="") {  // image url was never requested at all from Lastfm - so do this step now

		jQuery.ajax({

			  url:         audioscrobbler__REST_URL+"&format=json",

			  dataType:    "json",

			  timeout: 	   AUDISCROBBLER__LAZY_IMAGE_LOAD_TIMEOUT,

			  beforeSend:  function(){ 

	  							$("#image_loader_icon").show();        // show the image loader icon until the cover art image has been loaded

						   }, 

			  success:     function(data){

								var cover = data["album"]["image"][2]["#text"];  // extract img URL from LastFM Response



								if (localStorage) {

									var json = jQuery.parseJSON(localStorage.getItem(path));

									json.coverArtUrl = cover;

									localStorage.setItem(path, JSON.stringify(json));

									

									// store new value into jsonData so next selection REST request is not neccessary

									jsonData[playingIndex].coverArtUrl = cover;

								}

								

								// improve image loading - see i.e. http://blog.endpoint.com/2011/03/lazy-image-loading-jquery-javascript.html

								$("#player_info_cd_cover").css("background-image", "url(" + cover + ")");

								$("#image_loader_icon").hide();

						   },

			  error:       function(e){

								$("#image_loader_icon").hide();

						        $("#player_info_cd_cover").css("background-image", "url(./images/cover/player_info_cd_cover.png)");

						   }

  });

	 }

	 else { // img url is existing - no need to do an AJAX call again

		  

		  if (localStorage) {

			   var json = JSON.parse(localStorage.getItem(path));

			   // improve image loading

			   $("#player_info_cd_cover").css("background-image", "url(" + json.coverArtUrl + ")");

			   $("#image_loader_icon").hide();

		  }  

	 } 

}





/**

 * Item within Tracklist was clicked - show corresponding meta data and highlight selected item

 */

function listItemSelectedByIndex(index) {

  

	  playedIndex  = playingIndex;

	  playingIndex = index;

	

	  if(playingIndex != -1) {

		  if (!isCloudBrowsingActive) {

			  oNativeDevApi.log("listItemSelectedByIndex:" + index);

			  oNativeDevApi.SetCurrentPlayingItemIndex(playingIndex);

		  }

	  }

	  

	  $("#slider").slider("value",0);

	  $("#progressbar").progressbar({value:0});

          $("#timestamp_current").text("0:00");

          $("#timestamp_max").text("0:00");

	  

	  updatePlayingContext();

}



/**

 * Depending the internal state - plays or stops the current selected track

 */

function play_pause_clicked() {
    console.log("uidj452-------------------play pause clicked");

    if (!isCloudBrowsingActive)

		alert("play_pause_clicked"+isPausedState);

	

	if (isPausedState==0) {
		 if(recover_default_theme == 1 || first_theme == 1)
			$("#play_pause").attr('class', 'button_play_pause pause_state');
		else
			$("#play_pause").attr('class','button_play_pause_new pause_state_new');

		$('#streaming_div').css("background", "url(./images/player_cloud_animation.gif)");  	// show streaming icon


		  

        if (!isCloudBrowsingActive)

			oNativeDevApi.Play();


		else {

          if (audioElement != undefined) {

		  	audioElement.play();

		  }

                  else

                    oNativeDevApi.play();

		}

    }

	else {
		 if(recover_default_theme == 1 || first_theme == 1)
			$("#play_pause").attr('class', 'button_play_pause play_state');
		else
			$("#play_pause").attr('class', 'button_play_pause_new play_state_new');
			 
		

		

        if (!isCloudBrowsingActive)

			 oNativeDevApi.pause();

		else {

		  if (audioElement!=undefined) 

		   	audioElement.pause();

                  else

                    oNativeDevApi.pause();

		}	

	}
	

	

   isPausedState = !isPausedState;

}





/**

 * Selects the next song of the current tracklist

 */

function forward_clicked() {

	/*TEST: browserWindowIsShown = true; onGestureSwipeDownReceived(); */

	

	if (isCloudBrowsingActive && isShuffleOn) 

	{

		playRandom();

	} 

	else 

	{

	  

	  if (isCloudBrowsingActive==0) {

		length = jsonData.playingListItem.length-1;

	  }

	  else {

		length = jsonData.length-1;

	  }

	  

	  if (playingIndex==length) {

			listItemSelectedByIndex(0);

	  }

	  else {

		    newIndex =  parseInt(playingIndex)+1;

			listItemSelectedByIndex(newIndex);

	  }

	 }

}





/**

 * Selects the previous song of the current tracklist

 */

function backward_clicked() {

	/* TEST browserWindowIsShown = true;

	onGestureSwipeUpReceived(); */

	

	if (isCloudBrowsingActive && isShuffleOn) 

	{

		playRandom();

	} 

	else 

	{

		  if (playingIndex == 0) {

			  if (isCloudBrowsingActive==0) {

		    	length = jsonData.playingListItem.length-1;

			  }

			  else {

			  	length = jsonData.length-1;

			  }

			

			listItemSelectedByIndex(length);

		  }

		  else {

				listItemSelectedByIndex(playingIndex-1);

		  }

	 }


}
// uidj4527 test
function background_set_clicked(){
	changeMainWindowBackground = !changeMainWindowBackground;
	first_theme = 0;
    new_theme_selected = 0;
    button_theme_clicked = 1;
    $("#song_lyrics_text").css("color","#ffffff");
	if(changeMainWindowBackground == 1){
        another_theme = 1;
        recover_default_theme  = 0;
//		$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/fushi_mountain.png)");
			$("#screen_audioplayer").css("background-image","url(../images/fushi_mountain.jpg)");
//		$("#tracklist_containter").remove();
/*		$("#screen_loadFailed").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/fushi_mountain.png)");
		$("#screen_browser").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/fushi_mountain.png)");
		$("#screen_settings").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/fushi_mountain.png)");*/
		$("#screen_loadFailed").css("background-image","url(../images/fushi_mountain.jpg)");
		$("#screen_browser").css("background-image","url(../images/fushi_mountain.jpg)");
		$("#screen_settings").css("background-image","url(../images/fushi_mountain.jpg)");
		 $("#song_lyrics_text").css("color","#000000");

		$("#update_popup_window").css("top","480px");
	
//		$("#player_info_cd_cover").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/cover/player_info_cd_cover.png)");
		$("#player_info_cd_cover").css("background-image","url(../images/cover/player_info_cd_cover.png)");
        $("#player_buttons").css({"left":"350px","width":"340px","top":"470px"});
	
		$("#button_row").css({"left":"700px","top":"100px","height":"120px","width":"300px"});
        $("#button_source_div").css({"float":"left","margin-bottom":"5px","padding-right":"2px"});
		$("#button_browse_div").css({"float":"left","padding-right":"2px","margin-bottom":"5px"});
		$("#button_settings_div").css("float","left");

      	        $("#button_row_background").css({"left":"10px","top":"100px","height":"120px","width":"300px"});
		$("#button_background_set_div").css({"float":"left","margin-bottom":"5px","margin-right":"2px"});
		$("#button_song_lyrics_show_div").css("float","left");
		$("#button_background_choose_div").css({"float":"left","margin-bottom":"5px","margin-right":"2px"});

        $("#button_shuffle_div").css({"left":"650px","top":"200px"});
        $("#button_repeat_div").css({"left":"270px","top":"200px"});


        $("#audio_slider").css({"width":"320px","margin-left":"350px","margin-top":"320px"});
		if(isRepeatOn)
			$("#repeat").attr('class','button_repeat_shuffle repeat_active_state_new');
		else
			$("#repeat").attr('class','button_repeat_shuffle repeat_normal_state_new');

		if(isShuffleOn)
			$("#shuffle").attr('class','button_repeat_shuffle shuffle_active_state_new');
		else
			$("#shuffle").attr('class','button_repeat_shuffle shuffle_normal_state_new');

		$("#backward").attr('class','button_backward_new button_fwd_bwd_new');
		$("#forward").attr('class','button_forward_new button_fwd_bwd_new');
		if (isPausedState==0) 
			$("#play_pause").attr('class','button_play_pause_new pause_state_new');
		else
			$("#play_pause").attr('class','button_play_pause_new play_state_new');

//        $("#player_info_cd_cover_bg").css({"width":"200px","height":"200px","left":"380px"});
	$("#player_info_cd_cover_bg").hide();
	$("#player_info_cd_cover").css({"width":"180px","height":"180px","left":"420px"});
        $("#player_infos").css({"left":"290px","top":"300px"});
        $("#player_info_artist").css({"font-size":"28px","color":"#ffffff"});
        $("#player_info_album").css({"font-size":"28px","color":"#ffffff"});
        $("#player_info_title").css({"font-size":"28px","color":"#ffffff"});

	$("#background_set_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#background_select_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#song_lyrics_show_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});

	$("#source_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#browse_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#settings_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	
		/*$("#player_info_artist").css("font-size","18px");
		$("#player_info_album").css("font-size","18px");
		$("#player_info_title").css("font-size","18px");*/

		$("#background_set").attr('class', 'button_roundStyle button_background_set_new');
		$("#background_choose").attr('class','button_roundStyle button_background_choose_new');
		$("#song_lyrics_show").attr('class','button_roundStyle button_song_lyrics_show_new');
//		$("#background_set_button_text").hide();
//		$("#background_select_button_text").hide();
//		$("#song_lyrics_show_button_text").hide();
	
		$("#button_set_default_div").show();
	

		$("#streaming_div").hide();
	//	$("#button_background_choose_div").hide();
		$("#tracklist_containter").hide();
	
//		$("#textbox_song_lyrics").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/song_lyrics_bg_uidj4527.png)");
//			$("#textbox_song_lyrics").css("background-image","url(../images/song_lyrics_bg_uidj4527.png)");
        $("#textbox_song_lyrics").css("left","10px");
        $("#textbox_song_lyrics").css("top","400px");
        $("#textbox_song_lyrics").attr('class','textbox_song_lyrics_dis_new');
        $("#song_lyrics_text").css("width","300px");
    //	$(".textbox_song_lyrics_dis").css("width","320px");
	/*	$(".source_type_internal_storage").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_internal_storage_normal_uidj4527.png)");
		$(".source_type_internal_storage:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_internal_storage_pressed_uidj4527.png)");
		$(".source_type_usb").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_usb_normal_uidj4527.png)");
		$(".source_type_usb:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_usb_pressed_uidj4527.png)");
		$(".source_type_sdcard").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_sdcard_normal_uidj4527.png)");
		$(".source_type_sdcard:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_sdcard_pressed_uidj4527.png)");
		$(".source_type_bluetooth").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_bluetooth_normal_uidj4527.png)");
		$(".source_type_bluetooth:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_bluetooth_pressed_uidj4527.png)");
		$(".source_type_cd").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_cd_normal_uidj4527.png)");
		$(".source_type_cd:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_cd_pressed_uidj4527.png)");*/
		$("#source").attr('class','button_roundStyle button_source_new');
		$("#browse").attr('class','button_roundStyle button_browse_new');
		$("#settings").attr('class','button_roundStyle button_settings_new');

//		$("#source_button_text").hide();
//		$("#browse_button_text").hide();
//		$("#settings_button_text").hide();
			$("#player_info_artist").show();
      $("#player_info_album").show();
      $("#player_info_title").show();
	}
	else{
        recover_default_theme = 1;
        another_theme = 0;
/*        $("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png)");
        $("#screen_loadFailed").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png");
        $("#screen_browser").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png)");
        $("#screen_settings").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png)");*/
        $("#screen_audioplayer").css("background-image","url(../images/gen_bg_CloudPlayer2.png)");
        $("#screen_loadFailed").css("background-image","url(../images/gen_bg_CloudPlayer2.png");
        $("#screen_browser").css("background-image","url(../images/gen_bg_CloudPlayer2.png)");
        $("#screen_settings").css("background-image","url(../images/gen_bg_CloudPlayer2.png)");

	$("#update_popup_window").css("top","284px");	

 //       $("#player_info_cd_cover").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/cover/player_info_cd_cover.png)");
				$("#player_info_cd_cover").css("background-image","url(../images/cover/player_info_cd_cover.png)");

        $("#player_buttons").css({"left":"31px","width":"480px","top":"648px"});

        $("#button_row").css({"left":"559px","top":"648px","width":"440px"});
        $("#button_source_div").css({"float":"left","margin-left":"1px","padding-right":"14px","margin-bottom":"5px"});
        $("#button_browse_div").css({"float":"left","padding-right":"28px","margin-bottom":"5px"});
        $("#button_settings_div").css("float","left");

        $("#button_row_background").css({"left":"559px","top":"102px","width":"440px"});
        $("#button_background_set_div").css({"float":"left","margin-right":"13px"});
        $("#button_song_lyrics_show_div").css("float","left");
        $("#button_background_choose_div").css({"float":"left","margin-right":"13px"});

        $("#button_shuffle_div").css({"left":"415px","top":"105px"});
        $("#button_repeat_div").css({"left":"30px","top":"105px"});

        $("#audio_slider").css({"width":"462px","margin-left":"31px","margin-top":"486px"});

        if(isRepeatOn)
                    $("#repeat").attr('class','button_repeat repeat_active_state');
                else
                    $("#repeat").attr('class','button_repeat repeat_normal_state');

                if(isShuffleOn)
                    $("#shuffle").attr('class','button_shuffle shuffle_active_state');
                else
                    $("#shuffle").attr('class','button_shuffle shuffle_normal_state');

        $("#backward").attr('class','button_backward button_fwd_bwd');
        $("#forward").attr('class','button_forward button_fwd_bwd');

        if (isPausedState==0)
                    $("#play_pause").attr('class','button_play_pause pause_state');
        else
                    $("#play_pause").attr('class','button_play_pause play_state');

        $("#player_info_cd_cover_bg").show();
        $("#player_info_cd_cover").css({"width":"245px","height":"245px","left":"138px"});
        $("#player_infos").css({"left":"40px","top":"383px"});
        $("#player_info_artist").css({"font-size":"36px","color":"#ffffff"});
        $("#player_info_album").css({"font-size":"36px","color":"#ffffff"});
        $("#player_info_title").css({"font-size":"48px","color":"#ffffff"});
        
       

        $("#background_set").attr('class', 'button_bg_dis button_background_set');
        $("#background_choose").attr('class','button_bg_dis button_background_choose');
        $("#song_lyrics_show").attr('class','button_bg_dis button_song_lyrics_show');
        $("#background_set_button_text").show();
        $("#background_select_button_text").show();
        $("#song_lyrics_show_button_text").show();

	$("#background_set_button_text").css({"padding-top":"30px","height":"60px","width":"100px","padding-left":"5px","margin-left":"5px"});
	$("#background_select_button_text").css({"padding-top":"30px","height":"60px","width":"100px","padding-left":"5px","margin-left":"5px"});
	$("#song_lyrics_show_button_text").css({"padding-top":"30px","height":"60px","width":"100px","padding-left":"5px","margin-left":"5px"});

	$("#source_button_text").css({"padding-top":"53px","height":"38px","width":"138px","padding-left":"32px","margin-left":"0px"});
	$("#browse_button_text").css({"padding-top":"53px","height":"38px","width":"138px","padding-left":"5px","margin-left":"4px"});
	$("#settings_button_text").css({"padding-top":"53px","height":"38px","width":"100px","padding-left":"5px","margin-left":"4px"});

        $("#streaming_div").show();
        $("#tracklist_containter").show();
//        $("#textbox_song_lyrics").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/song_lyrics_bg.png)");
//				$("#textbox_song_lyrics").css("background-image","url(../images/song_lyrics_bg.png)");
        $("#textbox_song_lyrics").css("left","30px");
        $("#textbox_song_lyrics").css("top","380px");
        $("#textbox_song_lyrics").attr('class','textbox_song_lyrics_dis');
        $("#song_lyrics_text").css("width","436px");;

        $("#source").attr('class','button_bg_dis button_source source_type_internal_storage');
        $("#browse").attr('class','button_bg_dis button_browse');
        $("#settings").attr('class','button_bg_dis button_settings');

        $("#source_button_text").show();
        $("#browse_button_text").show();
        $("#settings_button_text").show();
        if(lyrics_visible==1){
        	 $("#player_info_artist").hide();
       		 $("#player_info_album").hide();
       		 $("#player_info_title").hide();
        }
        else{
        	 $("#player_info_artist").show();
       		 $("#player_info_album").show();
       		 $("#player_info_title").show();
        }

//        $("#streaming_div").show();

	}
	/*if(changeMainWindowBackground == 0){
		changeMainWindowBackground = 1;
		$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/fushi_mountain.png)"); //uidj4527: must be an absolute path !!!!
	}
	else{
		changeMainWindowBackground = 0;
		$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png)");
	}*/
}

function background_choose_clicked(){
	if(update_confirm_dialog_show == 0){
		update_confirm_dialog_show = 1;
		$("#update_popup_window").show();
	}
	else{
		update_confirm_dialog_show = 0;
		$("#update_popup_window").hide();
	}
}

function song_lyrics_show_clicked(){
//		var userid = uidj4527;
	//	var myfile = "";
//		syncUrl = "http://wujian1404.hostfreeweb.net/dummyCloud/music/songLyrics.php";
    console.log("uidj4527----------------song lyrics show clicked");
    if(showSongLyricsTextBox==0){
        showSongLyricsTextBox = 1;
           
 //   for(i = 0; i < jsonData.length; i++) {  
 //       song_title = decodeHTMLTag(jsonData[i].artist)+"-"+decodeHTMLTag(jsonData[i].title)+".lrc";
  //      console.log("song_title="+song_title);
 //       lyrics_content = jsonData[i].streamingURL;
	// 			console.log("artist="+lyrics_content);
/*			song_title = "Adele-Someone Like You.lrc";

			songUrl = "http://wujian1404.hostfreeweb.net/dummyCloud/music/songLyrics.php?lrc_url="+song_title;
			jQuery.ajax({
 					url:         songUrl,

	  			dataType:    "json",

	 			  timeout: 	   DROPBOX__TIMEOUT_SYNC,
	 			  
	 			  success:     function(data){
	 			  						
	 			  							jsonDataLyrics = data;
	 			  							console.log("songLyrics="+jsonDataLyrics);
	 			  							
	 			  							
	 						//					console.log("songLyrics="+lyrics_content);
	 				},
	 				
	 				error: function(e){  alert('Cannot read the song lyrics !');}
	 			  
 				});  		
 				setTimeout(function(){$("#song_lyrics_text").text(jsonDataLyrics);$("#textbox_song_lyrics").show(); },500);	*/	
 				 $("#textbox_song_lyrics").show();
 				 lyrics_visible = 1;
 				 if(button_update_clicked==0&&button_theme_clicked==0||recover_default_theme==1){
 				 	$("#player_info_artist").hide();
       		 $("#player_info_album").hide();
       		 $("#player_info_title").hide();
 				}
/* 				 if(!(recover_default_theme==0||new_theme_selected==1)){
 				 	 $("#player_info_artist").hide();
       		 $("#player_info_album").hide();
       		 $("#player_info_title").hide();
 				}*/
 //  			lyrics_content = jsonDataLyrics[i].songLyrics;
 //  	 }
  	}
    else{
        showSongLyricsTextBox = 0;
        $("#textbox_song_lyrics").hide();
        lyrics_visible = 0;
 
 				 	 $("#player_info_artist").show();
       		 $("#player_info_album").show();
       		 $("#player_info_title").show();
 
    }

 			
}

function update_confirm_clicked(){
	$("#update_popup_window").hide();
	update_confirm_dialog_show = 0;
	first_theme = 0;
    another_theme = 0;
    recover_default_theme = 0;
	new_theme_selected = 1;
	button_update_clicked = 1;
	$("#player_info_artist").show();
  $("#player_info_album").show();
  $("#player_info_title").show();
  $("#song_lyrics_text").css("color","#000000");

//	$("#tracklist_containter").remove();
/*	$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/chrismas_uidj4527.png)");
	$("#screen_loadFailed").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/chrismas_uidj4527.png)");
	$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/chrismas_uidj4527.png)");*/
//	$("#screen_audioplayer").css("background-image","url(../images/chrismas_uidj4527.png)");
	$("#screen_audioplayer").css("background-image","url(../images/chrismas_uidj4527.jpg)");
//	$("#screen_loadFailed").css("background-image","url(../images/chrismas_uidj4527.png)");
//	$("#screen_audioplayer").css("background-image","url(../images/chrismas_uidj4527.png)");
	$("#screen_loadFailed").css("background-image","url(../images/chrismas_uidj4527.jpg)");
	$("#screen_audioplayer").css("background-image","url(../images/chrismas_uidj4527.jpg)");
	$("#update_popup_window").css("top","284px");

	$("#player_buttons").css({"left":"680px","width":"340px","top":"648px"});
	
	$("#button_row").css({"left":"10px","top":"420px","height":"330px","width":"100px"});
	$("#button_source_div").css({"float":"top","margin-bottom":"5px","padding-right":"2px"});
	$("#button_browse_div").css({"float":"top","padding-right":"2px","margin-bottom":"5px"});
	$("#button_settings_div").css("float","top");

	$("#button_row_background").css({"left":"10px","top":"84px","height":"330px","width":"100px"});
	$("#button_background_set_div").css({"float":"top","margin-bottom":"5px","margin-right":"2px"});
	$("#button_song_lyrics_show_div").css("float","top");
	$("#button_background_choose_div").css({"float":"top","margin-bottom":"5px","margin-right":"2px"});

    $("#button_shuffle_div").css({"left":"900px","top":"105px"});
    $("#button_repeat_div").css({"left":"600px","top":"105px"});


	$("#audio_slider").css({"width":"320px","margin-left":"680px","margin-top":"486px"});
	if(isRepeatOn)
		$("#repeat").attr('class','button_repeat_shuffle repeat_active_state_new');
	else
		$("#repeat").attr('class','button_repeat_shuffle repeat_normal_state_new');

	if(isShuffleOn)
		$("#shuffle").attr('class','button_repeat_shuffle shuffle_active_state_new');
	else
		$("#shuffle").attr('class','button_repeat_shuffle shuffle_normal_state_new');

	$("#backward").attr('class','button_backward_new button_fwd_bwd_new');
	$("#forward").attr('class','button_forward_new button_fwd_bwd_new');
	if (isPausedState==0) 
		$("#play_pause").attr('class','button_play_pause_new pause_state_new');
	else
		$("#play_pause").attr('class','button_play_pause_new play_state_new');

	
	$("#player_info_cd_cover").css({"width":"120px","height":"120px","left":"750px"});
//	$("#player_info_cd_cover_bg").css({"width":"150px","height":"150px","left":"730px"});
	$("#player_info_cd_cover_bg").hide();
	$("#player_infos").css({"left":"585px","top":"250px"});
	$("#player_info_artist").css({"font-size":"36px","color":"#000000"});
	$("#player_info_album").css({"font-size":"36px","color":"#000000"});
	$("#player_info_title").css({"font-size":"36px","color":"#000000"});
	
	/*$("#player_info_artist").css("font-size","18px");
	$("#player_info_album").css("font-size","18px");
	$("#player_info_title").css("font-size","18px");*/

	$("#background_set").attr('class', 'button_roundStyle button_background_set_new');
	$("#background_choose").attr('class','button_roundStyle button_background_choose_new');
	$("#song_lyrics_show").attr('class','button_roundStyle button_song_lyrics_show_new');
//	$("#background_set_button_text").hide();
//	$("#background_select_button_text").hide();
//	$("#song_lyrics_show_button_text").hide();
	$("#background_set_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#background_select_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#song_lyrics_show_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});

	
	$("#button_set_default_div").show();
	

	$("#streaming_div").hide();
//	$("#button_background_choose_div").hide();
	$("#tracklist_containter").hide();
	
//	$("#textbox_song_lyrics").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/song_lyrics_bg_uidj4527.png)");
//	$("#textbox_song_lyrics").css("background-image","url(../images/song_lyrics_bg_uidj4527.png)");
	$("#textbox_song_lyrics").css("left","680px");
	$(".textbox_song_lyrics_dis").css("width","320px");
	$("#textbox_song_lyrics").css("top","370px");
	$("#song_lyrics_text").css("width","320px");
/*	$(".source_type_internal_storage").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_internal_storage_normal_uidj4527.png)");
	$(".source_type_internal_storage:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_internal_storage_pressed_uidj4527.png)");
	$(".source_type_usb").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_usb_normal_uidj4527.png)");
	$(".source_type_usb:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_usb_pressed_uidj4527.png)");
	$(".source_type_sdcard").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_sdcard_normal_uidj4527.png)");
	$(".source_type_sdcard:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_sdcard_pressed_uidj4527.png)");
	$(".source_type_bluetooth").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_bluetooth_normal_uidj4527.png)");
	$(".source_type_bluetooth:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_bluetooth_pressed_uidj4527.png)");
	$(".source_type_cd").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_cd_normal_uidj4527.png)");
	$(".source_type_cd:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_cd_pressed_uidj4527.png)");*/
	$("#source").attr('class','button_roundStyle button_source_new');
	$("#browse").attr('class','button_roundStyle button_browse_new');
	$("#settings").attr('class','button_roundStyle button_settings_new');

//	$("#source_button_text").hide();
//	$("#browse_button_text").hide();
//	$("#settings_button_text").hide();
	$("#source_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#browse_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});
	$("#settings_button_text").css({"padding-top":"90px","height":"20px","width":"96px","padding-left":"5px","margin-left":"5px"});

//	$("#tracklist_header").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_header_bg_new_uidj4527.png)");
//	$("#wrapper").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_bg_uidj4527.png)");
//	$(".listItem:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_cursor_normal_uidj4527.png)");
//	$(".playing_icon").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_ico_speaker_uidj4527.png)");
//	$(".playing").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_cursor_normal_uidj4527.png)");
//	$(".home_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/home_button_normal_uidj4527.png)");
//	$(".home_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/home_button_pressed_uidj4527.png)");
//	$("#player_info_cd_cover_bg").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/player_info_cd_cover_bg_uidj4527.png)");
/*	$("#player_info_cd_cover").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/cover/player_info_cd_cover_uidj4527.png)");
	$("#handle").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/player_slider_knob_normal_uidj4527.png)");
	$(".ui-state-default").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/player_slider_knob_normal_uidj4527.png)");
	$(".jqx-slider-slider").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/player_slider_knob_normal_uidj4527.png)");*/
	$("#player_info_cd_cover").css("background-image","url(../images/cover/player_info_cd_cover_uidj4527.png)");
	$("#handle").css("background-image","url(../images/player_slider_knob_normal_uidj4527.png)");
	$(".ui-state-default").css("background-image","url(../images/player_slider_knob_normal_uidj4527.png)");
	$(".jqx-slider-slider").css("background-image","url(../images/player_slider_knob_normal_uidj4527.png)");
//	$("#source_popup_window").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/source_popup_bg_uidj4527.png)");
//	$(".source_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_popup_cursor_350_normal_uidj4527.png)");
//	$("#streaming_div").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/player_cloud_animation_disabled_uidj4527.png)");
//	$("#screen_browser").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/chrismas_uidj4527.png)");
//		$("#screen_browser").css("background-image","url(../images/chrismas_uidj4527.png)");
	$("#screen_browser").css("background-image","url(../images/chrismas_uidj4527.jpg)");
//	$("#backgroundListHeader").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_header_bg_new_uidj4527.png)");
//	$("#genrelist_wrapper, #artistlist_wrapper, #albumlist_wrapper, #tracklist_wrapper").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_bg_uidj4527.png)");
//	$("#albumListHeader, #trackListHeader, #artistListHeader, #genreListHeader").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_header_bg_new_uidj4527.png)");
//	$("#albumIcon").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_icon_album_uidj4527.png)");
//	$("#trackIcon").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_icon_tracks_uidj4527.png)");
//	$("#artistIcon").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_icon_artists_uidj4527.png)");
//	$("#genreIcon").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_icon_genres_uidj4527.png)");
//	$(".browser_button_cd").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cd_disabled_uidj4527.png)");
//	$(".browser_button_internal").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_internal_selected_uidj4527.png)");
//	$(".browser_button_usb").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_usb_disabled_uidj4527.png)");
//	$(".browser_button_sdcard").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sdcard_disabled_uidj4527.png)");
//	$(".browser_button_cloud").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_bluetooth_disabled_uidj4527.png)");
//	$(".browser_button_exit").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_exit_normal_uidj4527.png)");
//	$(".browser_button_exit:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_exit_pressed_uidj4527.png)");
//	$(".browser_button_albums").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_album_normal_uidj4527.png)");
//	$(".album_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_album_normal_uidj4527.png)");
//	$(".album_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_album_pressed_uidj4527.png)");
//	$(".album_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_album_selected_uidj4527.png)");
//	$(".album_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_album_pressed_uidj4527.png)");
//	$(".browser_button_artists").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_artists_normal_uidj4527.png)");
//	$(".artists_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_artists_normal_uidj4527.png)");
//	$(".artists_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_artists_pressed_uidj4527.png)");
//	$(".artists_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_artists_selected_uidj4527.png)");
//	$(".artists_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_artists_pressed_uidj4527.png)");
//	$(".browser_button_genres").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_genres_normal_uidj4527.png)");
//	$(".genres_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_genres_normal_uidj4527.png)");
//	$(".genres_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_genres_pressed_uidj4527.png)");
//	$(".genres_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_genres_selected_uidj4527.png)");
//	$(".genres_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_genres_pressed_uidj4527.png)");
//	$(".browser_button_tracks").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_tracks_normal_uidj4527.png)");
//	$(".tracks_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_tracks_normal_uidj4527.png)");
//	$(".tracks_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_tracks_pressed_uidj4527.png)");
//	$(".tracks_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_tracks_selected_uidj4527.png)");
//	$(".tracks_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_tracks_pressed_uidj4527.png)");
//	$(".browser_button_folders").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_normal_uidj4527.png)");
//	$(".folders_disabled_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_disabled_uidj4527.png)");
//	$(".folders_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_disabled_uidj4527.png)");
//	$(".folders_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_disabled_uidj4527.png)");
//	$(".folders_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_selected_uidj4527.png)");
//	$(".folders_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_folders_pressed_uidj4527.png)");
//	$(".browser_button_cd_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_button_normal_uidj4527.png)");
//	$(".browser_button_cd_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_button_pressed_uidj4527.png)");
//	$(".browser_button_cd_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_button_selected_uidj4527.png)");
//	$(".browser_button_cd_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_button_pressed_uidj4527.png)");
//	$(".browser_button_cd_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images//browser_cd_normal_uidj4527.png)");
//	$(".browser_button_cd_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cd_pressed_uidj4527.png)");
//	$(".browser_button_cd_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cd_selected_uidj4527.png)");
//	$(".browser_button_cd_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cd_pressed_uidj4527.png)");
//	$(".browser_button_internal_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_internal_normal_uidj4527.png)");
//	$(".browser_button_internal_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_internal_pressed_uidj4527.png)");
//	$(".browser_button_internal_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_internal_selected_uidj4527.png)");
//	$(".browser_button_internal_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_internal_pressed_uidj4527.png)");
//	$(".browser_button_cloud_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cloud_normal_uidj4527.png)");
//	$(".browser_button_cloud_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cloud_pressed_uidj4527.png)");
//	$(".browser_button_cloud_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cloud_selected_uidj4527.png)");
//	$(".browser_button_cloud_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_cloud_pressed_uidj4527.png)");
//	$(".browser_button_usb_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_usb_normal_uidj4527.png)");
//	$(".browser_button_usb_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_usb_pressed_uidj4527.png)");
//	$(".browser_button_usb_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_usb_selected_uidj4527.png)");
//	$(".browser_button_usb_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_usb_pressed_uidj4527.png)");
//	$(".browser_button_sdcard_normal_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sdcard_normal_uidj4527.png)");
//	$(".browser_button_sdcard_normal_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sdcard_pressed_uidj4527.png)");
//	$(".browser_button_sdcard_active_state").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sdcard_selected_uidj4527.png)");
//	$(".browser_button_sdcard_active_state:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sdcard_pressed_uidj4527.png)");
//	$(".trackListItem:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_cursor_normal_tracklist_uidj4527.png)");
//	$(".selectedItem").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_list_cursor_normal__uidj4527.png)");
//	$("#screen_settings").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/chrismas_uidj4527.png)");
//		$("#screen_settings").css("background-image","url(../images/chrismas_uidj4527.png)");
$("#screen_settings").css("background-image","url(../images/chrismas_uidj4527.jpg)");
/*	$(".uidj4527_test1_class, .uidj4527_test2_class").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x80_normal_uidj4527.png)");
	$(".uidj4527_test1_class:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x80_pressed_uidj4527.png)");
	$(".uidj4527_test2_class:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x80_pressed_uidj4527.png)");*/
//	$(".screen_button_exit").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_exit_normal_uidj4527.png)");
//	$(".screen_button_login").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_login_normal_uidj4527.png)");
//	$(".screen_button_login:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_login_pressed_uidj4527.png)");
//	$(".screen_button_sync").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sync_normal_uidj4527.png)");
//	$(".screen_button_sync:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_sync_pressed_uidj4527.png)");
//	$(".screen_button_delta_sync").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_delta_normal_uidj4527.png)");
//	$(".screen_button_delta_sync:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_delta_pressed_uidj4527.png)");
//	$(".screen_button_exit:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_exit_pressed_uidj4527.png)");
//	$("#update_popup_window").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/update_popup_512x200_uidj4527.png)");
//	$(".update_confirm_button").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x60_normal_uidj4527.png)");
//	$(".update_confirm_button:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x60_pressed_uidj4527.png)");
//	$(".update_cancel_button").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x60_normal_uidj4527.png)");
//	$(".update_cancel_button:active").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/background_set_120x60_pressed_uidj4527.png)");
/*	if(new_theme_selected == 0){
		new_theme_selected = 1;
//		$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/happy_new_year.png)");
	}else{
		new_theme_selected = 0;
		$("#screen_audioplayer").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/gen_bg_CloudPlayer2.png)");
	}*/
}

function update_cancel_clicked(){
	$("#update_popup_window").hide();
	update_confirm_dialog_show = 0;
}

function uidj4527_test1_clicked(){
	if(test1_state == 0){
		test1_state = 1;
		if(new_theme_selected == 0)
//			$(".screen_button_login").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/car_icon.png)");
				$(".screen_button_login").css("background-image","url(../images/car_icon.png)");
		else
//			$(".screen_button_login").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/car_icon_uidj4527.png)");
				$(".screen_button_login").css("background-image","url(../images/car_icon_uidj4527.png)");
	}else{
		test1_state = 0;
		if(new_theme_selected == 0)
//			$(".screen_button_login").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_login_normal.png)");
			$(".screen_button_login").css("background-image","url(../images/browser_login_normal.png)");
		else
//			$(".screen_button_login").css("background-image","url(/usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/images/browser_login_normal_uidj4527.png)");
			$(".screen_button_login").css("background-image","url(../images/browser_login_normal_uidj4527.png)");
	}
}

function uidj4527_test2_clicked(){
	if(test2_state == 0){
		test2_state = 1;
		$("#screen_button_exit_div").css("margin-top","100px");
	}
	else{
		test2_state = 0;
		$("#screen_button_exit_div").css("margin-top","240px");
	}
}

function source_button_clicked() {

	

	 if (isPausedState==1) // pause button gets shown so we're playing a song

      	play_pause_clicked(); // pause audio playing to avoid parallxel audio

       

	 jsDevApi.requestNativeAudioPlayer(); 

	 console.log("switched to native audio player");

				 

    /* Marketing request to remove Source popup */

	/*TEST browserWindowIsShown = true;

	onGestureClickReceived(); */

	

	/*if (showPopup==0) {

		showPopup = 1;

		$("#source_popup_window").show();

	}

	else {

		showPopup = 0;

		$("#source_popup_window").hide();

	}*/

        

}

	



function browse_button_clicked() {

	if (showBrowserScreen==0) {

		showBrowserScreen = 1;

		$("#screen_audioplayer").hide();

		$("#screen_browser").show();	

		

		state_inital_do();

	}

	else {

		showBrowserScreen = 0;

		$("#screen_browser").fadeOut('slow');

		$("#screen_audioplayer").fadeIn('fast');	

	}

}



function onRequestCompleted(xhr,textStatus) {

   if (xhr.status == 302) {

      location.href = xhr.getResponseHeader("Location");

   }

}







/**

 * Full synchronization with the users Dropbox account

 */

function settings_sync_clicked() 

{	

	if (USE_DROPBOX_CLOUD) {

		
		DROPBOX__SYNC_URL  = "/cloudplayerOIP/CodeIgniter_2.1.1/index.php/dropboxplayer/fullSync?path=";

//		DROPBOX__SYNC_URL = "/uidj4527Test/CodeIgniter_2.1.1/index.php/dropboxplayer/fullSync?path="

		syncUrl 		   = DROPBOX__SYNC_URL+$('#dropbox_inputfield_path').val();


	}

	else {

		syncUrl = DROPBOX__SYNC_URL+myUserId;

	}

	
	console.log(syncUrl);
	jQuery.ajax({

	  url:         syncUrl,

	  dataType:    "json",

	  timeout: 	   DROPBOX__TIMEOUT_SYNC,

	  beforeSend:  function(){ 

	  							$("#progress_loading_div").show();

								$("#progress_loading_text").text("Synchronizing your media ...");

							  },

	  complete:    function(){ 

	  	$("#progress_loading_div").hide();

	  	},

	  success:     function(data){
						
					   jsonData = data;
						 
					   console.log("jsonData= "+jsonData);
						
					  // jsDevApi.log(JSON.stringify(jsonData));  

//						alert('Success !');

					   toBeDeleted = new Array();
					   
//					   alert('before 11111 !');

					   for (i = 0; i < localStorage.length-1; i++) {    // delete old media entries identified via "/" character

					       
								
						    var key = localStorage.key(i);

	

	        				if (key.indexOf("/")==0)

	        				{

	        					toBeDeleted.push(key);                  // remember for deletion

	        				}

					   } 

					    	

					   for (i = 0; i<toBeDeleted.length; i++) {

					   		localStorage.removeItem(toBeDeleted[i]);    // finally delete from local storage 

					   }

					   			   

					   fillTracklist(jsonData);

					  

					   for (i = 0; i < jsonData.length; i++) {

						     // store in localstorage

						     localStorage.setItem(jsonData[i].path, JSON.stringify(jsonData[i]));

					   }

                       $("#progress_loading_div").hide();

                       updatePlayingContext(); 

				   },

	  error:       function(e){$("#progress_loading_div").hide(); /*jsDevApi.log("error during sync ");*/ alert('Not able to synchronize your media !');}

  });

}





function settings_delta_sync_clicked() 

{

    if (USE_DROPBOX_CLOUD) {

    	//uidj4527	test
//	DROPBOX__DELTA_SYNC_URL = "file:///usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/DeltaSync.php?path="

	DROPBOX__SYNC_URL  = "/cloudplayerOIP/CodeIgniter_2.1.1/index.php/dropboxplayer/fullSync?path=";

	      syncUrl                  = DROPBOX__DELTA_SYNC_URL+$('#dropbox_inputfield_path').val();

	//	syncUrl                  = DROPBOX__DELTA_SYNC_URL;//+$('#dropbox_inputfield_path').val();

//	        syncUrl                  = DROPBOX__DELTA_SYNC_URL+"file:///usr/bin/OIP_REF_HMI/ORH_HMI/HMI_Cloudplayer/uidj4527Test/dummyCloud/music/";

	}

	else {

		syncUrl = DROPBOX__DELTA_SYNC_URL+myUserId;
//		$("#screen_button_login_div").hide();

	}

	

	jQuery.ajax({

	  url:         syncUrl,

	  dataType:    "json",

	  timeout: 	   DROPBOX__TIMEOUT_SYNC,

	  beforeSend:  function(){ 

	  							$("#progress_loading_div").show();

								$("#progress_loading_text").text("Delta sync your media ...");

							  },

	  complete:    function(){ $("#progress_loading_div").hide();},

	  success:     function(data)

	  			   {

	  			   	  $("#progress_loading_div").hide();

	  			   	 

                       if (data.length==0) {

                       		alert("No file changes detected");	

                       } 

                       else {   // changes detected

	                       for (i = 0; i < data.length; i++) 

	                       {

		                          if (data[i].type=="added") {                    // add files with type="added" to jsonData

		                          	  jsonData.push(data[i]);   

		                          	  localStorage.setItem(data[i].path, JSON.stringify(data[i]));

		                          }

		                          else if (data[i].type=="deleted") 	          // remove files with type="deleted" from jsonData

		                          {

		                          	 for (var n = jsonData.length-1; n>=0; n--) 

		                          	 {

		                          	 	if (jsonData[n].path==data[i].path) {

		                          	 		localStorage.removeItem(jsonData[n].path);

		                          	 		jsonData.splice(n, 1);    

		                          	 	}

		                          	 }

		                          }

	                       }

	                       

	                       fillTracklist(jsonData);

	                       

                       	   updatePlayingContext(); 

	                   }

				   },

	  error:       function(e){$("#progress_loading_div").hide(); alert('Not able to synchronize Dropbox media !');}

  });

}





/**

 * Handles the opening/closing of the settings screen

 */

function settings_button_clicked() {

	
		
	if (showSettingsScreen==0) {
		
		
		showSettingsScreen = 1;

		$("#screen_audioplayer").hide();

		$("#screen_settings").show();	

		$("#progress_loading_div").hide();

		

		if (localStorage.getItem(DROPBOX_SYNC_USAGE)==1) // Dropbox will be used for synchronization

			$("#cloudmode_checkbox").attr('checked', true)

		else

			$("#cloudmode_checkbox").attr('checked', false)	

			

		if (localStorage.getItem(CONTINUOUS_PLAY)==1)  // Continuus play mode

			$("#continuous_playmode_checkbox").attr('checked', true)

		else

			$("#continuous_playmode_checkbox").attr('checked', false)		

			

	}

	else {
		
		
		
		showSettingsScreen = 0;

		$("#screen_audioplayer").show();

		$("#screen_settings").hide();	

		

		// store Dropbox media path into localStorage

		value = $('#dropbox_inputfield_path').val();

			

		localStorage.setItem(DROPBOX_PATH, value);  // use the input field value  and store in localStorage

	}

}





/**

 * Changes the repeat button look and sets internal flags for repeat song handling

 * For Source:Cloud repeat mode is implemented in OnPlayPositionChanged

 * For Source:Internal storage repeat mode is natively implemented by the OIP platform

 */

function repeat_clicked() {

  isRepeatOn = !isRepeatOn;

  if (isRepeatOn) {

//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
//    if(new_theme_selected == 0 || recover_default_theme == 1)
        if(recover_default_theme == 1 || first_theme == 1)

    		$("#repeat").attr('class','button_repeat repeat_active_state');
	else
		
		$("#repeat").attr('class','button_repeat_shuffle repeat_active_state_new');

  }

  else {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
   	       
	        $("#repeat").attr('class', 'button_repeat repeat_normal_state');

	else

		$("#repeat").attr('class','button_repeat_shuffle repeat_normal_state_new');

  }

  

  if (isCloudBrowsingActive==0) {

  	oNativeDevApi.SetRepeatMode(isRepeatOn);

  }

  else {

  	// Cloud repeat mode is implemented in OnPlayPositionChanged

  }
//uidj4527 if we try to use jQuery to change the attribute of css class, it will override the active pseudo-class. But if we use !important, jQuery can not change the background image of the active state. So we need to change the background image of the button every time when we click it.

}





function shuffle_clicked() {

  isShuffleOn = !isShuffleOn;

  if (isShuffleOn) {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
   		 $("#shuffle").attr('class', 'button_shuffle shuffle_active_state');
	else
		$("#shuffle").attr('class','button_repeat_shuffle shuffle_active_state_new');

  }

  else {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
    		$("#shuffle").attr('class', 'button_shuffle shuffle_normal_state');
	else
		
		$("#shuffle").attr('class','button_repeat_shuffle shuffle_normal_state_new');
  }

  

  if (isCloudBrowsingActive==0) {

  	oNativeDevApi.SetRandomMode(isShuffleOn);

  }

  else {

  	 	// Cloud shuffle mode is implemented in OnPlayPositionChanged

  }

	  

}





/**

 * Call to the native part - just closes the whole browser

 */

function home_clicked() {

        if (isPausedState==1) // pause button gets shown so we're playing a song

            play_pause_clicked(); // pause audio playing to avoid parallel audio



	jsDevApi.closeBrowser(); 

}





function OnPlayingListChanged()

{

  alert("OnPlayingListChanged");

  var i32NewPlayingIndex = oNativeDevApi.GetCurrentPlayingItemIndex();

  alert("OnPlayingListChanged:playing=" + playingIndex + ", newPlaying=" + i32NewPlayingIndex);

  playedIndex = -1;

  playingIndex = i32NewPlayingIndex;



  var listAsJsonString = oNativeDevApi.GetCurrentPlayingList();

  alert("OnPlayingListChanged:" + listAsJsonString);

  jsonData = eval("(" + listAsJsonString + ")");

  

  jQuery('#scroller ol').html("");  //clear list first 

  

  for(i = 0; i < jsonData.playingListItem.length; i++) {

       jQuery('#scroller ol').append('<li class="listItem" id="item_'+i+'"><span class="list_text_entry">'+jsonData.playingListItem[i].title.truncate(16)+'</span></li>');

  }

  

  updatePlayingContext();

}



function OnPlayingListReseted()

{

  //todo maybe clear list, or disable list operations

}



function OnPlayingListMetadataLoaded(a_i32ItemIndex)

{



}



function OnAlbumCoverImageReady(a_strCoverImageFilePath)

{

  alert("OnAlbumCoverImageReady:" + a_strCoverImageFilePath);

  jsonData.playingListItem[playingIndex].cover = a_strCoverImageFilePath;

  updatePlayingContext();

}



function OnPlayStateChanged(a_bPlaying)

{

  isPausedState = a_bPlaying;

  

  if (isPausedState==0) {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
   		 $("#play_pause").attr('class', 'button_play_pause play_state');
	else
		
		 $("#play_pause").attr('class', 'button_play_pause_new play_state_new');
  }

  else {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)

   		 $("#play_pause").attr('class', 'button_play_pause pause_state');
	else
		
		 $("#play_pause").attr('class', 'button_play_pause_new pause_state_new');

  }

}





/**

 * Shows current track timing info

 * For Source: Cloud implementation of modes (repeat, shuffle, continuous play) is done here

 */

function OnPlayPositionChanged(a_i32Position) {   

  var currentTime = convertTimeStamp(a_i32Position);

  $("#timestamp_current").text(currentTime);  

  $('#slider').slider('value', a_i32Position/1000);

  $( "#progressbar" ).progressbar({ value: a_i32Position/1000 });



  // continuous play / repeat mode

  // for internal storage this is done in the native media player API 

  if (isCloudBrowsingActive==1) 

  { 

		if (localStorage) 

		{

			// check persistency for play mode - if nothing is set (yet) continuous mode will be the default mode

			if (localStorage.getItem(CONTINUOUS_PLAY)==null) 

			{

				localStorage.setItem(CONTINUOUS_PLAY, CONTINUOUS_PLAY_DEFAULT);

			}

		

			if (localStorage.getItem(CONTINUOUS_PLAY)==1) // continuous play mode is on - so do it

			{

				if (!isRepeatOn && !isShuffleOn) 

				{

					if ($("#timestamp_max").text()!="0:00" &&  currentTime==$("#timestamp_max").text()) {

					

						if ((parseInt(playingIndex)+1)<jsonData.length) {

							listItemSelectedByIndex(parseInt(playingIndex)+1);  // select next track for continuous play

						}

					}

				}

				else if (isRepeatOn)// do song repeat if track has ended

				{

					if (currentTime==$("#timestamp_max").text()) {

						updatePlayingContext();

					}

				}

				else if (isShuffleOn && (currentTime==$("#timestamp_max").text()))

				{

					playRandom();

				}

			}

			else // continuous play mode is off 

			{

				if (isRepeatOn && (currentTime==$("#timestamp_max").text()))    // check for repeat song	

					updatePlayingContext(); 

			}

		}	

  }

  else  { /* in source mode "Internal storage" - continuous mode done natively */ }  

}



function playRandom() {

	var randomTitle = Math.round(Math.random() * ((jsonData.length-1) - 1) + 1);

	var randomIndex = (((playingIndex + randomTitle)) % (jsonData.length-1));

	listItemSelectedByIndex(randomIndex);

}





function OnPlayLengthChanged(a_i32Position)

{

  var length = convertTimeStamp(a_i32Position);

  $("#timestamp_max").text(length);

  $('#slider').slider({'max': a_i32Position/1000}); 

  $( "#progressbar" ).progressbar({ max: a_i32Position/1000 });

  durationSet = true;



}



function OnRandomModeChanged(a_bRandomMode)

{

  alert("OnRandomModeChanged:" + a_bRandomMode);

  isShuffleOn = a_bRandomMode;

  if (isShuffleOn) {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
   		 $("#shuffle").attr('class', 'button_shuffle shuffle_active_state');
	else
		 $("#shuffle").attr('class','button_repeat_shuffle shuffle_active_state_new');

  }

  else {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
    if(recover_default_theme == 1 || first_theme == 1)

    		$("#shuffle").attr('class', 'button_shuffle shuffle_normal_state');
	else
		$("#shuffle").attr('class','button_repeat_shuffle shuffle_normal_state_new');

  }

}



function OnRepeatModeChanged(a_bRepeatMode)

{

  alert("OnRepeatModeChanged:" + a_bRepeatMode);

  isRepeatOn = a_bRepeatMode;

  if (isRepeatOn) {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
       if(recover_default_theme == 1 || first_theme == 1)
    		$("#repeat").attr('class', 'button_repeat repeat_active_state');
	else
		$("#repeat").attr('class','button_repeat_shuffle repeat_active_state_new');
  }	

  else {
//	if(new_theme_selected == 0 && changeMainWindowBackground == 0)
     if(recover_default_theme == 1 || first_theme == 1)
   		 $("#repeat").attr('class', 'button_repeat repeat_normal_state');
	else
		$("#repeat").attr('class','button_repeat_shuffle repeat_normal_state_new');

  }


}

