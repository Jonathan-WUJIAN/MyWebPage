var BROWSER_STATE      = "BrowserState";

var hiddenContainers = {};
var showingContainers = [];

var ALL_STATES = ['albums_root', 'artists_root', 'genres_root','tracks_root', 'albums_tracks', 
			'artists_albums', 'artists_tracks', 'genres_artists', 'genres_albums', 'genres_tracks', 'play_track'];

var sm = undefined;

var currentTrack  = undefined;
var currentArtist = undefined;
var currentGenre  = undefined;
var currentAlbum  = undefined;

var currentLayer = undefined;
var shadowLayers = [];

var albumReference  = undefined;
var artistReference = undefined;
var genreReference = undefined;

function storeState(state) {
	currentState = state;
	
	if (localStorage) {
		localStorage.setItem(BROWSER_STATE, currentState);
	}
}

function state_inital_do() {
	// do some initialisation  - recover last HMI state
    
    if (localStorage && localStorage.getItem(BROWSER_STATE)!=null) {
    	currentState = localStorage.getItem(BROWSER_STATE);
    	switch(currentState) {
    		case 'albums_tracks' :
    		case 'albums_root' 	 : sm.ALBUMS_BUTTON_CLICK();  break; 
    		case 'artists_tracks':
    		case 'artists_albums':
    		case 'artists_root'	 : sm.ARTISTS_BUTTON_CLICK(); break;
    		case 'genres_artists':
    		case 'genres_albums' :
    		case 'genres_tracks' :
    		case 'genres_root' 	 : sm.GENRES_BUTTON_CLICK(); break;
    		case 'play_track'	 : 
    		case 'tracks_root' 	 : sm.TRACKS_BUTTON_CLICK(); break;
    	}
    }
    else {
		sm.ALBUMS_BUTTON_CLICK();
	}
}

function unselect() {
	
	$("#album").attr('class', 'browser_button_albums album_normal_state'); 
	$("#artists").attr('class', 'browser_button_artists artists_normal_state');
	$("#genres").attr('class', 'browser_button_genres genres_normal_state'); 
	$("#tracks").attr('class', 'browser_button_tracks tracks_normal_state'); 
	$("#folders").attr('class', 'browser_button_folders folders_normal_state'); 
}

function toggleButton(button, className) {
	unselect();
	button.attr('class', className);  // change button state
}

function albumRoot() {
	// storeState("showRoot('albums');");
	showRoot('albums');
	toggleButton($("#album"), 'browser_button_albums album_active_state');
}

function artistRoot() {
	// storeState("showRoot('artists');");
	showRoot('artists');
	toggleButton($("#artists"), 'browser_button_artists artists_active_state');
}

function genresRoot() {
	// storeState("showRoot('genres');");
	showRoot('genres');
	toggleButton($("#genres"), 'browser_button_genres genres_active_state');
}

function tracksRoot() {
	// storeState("showRoot('tracks');");
	showRoot('tracks');
	toggleButton($("#tracks"), 'browser_button_tracks tracks_active_state');
}

