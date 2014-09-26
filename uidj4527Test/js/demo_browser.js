const FILTER_ALBUMS  = 0;
const FILTER_ARTISTS = 1;
const FILTER_GENRES  = 2;
const FILTER_TRACKS  = 3;
const FILTER_FOLDERS = 4;

var filterByAlbum   = 0;
var filterByArtist  = 0;
var filterByGenres  = 0;
var filterByTracks  = 0;
var filterByFolders = 0;

var currentFilter = FILTER_ALBUMS;

var currentAlbum;
var currentTrack;
var currentArtist;
var currentGenre;



function unselect() {

	switch(currentFilter) {
		case FILTER_ALBUMS  : $("#album").attr('class', 'browser_button_albums album_normal_state'); filterByAlbum = 0; break;
		case FILTER_ARTISTS : $("#artists").attr('class', 'browser_button_artists artists_normal_state'); filterByArtist = 0; break;
		case FILTER_GENRES  : $("#genres").attr('class', 'browser_button_genres genres_normal_state'); filterByGenres = 0; break;
		case FILTER_TRACKS  : $("#tracks").attr('class', 'browser_button_tracks tracks_normal_state'); filterByTracks = 0; break;
		case FILTER_FOLDERS : $("#folders").attr('class', 'browser_button_folders folders_normal_state'); filterByFolders = 0; break;
	}
}


function changeHeader(filter) {

    currentFilter = filter;
	
	switch(filter) {
		case FILTER_ALBUMS  : $("#header_text").text("Albums");  $('#header_icon').css("background", "url(images/browser_icon_album.png) no-repeat");   
		break;
		
		case FILTER_ARTISTS : $("#header_text").text("Artists"); $('#header_icon').css("background", "url(images/browser_icon_artists.png) no-repeat"); break;
		case FILTER_GENRES  : $("#header_text").text("Genres"); $('#header_icon').css("background", "url(images/browser_icon_genres.png) no-repeat");break;
		case FILTER_TRACKS  : $("#header_text").text("Tracks"); $('#header_icon').css("background", "url(images/browser_icon_tracks.png) no-repeat");break;
		case FILTER_FOLDERS : $("#header_text").text("Folders");$('#header_icon').css("background", "url(images/browser_icon_folders.png) no-repeat"); break;
	}
}

/**
 * change button state by switching class
 */
function  browserScreenAlbumsClicked() {
	unselect();
	
	if (filterByAlbum==0) {
		filterByAlbum = 1;
		$("#album").attr('class', 'browser_button_albums album_active_state');  // change button state
		event_process(EVENT_ON_ALBUMS_BUTTON_CLICK);
	}
	else {
		filterByAlbum = 0;
		$("#album").attr('class', 'browser_button_albums album_normal_state');  // change button state
	}
}


/**
 * change button state by switching class
 */
function  browserScreenArtistsClicked() {
	unselect();
	
	if (filterByArtist==0) {
		filterByArtist = 1;
		$("#artists").attr('class', 'browser_button_artists artists_active_state');  // change button state
		event_process(EVENT_ON_ARTISTS_BUTTON_CLICK);
	}
	else {
		filterByArtist = 0;
		$("#artists").attr('class', 'browser_button_artists artists_normal_state');  // change button state
	}
}

/**
 * change button state by switching class
 */
function  browserScreenGenresClicked() {
	unselect();
	
	if (filterByGenres==0) {
		filterByGenres = 1;
		$("#genres").attr('class', 'browser_button_genres genres_active_state');
		event_process(EVENT_ON_GENRES_BUTTON_CLICK);
	}
	else {
		filterByGenres = 0;
		$("#genres").attr('class', 'browser_button_genres genres_normal_state');
	}
}

/**
 * change button state by switching class
 */
function  browserScreenTracksClicked() {
	unselect();
	
	if (filterByTracks==0) {
		filterByTracks = 1;
		$("#tracks").attr('class', 'browser_button_tracks tracks_active_state');
		event_process(EVENT_ON_TRACKS_BUTTON_CLICK);
	}
	else {
		filterByTracks = 0;
		$("#tracks").attr('class', 'browser_button_tracks tracks_normal_state');
	}
}


/**
 * change button state by switching class
 */
function  browserScreenFoldersClicked() {
	unselect();
	
	if (filterByFolders==0) {
		filterByFolders = 1;
		$("#folders").attr('class', 'browser_button_folders folders_active_state');
		event_process(EVENT_ON_FOLDERS_BUTTON_CLICK);
	}
	else {
		filterByFolders = 0;
		$("#folders").attr('class', 'browser_button_folders folders_normal_state');
	}
}

