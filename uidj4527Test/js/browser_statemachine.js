/* State definition for the Browser statemachine */
const STATE_INITITAL        = "0";
const STATE_ALBUMS_ROOT     = "1";
const STATE_ALBUMS_TRACKS   = "2";
const STATE_ARTISTS_ROOT    = "3";
const STATE_ARTISTS_ALBUMS  = "4";
const STATE_ARTISTS_TRACKS  = "5";
const STATE_GENRES_ROOT 	= "6";
const STATE_GENRES_ARTISTS 	= "7";
const STATE_GENRES_ALBUMS 	= "8";
const STATE_GENRES_TRACKS 	= "9";

/* event definition */
const EVENT_ON_ALBUM_ITEM_CLICK        = 0;
const EVENT_ON_ALBUMS_SIDEBAR_CLICK    = 1;
const EVENT_ON_ALBUMS_BUTTON_CLICK     = 2;
const EVENT_ON_ARTISTS_BUTTON_CLICK    = 3;
const EVENT_ON_ARTIST_ITEM_CLICK       = 4;
const EVENT_ON_ARTIST_SIDEBAR_CLICK    = 5;
const EVENT_ON_TRACK_CLICK             = 6;
const EVENT_ON_GENRES_BUTTON_CLICK     = 7;
const EVENT_ON_TRACKS_BUTTON_CLICK     = 8;
const EVENT_ON_FOLDERS_BUTTON_CLICK    = 9;
const EVENT_ON_GENRE_ITEM_CLICK  	   = 10;

var BROWSER_STATE      = "BrowserState";   // localstorage key which holds the current state of the Browser statemachine

var currentState = STATE_INITITAL;         // holds the current state of the browser statemachine 


function storeState(state) {
	currentState = state;
	
	if (localStorage) {
		localStorage.setItem(BROWSER_STATE, currentState);
	}
}

function registerTrackClickEvent() {
	$(".trackListItem").live('click', function(e) {
		currentTrack = $(this).text();  // or by index: $(this).index()
		state_albums_tracks_do(EVENT_ON_TRACK_CLICK);
	});
}


function state_albums_root_do(evt) {
	
	if (evt==EVENT_ON_ALBUM_ITEM_CLICK) {
		$("#genreListContainer").animate({ marginLeft: "0px", }, 1500 );
		$("#artistListContainer").animate({ marginLeft: "0px", }, 1000 );	
		$("#albumListContainer").animate({ marginLeft: "-610px", }, 1500 );
		$("#trackListContainer").animate({ marginLeft: "-540px", }, 1500 );	
		
		fillTrackListByAlbumName(currentAlbum);
		registerTrackClickEvent();
		
		storeState(STATE_ALBUMS_TRACKS);
	} else {
		openListByEvent(evt);
	}
	return;
	
	if (evt==EVENT_ON_ALBUM_ITEM_CLICK) {
		
		if (currentState==STATE_ALBUMS_ROOT) {
			// slide left main list div
			// slide in tracks div
			$("#albumListContainer").animate({ marginLeft: "-=160px", }, 1000 );	
			$("#trackListContainer").animate({ marginLeft: "-=540px", }, 1500 );	
			fillTrackListByAlbumName(currentAlbum);
			
			// register to get click event on list item
			$(".trackListItem").live('click', function(e) {
				currentTrack = $(this).text();  // or by index: $(this).index()
				state_albums_tracks_do(EVENT_ON_TRACK_CLICK);
			});
	

			storeState(STATE_ALBUMS_TRACKS);
		}
		else if (currentState==STATE_ALBUMS_TRACKS)
		{
			$("#albumListContainer").animate({ marginLeft: "0px", }, 1000 );	
			$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
			storeState(STATE_ALBUMS_ROOT);
		}
	}
	
	else if (evt==EVENT_ON_ARTISTS_BUTTON_CLICK) {
		// slide away (partly) tracks div
		// slide back main list div
		storeState(STATE_ARTISTS_ROOT);
	}
	else {
		openListByEvent(evt);
	}
	
	console.log("state_albums_root_do     current state: "+currentState);
}