$(document).ready(function() {
	
	/* Initialize Button- and Item-Click-Listeners */
	
	sm = StateMachine.create({
	  initial: 'albums_root',
	  events: [
	    { name: 'ALBUM_ITEM_CLICK',     from: 'albums_root', to: 'albums_tracks' },
	    { name: 'ALBUM_ITEM_CLICK',     from: 'artists_albums', to: 'artists_tracks' },
	    { name: 'ALBUM_ITEM_CLICK',     from: 'genres_albums', to: 'genres_tracks' },
	    { name: 'ARTIST_ITEM_CLICK',    from: 'artists_root', to: 'artists_albums'},
	    { name: 'ARTIST_ITEM_CLICK',    from: 'genres_artists', to: 'genres_albums'},
	    { name: 'GENRE_ITEM_CLICK',     from: 'genres_root', to: 'genres_artists' },
	    { name: 'TRACK_ITEM_CLICK',     from: ['tracks_root', 'albums_tracks', 'artists_tracks', 'genres_tracks'], to: 'play_track' },
	    { name: 'ALBUMS_BUTTON_CLICK',  from: ALL_STATES, to: 'albums_root' },
	    { name: 'ARTISTS_BUTTON_CLICK', from: ALL_STATES, to: 'artists_root'      },
	    { name: 'GENRES_BUTTON_CLICK',  from: ALL_STATES, to: 'genres_root' },
	    { name: 'TRACKS_BUTTON_CLICK',  from: ALL_STATES, to: 'tracks_root' },
	    { name: 'ALBUM_SHADOW_CLICK',   from: 'albums_tracks', to: 'albums_root' },
	    { name: 'ALBUM_SHADOW_CLICK',   from: 'genres_tracks', to: 'genres_albums' },
	    { name: 'ALBUM_SHADOW_CLICK',   from: 'artists_tracks', to: 'artists_albums' },
	    { name: 'ARTIST_SHADOW_CLICK',  from: 'artists_albums', to: 'artists_root' },
	    { name: 'ARTIST_SHADOW_CLICK',  from: 'genres_albums', to: 'genres_artists' },
	    { name: 'GENRE_SHADOW_CLICK',   from: 'genres_artists', to: 'genres_root' },
	  ],
	 callbacks: {
	    onALBUM_ITEM_CLICK: 	function(event, from, to) 	   { storeState(sm.current); console.log(sm.current); albumItemClicked(currentAlbum); },
	    onARTIST_ITEM_CLICK:  	function(event, from, to) 	   { storeState(sm.current); console.log(sm.current); artistItemClicked(currentArtist); },
	    onGENRE_ITEM_CLICK:  	function(event, from, to)      { storeState(sm.current); console.log(sm.current); genreItemClicked(currentGenre); },
	    onTRACK_ITEM_CLICK: 	function(event, from, to)      { /* We don't want to store this state */ console.log(sm.current); trackItemClicked(currentTrack); },
	    onALBUMS_BUTTON_CLICK:  function(event, from, to)      { storeState(sm.current); console.log(sm.current); albumRoot(); },
	    onARTISTS_BUTTON_CLICK: function(event, from, to)      { storeState(sm.current); console.log(sm.current); artistRoot(); },
	    onGENRES_BUTTON_CLICK:  function(event, from, to)      { storeState(sm.current); console.log(sm.current); genresRoot(); },
	    onTRACKS_BUTTON_CLICK:  function(event, from, to)      { storeState(sm.current); console.log(sm.current); tracksRoot(); },
	    onALBUM_SHADOW_CLICK:   function(event, from, to)      { storeState(sm.current); console.log(sm.current); removeLastLayer(); },
	    onARTIST_SHADOW_CLICK:  function(event, from, to)      { storeState(sm.current); console.log(sm.current); removeLastLayer(); },
	    onGENRE_SHADOW_CLICK:   function(event, from, to)      { storeState(sm.current); console.log(sm.current); removeLastLayer(); },
	  }
	});
	
	// fsm.init();
	
	$("#shadowAlbum").click(function() {
		sm.ALBUM_SHADOW_CLICK();
	});
	
	$("#shadowArtist").click(function() {
		sm.ARTIST_SHADOW_CLICK();
	});
	
	$("#shadowGenre").click(function() {
		sm.GENRE_SHADOW_CLICK();
	});
	
	$("#album").click(function() {
		sm.ALBUMS_BUTTON_CLICK();
	});
	
	$("#artists").click(function() {
		sm.ARTISTS_BUTTON_CLICK();
	});
	
	$("#genres").click(function() {
		sm.GENRES_BUTTON_CLICK();
	});
	
	$("#tracks").click(function() {
		sm.TRACKS_BUTTON_CLICK();
	});
	
	$(".albumListItem").live('click', function(e) {
		if (!myScroll.animating)  {
			currentAlbum = $(this).text();
			
			if (albumReference!=undefined) {
				albumReference.removeClass("selectedItem");
			}
			albumReference = $(this);
			$(this).addClass("selectedItem");
    		sm.ALBUM_ITEM_CLICK();
         }
    });
    
    $(".trackListItem").live('click', function(e) {
    	if (!myScroll.animating)  {
    		currentTrack = $(this).text();
    		sm.TRACK_ITEM_CLICK();
    	}
    });
    
    $(".artistListItem").live('click', function(e) {
    	if (!myScroll.animating)  {
    		currentArtist = $(this).text();
    		
    		if (artistReference!=undefined) {
				artistReference.removeClass("selectedItem");
			}
			artistReference = $(this);
			$(this).addClass("selectedItem");
			
    		sm.ARTIST_ITEM_CLICK();
    	}
    });
    
    $(".genreListItem").live('click', function(e) {
    	if (!myScroll.animating)  {
    		currentGenre = $(this).text();
    		
    		if (genreReference!=undefined) {
				genreReference.removeClass("selectedItem");
			}
			
			genreReference = $(this);
			$(this).addClass("selectedItem");
			
    		sm.GENRE_ITEM_CLICK();
    	}
    });
    
    $(".button_browse").click(function() {
		browse_button_clicked()
	});
	
	$(".browser_button_exit").click(function() {
		browserScreenExitClicked();
	});
	
	$(".browser_button_sdcard").click(function() {
		switch2NativePlayer();
	});
	
	
	$(".browser_button_usb").click(function() {
		switch2NativePlayer();
	});
    
    
    $(".browser_button_internal").click(function() {
		switch2NativePlayer();
	});
	
	
	$(".browser_button_cd").click(function() {
		switch2NativePlayer();
	});
    
    
});


