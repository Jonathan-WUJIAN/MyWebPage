<?phprequire('id3v2/id3.class.php');define ('MYSQL_HOST', 'sql311.hostfreeweb.net');define ( 'MYSQL_USER', 'freehs_15315520' );define ( 'MYSQL_PW',   'uidj4527');define ( 'MYSQL_DB',   'freehs_15315520_mp3');/*define ( 'MYSQL_HOST', 'localhost' );define ( 'MYSQL_USER', 'root' );define ( 'MYSQL_PW',   'gH648aT' );define ( 'MYSQL_DB',   'cloudmetadata' );*/define ("MIME_TYPE_AUDIO_MPEG", "audio/mpeg");define ( 'PATH',   '/music/' );define ( 'HTTP',   'http://' );define ( 'UNKNOWN_STRING', "Unknown");function getFilesFromDir(&$metadata_ref, $path_param, $db_sel_param, $userid_param) {		$dir = openDir(".".$path_param);			while (false !== ($file = readdir($dir))) {				if ($file != "." && $file != "..")		{								if(is_dir(".".$path_param.$file)) {                 $dir2 = $path_param.$file;                                 getFilesFromDir($metadata_ref, $dir2."/", $db_sel_param, $userid_param); 				            } else {            									$finfo = finfo_open(FILEINFO_MIME_TYPE);				$mime  = finfo_file($finfo, ".".$path_param.$file);																			if ($mime==MIME_TYPE_AUDIO_MPEG) {										if ($db_sel_param) {						$sql    = "INSERT INTO dummy (path, modified) VALUES ('".mysql_real_escape_string($path_param.$file)."','".date("Y-m-d H:i:s", 0)."')";						$result = mysql_query( $sql );  // finally do the query					}									}			}		}	}		closeDir($dir);	} $metadata = array();$userid = $_GET["userid"]; // extract user id from url parameterdate_default_timezone_set('Europe/Berlin');// connect to MySQL database$db_link = @mysql_connect (MYSQL_HOST,  MYSQL_USER,  MYSQL_PW);if ($db_link) {		    $db_sel = mysql_SELECT_db (MYSQL_DB, $db_link);		$result = mysql_query("TRUNCATE TABLE dummy");  // clear temporary dummy table first				getFilesFromDir($metadata, PATH, $db_sel, $userid);											// check for files which were added after the last sync		$result = mysql_query("SELECT DISTINCT path, modified FROM dummy WHERE (path) NOT IN (SELECT path FROM metadata)");						while ($row = mysql_fetch_assoc($result)) 		{			$myId3 = new ID3(".".$row["path"]);  			// extract Id3v2 metadata from file - only the first couple of bytes are read - not the complete file			if ($myId3->getInfo()) {								$id3_tag_artist  = $myId3->getArtist();				$id3_tag_album   = $myId3->getAlbum();				$id3_tag_gender  = $myId3->getGender();															if ($id3_tag_artist != false && $id3_tag_album != false) {					$lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=507c7a9240a4794851afa81b8af14632&artist=".$myId3->getArtist()."&album=".$myId3->getAlbum();				} else {					$lastfmURL = UNKNOWN_STRING;					}								if ($id3_tag_gender == false) {					$id3_tag_gender = UNKNOWN_STRING;					}								if ($id3_tag_artist == false) {					$id3_tag_artist = UNKNOWN_STRING;					}										$mystring     = HTTP.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];	  			$streamingURL = substr($mystring, 0, strrpos($mystring, "/")).$row["path"];							// store meta data into database - info will be used at delta sync				if ($db_sel) {					$sql = "INSERT INTO metadata (path, streamingURL, lastfmURL, modified, artist, title, genre, albumname) VALUES ('".mysql_real_escape_string($row["path"])."','"																																	  .mysql_real_escape_string($streamingURL)."','"																																	  .mysql_real_escape_string($lastfmURL)."','"																																	  .$row["modified"]."','"																																	  .mysql_real_escape_string($id3_tag_artist)."','"																																	  .mysql_real_escape_string($myId3->getTitle())."','"																																	  .mysql_real_escape_string($id3_tag_gender)."','"																																	  .mysql_real_escape_string($myId3->getAlbum())."')";					$query_result = mysql_query( $sql );  // finally do the query									if (!$query_result) 				   		echo mysql_error();					else 					{						$id     = mysql_insert_id();						$sql    = "INSERT INTO user (id, ci_session_id, dropbox_user_id) VALUES ('".$id."','"."0"."','".$userid."')";						$query_result = mysql_query( $sql );  // finally do the query																			}				}							$metadata[] = array('path'           => $row["path"], 									'streamingURL'   => $streamingURL, 									'lastfmURL'      => $lastfmURL,									'coverArtUrl'    => "",									'modified'       => $row["modified"],									'userid'         => $userid,									'artist'         => htmlentities($myId3->getArtist()),									'title'          => htmlentities($myId3->getTitle()),									'genre'          => htmlentities($myId3->getGender()),									'type'           => "added",									'albumname'      => htmlentities($myId3->getAlbum()),									'oldartist'         => ($myId3->getArtist()),									'oldtitle'          => ($myId3->getTitle()),									'oldgenre'          => ($myId3->getGender()),									'oldalbumname'      => ($myId3->getAlbum()));			} 			else {				  //echo "Error reading out ID3 metadata!!!</br>";		    }		}  // end while				// check for missing files		$result = mysql_query("SELECT DISTINCT path, id FROM metadata WHERE (path) NOT IN (SELECT path FROM dummy)");				while ($row = mysql_fetch_assoc($result)) 		{			$metadata[] = array('path'           => $row["path"], 								'streamingURL'   => "", 								'lastfmURL'      => "",								'coverArtUrl'    => "",								'modified'       => "",								'userid'         => "",								'artist'         => "",								'title'          => "",								'genre'          => "",								'type'           => "deleted",								'albumname'      => "");											 			mysql_query("DELETE FROM metadata WHERE id=".$row["id"]);	// finally delete entry from metadata table - entry in table "user" will be deleted via foreign key delete propagation 		}				// $metadata holds all files which where added or deleted to the dropbox account after the last full sync	    if (isset($metadata))				echo json_encode($metadata);  		else {				echo json_encode(array());  // nothing has changed return empty array		}}				?>