function state_albums_tracks_do(evt) {
	if (evt == EVENT_ON_TRACK_CLICK) {
		browserScreenExitClicked();  // go back to main screen
	}
	else {
		openListByEvent(evt);
	}
}

function store_Album() {
	currentAlbum = $(this).text();  // or by index: $(this).index()
	openListByEvent(EVENT_ON_ALBUM_ITEM_CLICK);
	// state_albums_root_do(EVENT_ON_ALBUM_ITEM_CLICK);
}

function store_Artist() {
	currentArtist = $(this).text();  // or by index: $(this).index()
	openListByEvent(EVENT_ON_ARTIST_ITEM_CLICK);
	// state_artists_root_do(EVENT_ON_ARTIST_ITEM_CLICK);
}

function store_Genre() {
	currentGenre = $(this).text();  // or by index: $(this).index()
	openListByEvent(EVENT_ON_GENRE_ITEM_CLICK);
	// state_genres_root_do(EVENT_ON_GENRE_ITEM_CLICK);
}

function state_inital_do(evt) {
	
	// do some initialisation  - recover last HMI state
    
    if (localStorage && localStorage.getItem(BROWSER_STATE)!=null) {
    	currentState = localStorage.getItem(BROWSER_STATE);
    }
    else {
		storeState(STATE_ALBUMS_ROOT);
	}
	
	// populate albums list
    fillAlbumsList();
    fillArtistsList();
    fillGenreList();
	
	// register to get click event on list item
    $("body").on("click", ".albumListItem", store_Album);
    $("body").on("click", ".artistListItem", store_Artist);
    $("body").on("click", ".genreListItem", store_Genre);
  
    console.log("state_inital_do     current state: "+currentState);
}

function state_artists_root_do(evt) {
	if (evt==EVENT_ON_ARTIST_ITEM_CLICK) {
		$("#genreListContainer").animate({ marginLeft: "0px", }, 1500 );
		$("#artistListContainer").animate({ marginLeft: "-610px", }, 1000 );	
		$("#albumListContainer").animate({ marginLeft: "-540px", }, 1500 );
		$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
		
		fillAlbumListByArtistName(currentArtist);
		
		storeState(STATE_ARTISTS_ALBUMS);
	} else {
		openListByEvent(evt);
	}
	return;
	
	if (evt==EVENT_ON_ARTIST_ITEM_CLICK) {
		
		if (currentState==STATE_ARTISTS_ROOT) {
			// slide left main list div
			// slide in tracks div
			$("#albumListContainer").animate({ marginLeft: "540px", }, 1500 );
			$("#artistListContainer").animate({ marginLeft: "-660px", }, 1000 );	
			$("#trackListContainer").animate({ marginLeft: "-540px", }, 1500 );	
			fillTrackListByArtistName(currentArtist);
			registerTrackClickEvent();
			
			// register to get click event on list item
			$(".trackListItem").live('click', function(e) {
				currentTrack = $(this).text();  // or by index: $(this).index()
				state_artists_tracks_do(EVENT_ON_TRACK_CLICK);
			});
	

			storeState(STATE_ARTISTS_TRACKS);
		}
		else if (currentState==STATE_ARTISTS_TRACKS)
		{
			$("#artistListContainer").animate({ marginLeft: "0px", }, 1000 );	
			$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
			storeState(STATE_ARTISTS_ROOT);
		}
		
		// slide out tracks div
		// slide back main list div
		storeState(STATE_ARTISTS_ROOT);
	} 
	
	else if (evt==EVENT_ON_ARTISTS_BUTTON_CLICK) {
		// slide away (partly) tracks div
		// slide back main list div
		
		// $("#artistListContainer").animate({ marginLeft: "=160px", }, 1000 );			// $("#trackListContainer").animate({ marginLeft: "=540px", }, 1500 );		// $("#albumListContainer").animate({ marginLeft: "=-540px", }, 1500 );
		
		// $("#artistListContainer").hide();		// $("#trackListContainer").hide();		// $("#albumListContainer").hide();
		
		$("#artistListContainer").animate({ marginLeft: "-540px", }, 1000 );	
				$("#trackListContainer").animate({ marginLeft: "540px", }, 1500 );
				$("#albumListContainer").animate({ marginLeft: "540px", }, 1500 );
		
		
		storeState(STATE_ARTISTS_ROOT);
	}
	
	else if (evt==EVENT_ON_ALBUMS_BUTTON_CLICK) {
		// slide away (partly) tracks div
		// slide back main list div
		
		$("#artistListContainer").animate({ marginLeft: "=-160px", }, 1000 );	
		$("#trackListContainer").animate({ marginLeft: "=-540px", }, 1500 );
		$("#albumListContainer").animate({ marginLeft: "=540px", }, 1500 );
		
		storeState(STATE_ALBUMS_ROOT);
	}
	
	else {
		openListByEvent(evt);
	}
}