function switch2NativePlayer() {
	if (isPausedState==1) // pause button gets shown so we're playing a song
      	play_pause_clicked(); // pause audio playing to avoid parallxel audio
       
	jsDevApi.requestNativeAudioPlayer(); 
}

function initContainers() {
	$(".shadowLayer").hide();
	hiddenContainers = {
		'albums' : $("#albumListContainer"),
		'artists': $("#artistListContainer"),
		'genres' : $("#genreListContainer"),
		'tracks' : $("#trackListContainer")
	}
	
	showingContainers = [];
}

function showRoot(containerName) {
	/*
	 * Fill all lists with initial values
	 * initialize containers, show the first one and hide all the others
	 */
	fillAlbumsList();
	fillArtistsList();
	fillGenreList();
	fillBrowserTrackList();
	initContainers();
	showingContainers.push(hiddenContainers[containerName]);
	delete hiddenContainers[containerName];
	
	showingContainers[0].animate({ marginLeft: "-510px", }, 1500 );
	
	jQuery.each(hiddenContainers, function(name, value) {
      value.animate({ marginLeft: "0px", }, 1500 );
    });
    
    currentLayer = containerName;
} 

function addLayer(layerName) {
	/*
	 * Overlay the last layer with the new added one
	 */
	jQuery.each(showingContainers, function(index, layer) {
	  var newMargin = layer.css("margin-left").slice(0,-2);
	  newMargin = (newMargin-150)+"px";
	  console.log(newMargin);
	  layer.find(".shadowLayer").fadeIn();
      layer.animate({ marginLeft: '-660px', }, 1500, function() {
   	  	
  	  });
      // var shadow = layer.find(".shadowLayer");
      // shadow.show();
    });
    
    showingContainers.push(hiddenContainers[layerName]);
    delete hiddenContainers[layerName];
    
    showingContainers[showingContainers.length-1].animate({ marginLeft: "-540px", }, 1500 );
    shadowLayers.push(currentLayer);
    currentLayer = layerName;
}

function removeLastLayer() {
	showingContainers[showingContainers.length-1].animate({ marginLeft: "0px", }, 1500 );
	
	hiddenContainers[currentLayer] = showingContainers[showingContainers.length-1];
	showingContainers.pop();
	
	showingContainers[showingContainers.length-1].find(".shadowLayer").fadeOut();
	showingContainers[showingContainers.length-1].animate({ marginLeft: "-540px", }, 1500, function() {
   	  	// $(this).find(".shadowLayer").hide();
  	});
	
	currentLayer = shadowLayers[shadowLayers.length-1];
	shadowLayers.pop();
	
}

/*
 * Following happens when some items were clicked
 */
function albumItemClicked(name) {
	fillTrackListByAlbumName(name);
	addLayer('tracks');
}

function artistItemClicked(name) {
	addLayer('albums');
	fillAlbumListByArtistName(name);
}

function genreItemClicked(name) {
	fillArtistListByGenre(name);
	addLayer('artists');
}

function trackItemClicked(name) {
	currentTrack = name;
	browserScreenExitClicked();
	updatePlayingContext();
	
	jQuery.each(jsonData, function(index, track) {
	  if (track['title'] == name) {
	  	console.log("Select "+name+" index"+index);
	  	listItemSelectedByIndex(index);  
	  	return;
	  }
    });
}

/**
 * just hide the whole div #screen_browser
 */
function browserScreenExitClicked() {
	browse_button_clicked();
}


/* --------------------- Methods for filling Lists -----------------------------------*/


/* just builds an array of all album names */
function buildAllAlbumNames() {
	var albums = [];
	
	$.each(jsonData, function(i, item) {
	    if ($.inArray(item.albumname, albums)==-1) {
			albums.push(item.albumname);
		}
	});
	
	return albums;
}