/**
 * just hide the whole div #screen_browser
 */
function browserScreenExitClicked() {
	browse_button_clicked();
}


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


/* just builds an array of all album names */
function buildAllArtistNames() {
	var artists = [];
	
	$.each(jsonData, function(i, item) {
	    if ($.inArray(item.artist, artists)==-1) {
			artists.push(item.artist);
			console.log(item.artist);
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
    changeHeader(FILTER_ALBUMS);
	
	// get names of all albums - clear list first and fill with corresponding album names
    var albums = buildAllAlbumNames();
     $("body").off("click", ".albumListItem", store_Album);
	$("#scrollerAlbumList ul").empty();
	
	var scollerAlbumListUL = $("#scrollerAlbumList ul"); // cache it
	
	// fills the ul with cover and album name
	$.each(albums, function(i, album) {
		scollerAlbumListUL.append('<li class="listItem albumListItem"><img class="albumCover" src='+getAlbumCover(album)+'>'+album+"</li>");
	});
}

/* fills artists list */
function fillArtistsList() {
    changeHeader(FILTER_ARTISTS);
	
	// get names of all artists - clear list first and fill with corresponding artist names
    var artists = buildAllArtistNames();
     $("body").off("click", ".artistListItem", store_Artist);
	$("#scrollerArtistList ul").empty();
	
	var scollerArtistListUL = $("#scrollerArtistList ul"); // cache it
	
	// fills the ul with artist name
	$.each(artists, function(i, artist) {
		scollerArtistListUL.append('<li class="listItem artistListItem">'+artist+"</li>");
	});
}

/* fills genre list */
function fillGenreList() {
    changeHeader(FILTER_GENRES);
	
	// get names of all genres - clear list first and fill with corresponding genre names
    var genres = buildAllGenreNames();
    $("body").off("click", ".genreListItem", store_Genre);
	$("#scrollerGenreList ul").empty();
	
	var scollerGenreListUL = $("#scrollerGenreList ul"); // cache it
	
	// fills the ul with genre name
	$.each(genres, function(i, genre) {
		scollerGenreListUL.append('<li class="listItem genreListItem">'+genre+"</li>");
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
		if (item.artist == artistName) {
			albums.push(item.album);
		}
	});
	
	return albums;
}

function getArtistListByGenresName(genreName) {
	var artists = [];
	
	$.each(jsonData, function(i, item) {
		if ( (item.genre == genreName) && artists.indexOf(item.artist)!=-1) {
			artists.push(item.artist);
		}
	});
	
	return artists;
}

function fillTrackListByAlbumName(albumName) {
	// get names of all albums - clear list first and fill with corresponding album names
    var tracks = getTrackListByAlbumName(albumName);
	
	$("#scrollerTrackList ol").empty();
	
	var scollerTrackListOL = $("#scrollerTrackList ol"); // cache it
	
	// fills the ul with cover and album name
	$.each(tracks, function(i, track) {
		scollerTrackListOL.append('<li class="listItem trackListItem">d'+track+"</li>");
	});
}

function fillTrackListByArtistName(artistName) {
	// get names of all artists - clear list first and fill with corresponding artist names
    var tracks = getTrackListByArtistName(artistName);
	
	$("#scrollerTrackList ol").empty();
	
	var scollerTrackListOL = $("#scrollerTrackList ol"); // cache it
	
	// fills the ul with cover and album name
	$.each(tracks, function(i, track) {
		scollerTrackListOL.append('<li class="listItem trackListItem">'+track+"</li>");
	});
}

function fillAlbumListByArtistName(artistName) {
	var albums = getAlbumListByArtistName(artistName);
	
	$("#scrollerAlbumlist ol").empty();
	
	var scrollerAlbumListOL = $("#scrollerAlbumList ol");
	
	$.each(albums, function(i, album) {
		scrollerAlbumListOL.append('<li class="listItem albumListItem">'+album+"</li>");
	});
}

function fillArtistListByGenre(genreName) {
	var artists = getArtistListByGenresName(genreName);
	
	$("#scrollerArtistlist ol").empty();
	
	var scrollerArtistListOL = $("#scrollerArtistList ol");
	
	$.each(artists, function(i, artist) {
		scrollerArtistListOL.append('<li class="listItem artistListItem">'+artist+"</li>");
	});
}