function state_artists_albums_do(evt) {
	alert("state_artists_albums_do");
}

function state_artists_tracks_do(evt) {
	browserScreenExitClicked();
}

function state_genres_root_do(evt) {
	if (evt==EVENT_ON_GENRE_ITEM_CLICK) {
		$("#genreListContainer").animate({ marginLeft: "-610px", }, 1500 );
		$("#artistListContainer").animate({ marginLeft: "-540px", }, 1000 );	
		$("#albumListContainer").animate({ marginLeft: "0px", }, 1500 );
		$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
		
		fillArtistListByGenre(currentGenre);
		
		storeState(STATE_GENRES_ARTISTS);
	} else {
		openListByEvent(evt);
	}
	/*
	 * Wenn Klick auf Genre:
	 * 	filtere nach Genrename und blende Liste ein
	 * Ansonsten:
	 * 	führe Rootfunktion des jeweiligen Events aus 
	 *  (Funktion schreiben: Auswahl zwischen artist, album, genre, tracks -> wiederverwendbar!)
	 */
}

function state_genres_artists_do(evt) {
	
	if (evt==EVENT_ON_ARTIST_ITEM_CLICK) {
		$("#genreListContainer").animate({ marginLeft: "-620px", }, 1500 );
		$("#artistListContainer").animate({ marginLeft: "-610px", }, 1000 );	
		$("#albumListContainer").animate({ marginLeft: "-540px", }, 1500 );
		$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
		
		fillAlbumListByArtistName(currentArtist);
		
		storeState(STATE_GENRES_ALBUMS);
	} else {
		openListByEvent(evt);
	}
	/*
	 * Wenn Klick auf Artist:
	 *   filtere nach Artistname und blende Liste ein
	 * Ansonsten:
	 *   wenn Klick auf letzte Liste:
	 * 		hole letzte Liste in den Vordergrund
	 * Ansonsten:
	 * 	 führe Rootfunktion des jeweiligen Events aus 
	 *   (Funktion schreiben: Auswahl zwischen artist, album, genre, tracks -> wiederverwendbar!)
	 */
}

function state_genres_albums_do(evt) {
	
	if (evt==EVENT_ON_ALBUM_ITEM_CLICK) {
		$("#genreListContainer").animate({ marginLeft: "-630px", }, 1500 );
		$("#artistListContainer").animate({ marginLeft: "-620px", }, 1000 );	
		$("#albumListContainer").animate({ marginLeft: "-610px", }, 1500 );
		$("#trackListContainer").animate({ marginLeft: "-540px", }, 1500 );	
		
		fillTrackListByAlbumName(currentAlbum);
		registerTrackClickEvent();
		
		storeState(STATE_GENRES_TRACKS);
	} else {
		openListByEvent(evt);
	}
	/*
	 * Wenn Klick auf Album:
	 *   filtere nach Albumname und blende Liste ein
	 * Ansonsten:
	 *   wenn Klick auf letzte Liste:
	 * 		hole letzte Liste in den Vordergrund
	 * Ansonsten:
	 * 	 führe Rootfunktion des jeweiligen Events aus 
	 *   (Funktion schreiben: Auswahl zwischen artist, album, genre, tracks -> wiederverwendbar!)
	 */
}