function buildAllTrackNames() {
	var tracks = [];
	
	$.each(jsonData, function(i, track) {
		if ($.inArray(track.title, tracks)==-1) {
			tracks.push(track.title);
		}
	});
	
	return tracks;
}


/* just builds an array of all album names */
function buildAllArtistNames() {
	var artists = [];
	
	$.each(jsonData, function(i, item) {
	    if ($.inArray(item.artist, artists)==-1) {
			artists.push(item.artist);
		}
	});
	
	return artists;
}

/* just builds an array of all genre names */
function buildAllGenreNames() {
	var genres = [];
	
	$.each(jsonData, function(i, item) {
		if ($.inArray(item.genre, genres)== -1) {
			genres.push(item.genre);
		}
	});
	
	return genres;
}


/* returns an album cover path to a given albumname */
function getAlbumCover(albumName) {
	var cover;
	$.each(jsonData, function(i, item) {
	    if (item.albumname == albumName) {
			cover = item.coverArtUrl;
			return false;  // break loop
		}
	});
	
	return cover;
}


/* fills albums list */
function fillAlbumsList() {
	// get names of all albums - clear list first and fill with corresponding album names
    var albums = buildAllAlbumNames();
    // $("body").off("click", ".albumListItem", addLayer('tracks'));
    
	$("#scrollerAlbumList ul").empty();
	
	var scollerAlbumListUL = $("#scrollerAlbumList ul"); // cache it
	
	// fills the ul with cover and album name
	$.each(albums, function(i, album) {
		if (getAlbumCover(album) == "") {
			scollerAlbumListUL.append('<li class="albumListItem"><img class="albumCover" id="cover'+i+'">'+album+"</li>");
			imageLoader(album, $("#cover" + i ));
		} else {
			scollerAlbumListUL.append('<li class="albumListItem"><img class="albumCover" src='+getAlbumCover(album)+'>'+album+"</li>");
		}
		// scollerAlbumListUL.append('<li class="listItem albumListItem"><img class="albumCover" src='+getAlbumCover(album)+'>'+album+"</li>");
	});
}

/* fills artists list */
function fillArtistsList() {
	// get names of all artists - clear list first and fill with corresponding artist names
    var artists = buildAllArtistNames();
     // $("body").off("click", ".artistListItem", addLayer('albums'));
	$("#scrollerArtistList ul").empty();
	
	var scollerArtistListUL = $("#scrollerArtistList ul"); // cache it
	
	// fills the ul with artist name
	$.each(artists, function(i, artist) {
		scollerArtistListUL.append('<li class="artistListItem"><span class="list_text_entry">'+artist+"</span></li>");
	});
}

/* fills genre list */
function fillGenreList() {
	// get names of all genres - clear list first and fill with corresponding genre names
    var genres = buildAllGenreNames();
    // $("body").off("click", ".genreListItem", addLayer('artists'));
	$("#scrollerGenreList ul").empty();
	
	var scollerGenreListUL = $("#scrollerGenreList ul"); // cache it
	
	// fills the ul with genre name
	$.each(genres, function(i, genre) {
		scollerGenreListUL.append('<li class="genreListItem">'+genre+"</li>");
	});
}

/* fills track list */
function fillBrowserTrackList() {
    var tracks = buildAllTrackNames();
    
    var scollerTrackListUL = $("#scrollerTrackList ol"); // cache it
	scollerTrackListUL.empty();
	
	// fills the ul with genre name
	$.each(tracks, function(i, track) {
		scollerTrackListUL.append('<li class="trackListItem"><span class="list_text_entry">'+track+"</span></li>");
	});
}

function getTrackListByAlbumName(albumName) {
	var tracks = [];
	
	$.each(jsonData, function(i, item) {
	    if (item.albumname == albumName) {
			tracks.push(item.title);
		}
	});
	
	return tracks;
}

function getTrackListByArtistName(artistName) {
	var tracks = [];
	
	$.each(jsonData, function(i, item) {
		if (item.artist == artistName) {
			tracks.push(item.title);
		}
	});
	
	return tracks;
}

function getAlbumListByArtistName(artistName) {
	var albums = [];
	
	$.each(jsonData, function(i, item) {
		if ((item.artist == artistName) &&  (albums.indexOf(item.albumname)==-1)){
			albums.push(item.albumname);
		}
	});
	
	return albums;
}

function getArtistListByGenresName(genreName) {
	var artists = [];
	
	$.each(jsonData, function(i, item) {
		if ((item.genre == genreName) &&  (artists.indexOf(item.artist)==-1)){
			artists.push(item.artist);
		}
	});
	
	return artists;
}

function fillTrackListByAlbumName(albumName) {
	// get names of all albums - clear list first and fill with corresponding album names
    var tracks = getTrackListByAlbumName(albumName);
    
	$("#scrollerTrackList ol").empty();
	
	var scollerTrackListUL = $("#scrollerTrackList ol"); // cache it
	
	// fills the ul with cover and album name
	$.each(tracks, function(i, track) {
		scollerTrackListUL.append('<li class="trackListItem"><span class="list_text_entry">'+track+"</span></li>");
	});
}

function fillTrackListByArtistName(artistName) {
	// get names of all artists - clear list first and fill with corresponding artist names
    var tracks = getTrackListByArtistName(artistName);
	
	$("#scrollerTrackList ol").empty();
	
	var scollerTrackListUL = $("#scrollerTrackList ol"); // cache it
	
	// fills the ul with cover and album name
	$.each(tracks, function(i, track) {
		scollerTrackListUL.append('<li class="trackListItem"><span class="list_text_entry">'+track+"</span></li>");
	});
}

function fillAlbumListByArtistName(artistName) {
	var albums = getAlbumListByArtistName(artistName);
	
	// $(".albumListItem").live('click', function(e) {
    	// albumItemClicked($(this).text());
    // });
    
    var scrollerAlbumListUL = $("#scrollerAlbumList ul");
	scrollerAlbumListUL.empty();
	
	$.each(albums, function(i, album) {
		var test = getAlbumCover(album);
		if (getAlbumCover(album) == "") {
			scrollerAlbumListUL.append('<li class="albumListItem"><img class="albumCover" id="cover'+i+'">'+album+"</li>");
			imageLoader(album, $("#cover" + i ));
		} else {
			scrollerAlbumListUL.append('<li class="albumListItem"><img class="albumCover" src='+getAlbumCover(album)+'>'+album+"</li>");
		}
	});
}

function fillArtistListByGenre(genreName) {
	var artists = getArtistListByGenresName(genreName);
	
	// $(".artistListItem").live('click', function(e) {
    	// artistItemClicked($(this).text());
    // });
    var scrollerArtistListUL = $("#scrollerArtistList ul");
	scrollerArtistListUL.empty();
	
	$.each(artists, function(i, artist) {
		scrollerArtistListUL.append('<li class="artistListItem">'+artist+"</li>");
	});
}

function imageLoader(album, image) {
	
	var item = undefined;
	$.each(jsonData, function(i, itemx) {
	    if (itemx.albumname == album) {
			item = itemx;
			return false;
		}
	});
	
	 var audioscrobbler__REST_URL = item.lastfmURL;
	 var path                     = item.path;
	 var coverArtUrl              = item.coverArtUrl;
	 
	 // if (coverArtUrl=="") {  // image url was never requested at all from Lastfm - so do this step now
		jQuery.ajax({
			  url:         audioscrobbler__REST_URL+"&format=json",
			  dataType:    "json",
			  timeout: 	   AUDISCROBBLER__LAZY_IMAGE_LOAD_TIMEOUT,
			  beforeSend:  function(){ 
			  					image.attr('src','css/images/ajax-loader.gif');
	  							// $("#image_loader_icon").show();        // show the image loader icon until the cover art image has been loaded
						   }, 
			  success:     function(data){
								var cover = data["album"]["image"][2]["#text"];  // extract img URL from LastFM Response

								if (localStorage) {
									var json = jQuery.parseJSON(localStorage.getItem(path));
									json.coverArtUrl = cover;
									localStorage.setItem(path, JSON.stringify(json));
									
									// store new value into jsonData so next selection REST request is not neccessary
									item.coverArtUrl = cover;
								}
								
								// improve image loading - see i.e. http://blog.endpoint.com/2011/03/lazy-image-loading-jquery-javascript.html
								// $("#player_info_cd_cover").css("background-image", "url(" + cover + ")");
								// $("#image_loader_icon").hide();
								image.attr('src', cover);
						   },
			  error:       function(e){
								// $("#image_loader_icon").hide();
								image.attr('src','./images/cover/player_info_cd_cover.png');
						        // $("#player_info_cd_cover").css("background-image", "url(./images/cover/player_info_cd_cover.png)");
						   }
  });
	 // }
	 // else { // img url is existing - no need to do an AJAX call again
// 		  
		  // if (localStorage) {
			   // var json = JSON.parse(localStorage.getItem(path));
			   // image.attr('src', json.coverArtUrl);
		  // }  
	 // } 
}