function state_genres_tracks_do(evt) {
	alert('playing track' + currentTrack);
	/*
	 * Wenn Klick auf Track:
	 *   blende Startseite ein und spiele Track ab
	 * Ansonsten:
	 *   wenn Klick auf letzte Liste:
	 * 		hole letzte Liste in den Vordergrund
	 * Ansonsten:
	 * 	 führe Rootfunktion des jeweiligen Events aus 
	 *   (Funktion schreiben: Auswahl zwischen artist, album, genre, tracks -> wiederverwendbar!)
	 */
}

function openListByEvent(evt) {
	switch(evt) {
		case EVENT_ON_ALBUM_ITEM_CLICK 		: state_albums_root_do(evt); break;
		case EVENT_ON_ALBUMS_SIDEBAR_CLICK  :; break;  
		case EVENT_ON_ALBUMS_BUTTON_CLICK   : openAlbumRoot(); break;  
		case EVENT_ON_ARTISTS_BUTTON_CLICK  : openArtistRoot(); break;  
		case EVENT_ON_ARTIST_ITEM_CLICK     : state_artists_root_do(evt); break;  
		case EVENT_ON_ARTIST_SIDEBAR_CLICK  :; break;  
		case EVENT_ON_TRACK_CLICK           : ; break;  
		case EVENT_ON_GENRES_BUTTON_CLICK   : openGenreRoot(); break;  
		case EVENT_ON_TRACKS_BUTTON_CLICK   : openTracksRoot(); break;  
		case EVENT_ON_FOLDERS_BUTTON_CLICK  :; break;  
		case EVENT_ON_GENRE_ITEM_CLICK  	: state_genres_root_do(evt); break;  
	}
}

function openAlbumRoot() {
	storeState(STATE_ALBUMS_ROOT);
	$("#genreListContainer").animate({ marginLeft: "0px", }, 1500 );
	$("#albumListContainer").animate({ marginLeft: "-540px", }, 1500 );
	$("#artistListContainer").animate({ marginLeft: "0px", }, 1000 );	
	$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
}

function openArtistRoot() {
	storeState(STATE_ARTISTS_ROOT)
	$("#genreListContainer").animate({ marginLeft: "0px", }, 1500 );
	$("#artistListContainer").animate({ marginLeft: "-540px", }, 1000 );	
	$("#albumListContainer").animate({ marginLeft: "0px", }, 1500 );
	$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
}

function openGenreRoot() {
	storeState(STATE_GENRES_ROOT); 
	$("#genreListContainer").animate({ marginLeft: "-540px", }, 1500 );
	$("#albumListContainer").animate({ marginLeft: "0px", }, 1500 );
	$("#artistListContainer").animate({ marginLeft: "0px", }, 1000 );	
	$("#trackListContainer").animate({ marginLeft: "0px", }, 1500 );	
}

function openTracksRoot() {
	storeState(STATE_TRACKS_ROOT);
	$("#genreListContainer").animate({ marginLeft: "-540px", }, 1500 );
	$("#albumListContainer").animate({ marginLeft: "-660px", }, 1500 );
	$("#artistListContainer").animate({ marginLeft: "-660px", }, 1000 );	
	$("#trackListContainer").animate({ marginLeft: "540px", }, 1500 );	
}

/**
 * Switch statement to handle current state
 */
function event_process(evt) {
	
	var test = (currentState == STATE_ALBUMS_TRACKS);
	
	switch (currentState)
	{
		case STATE_ALBUMS_ROOT    :  state_albums_root_do(evt); break;
		case STATE_ALBUMS_TRACKS  :  state_albums_tracks_do(evt); break;
		case STATE_ARTISTS_ROOT   :  state_artists_root_do(evt); break;
		case STATE_ARTISTS_ALBUMS :  state_artists_albums_do(evt); break;
		case STATE_ARTISTS_TRACKS :  state_artists_tracks_do(evt);break;
		case STATE_GENRES_ROOT	  :  state_genres_root_do(evt);break;
		case STATE_GENRES_ARTISTS :  state_genres_artists_do(evt);break;
		case STATE_GENRES_ALBUMS  :  state_genres_albums_do(evt);break;
		case STATE_GENRES_TRACKS  :  state_genres_tracks_do(evt);break;
	}
}