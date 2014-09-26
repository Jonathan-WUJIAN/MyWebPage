<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/* PHP script for extracting MP3 ID3 metadata like artist, title, album */
// require('/id3v2/error.inc.php');
require('id3v2/id3.class.php');
// require_once 'Zend/Id3v2.php';

define ( 'MYSQL_HOST', 'localhost' );
define ( 'MYSQL_USER', 'root' );
define ( 'MYSQL_PW',   'gH648aT' );
define ( 'MYSQL_DB',   'cloudmetadata' );
define ("MIME_TYPE_AUDIO_MPEG", "audio/mpeg");

class DropboxPlayer extends CI_Controller
{
    public $uid;   			// user id returned by Dropbox
	// private $REDIRECT_URL = '';
	//private $REDIRECT_URL = "http://212.77.190.201/cloudplayer/mediaplayer/index.html
	
    public function __construct()
    {
    	parent::__construct();
        $this->load->library('session');
        $this->load->helper('url');
		// $this->$REDIRECT_URL = $_SERVER["SERVER_NAME"]."/mediaplayer/index.html";
    }
	
    private function getRedirectUrl($path) {
      $pageURL = 'http';
      if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
      $pageURL .= "://";
      if ($_SERVER["SERVER_PORT"] != "80") {
	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$path;
      } else {
	$pageURL .= $_SERVER["SERVER_NAME"].$path;
      }
      return $pageURL;
    }
	
    // Call this method first by visiting http://SITE_URL/dropboxplayer/request_dropbox
    public function request_dropbox()
	{            
                $params['key'] = '2ni38qr1rws4vk3';
		$params['secret'] = 'uaj4ziwokikaa41';
		
		$this->load->library('dropbox', $params);
		$data = $this->dropbox->get_request_token(site_url("dropboxplayer/access_dropbox"));
		$this->session->set_userdata('token_secret', $data['token_secret']);

		//redirect($data['redirect']);   // this redirect url to do oauth/authorize step will be called from javascript
	        
		echo json_encode($data);
	}
	
	

	
	//This method should not be called directly, it will be called after 
    //the user approves your application and dropbox redirects to it
	public function access_dropbox()
	{
		$params['key'] = '2ni38qr1rws4vk3';
		$params['secret'] = 'uaj4ziwokikaa41';
		
		$this->load->library('dropbox', $params);
		
		// Step 3
		$oauth= $this->dropbox->get_access_token($this->session->userdata('token_secret'));
		
		$this->session->set_userdata('oauth_token', $oauth['oauth_token']);
		$this->session->set_userdata('oauth_token_secret', $oauth['oauth_token_secret']);

		$uid = $_GET["uid"];
		$this->session->set_userdata('dropbox_uid', $uid);
		
		redirect($this->getRedirectUrl("http://212.77.190.201/cloudplayerOIP/mediaplayer/index.html"));

	}
	

	/**
	 * Takes a shorten link i.e. http://db.tt/f0yYbBSw and requests the long one i.e. http://dl.dropbox.com/u/62734869/01%20Running%20on%20Ice.mp3
	 */
	private function unshortenURL($shortenURL) {
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $shortenURL);
				curl_setopt($ch, CURLOPT_HEADER, 1);
				curl_setopt($ch, CURLOPT_NOBODY, 1);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_TIMEOUT, 10);
				 
				$result = curl_exec($ch);
				curl_close($ch);
				
				return $result;
	}
	
	
	/**
	 * Retrieves the cover art (album image) as a URL via the AudioScobbler API from LastFm
	 */
	private function getCoverArt($album, $artist) {
			// no blanks are allowed - must be replaced with character "+"
			$artist = str_replace(" ","+",$artist);
			$album  = str_replace(" ","+",$album);
			
			$url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=507c7a9240a4794851afa81b8af14632&artist=".$artist."&album=".$album;
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_TIMEOUT, 20);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
			$retData = curl_exec($ch);
			curl_close($ch);
			
			$retData = str_replace(array('<![CDATA[',']]>'),'',$retData);

			$xml = simplexml_load_string($retData);
			$lastFM = json_decode(json_encode($xml),TRUE);
			
			return $lastFM["album"]["image"][2];  // position 2 means the link to the large img
	}
	

   /**
    * Creates all neccessary MySQL relations
    */
   public function createTables() {
   		$db_link = @mysql_connect (MYSQL_HOST,  MYSQL_USER,  MYSQL_PW);
		
		if ($db_link) {
			$db_sel = mysql_SELECT_db (MYSQL_DB, $db_link);
			
			if ($db_sel) {
				$sql = "CREATE TABLE IF NOT EXISTS `metadata` (
						  `id` int(11) NOT NULL AUTO_INCREMENT,
						  `path` varchar(1024) NOT NULL,
						  `streamingURL` varchar(1024) NOT NULL,
						  `lastfmURL` varchar(1024) NOT NULL,
						  `modified` datetime NOT NULL,
						  `artist` varchar(128) NOT NULL,
						  `title` varchar(128) NOT NULL,
						  `genre` varchar(128) NOT NULL,
						  `albumname` varchar(128) NOT NULL,
						  PRIMARY KEY (`id`)
						) ENGINE=InnoDB  DEFAULT CHARSET=latin1";
						
				mysql_query( $sql );	
				
				$sql = "CREATE TABLE IF NOT EXISTS `user` (
						  `ci_session_id` varchar(40) NOT NULL,
						  `dropbox_user_id` int(11) NOT NULL,
						  `id` int(11) NOT NULL,
						  PRIMARY KEY (`id`)
						) ENGINE=InnoDB DEFAULT CHARSET=latin1";
						
				mysql_query( $sql );	
				
				$sql = "ALTER TABLE `user`
  							ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id`) REFERENCES `metadata` (`id`) ON DELETE CASCADE;";
						
				mysql_query( $sql );		
				
				$sql = "CREATE TABLE IF NOT EXISTS `dummy` (
						  `path` varchar(1024) NOT NULL,
						  `modified` datetime NOT NULL
						) ENGINE=InnoDB DEFAULT CHARSET=latin1";
						
				mysql_query( $sql );	
			}
		} else 
		  {
		    echo 'failure';
		  }
		
   }


	//Once your application is approved you can proceed to load the library
    //with the access token data stored in the session. If you see your account
    //information printed out then you have successfully authenticated with
    //dropbox and can use the library to interact with your account.
	public function fullSync()
	{
	  date_default_timezone_set('Europe/Berlin');
	 	$this->createTables();
		
		$params['key']    = '2ni38qr1rws4vk3';
		$params['secret'] = 'uaj4ziwokikaa41';
		$params['access'] = array('oauth_token'=>urlencode($this->session->userdata('oauth_token')),
								  'oauth_token_secret'=>urlencode($this->session->userdata('oauth_token_secret')));
		
		$this->load->library('dropbox', $params);
		
		$path = $_GET["path"];  // extract path which should be synchronized from url parameter
		
		$params = array();  // no special params needed - therefore empty array
		$results = $this->dropbox->metadata($path, $params, $root='dropbox');

		$dropboxDLPrefix = "http://dl.dropbox.com/u/";
        $userid          = $this->session->userdata('dropbox_uid'); 
        $ci_session_id   = $this->session->userdata('session_id');
		
		// connect to MySQL database
		$db_link = @mysql_connect (MYSQL_HOST,  MYSQL_USER,  MYSQL_PW);
		
		// doing a full sync so make a hard clean up and delete everything for this userid first
		if ($db_link) {
			$db_sel = mysql_SELECT_db (MYSQL_DB, $db_link);
			
			if ($db_sel) {
				$sql = "DELETE FROM metadata WHERE id IN (SELECT id FROM user WHERE dropbox_user_id=".$userid.")";
				$result = mysql_query( $sql );			

				$sql = "DELETE FROM user where dropbox_user_id=".$userid;
				$result = mysql_query( $sql );			
			}
		}
		
		// loop over the users files
		foreach($results->contents as $file) 
		{		    
			if ((array_key_exists("mime_type", $file)) && ($file->mime_type==MIME_TYPE_AUDIO_MPEG)) {
			    $mediaURL       = $this->dropbox->media($file->path, $root='dropbox');  // URL which can be used for streaming
				$file_meta_data = $this->dropbox->shares($file->path, $root='dropbox'); // URL which can be used for ID3 data extraction

				// Dropbox is returning only a shorten URL - to extract ID3 tags we need the real URL to the audio file
				$longURL = $this->unshortenURL($file_meta_data->url);  // howto avoid this http request ?!?!
				
				if (preg_match("/location\:/"," $longURL")) {
				
					$url             = explode("location: ",$longURL);
					$reversed_url    = explode("\r",$url[1]);
					$filename        = strrchr($file->path, "/");
					$downloadLink    = $dropboxDLPrefix.$userid.$filename;
					$myId3 			 = new ID3($downloadLink);
					// $getID3 		 = new getID3;
					// $myId3			 = new Zend_Media_Id3v2($downloadLink);
					
					// extract Id3v2 metadata from file - only the first couple of bytes are read - not the complete file
					if ($myId3->getInfo()){
					// if ($myId3){
						// print_r($myId3);						// continue;
						$lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=507c7a9240a4794851afa81b8af14632&artist=".$myId3->getArtist()."&album=".$myId3->getAlbum();
						
						$datetime = strtotime($file->modified)-7200;  // date() adds two hours ???!?! so remove these first
						
						// store meta data into database - info will be used at delta sync
						if ($db_sel) {
								$sql = "INSERT INTO metadata (path, streamingURL, lastfmURL, modified, artist, title, genre, albumname) VALUES ('".$file->path."','"
																																				  .$mediaURL->url."','"
																																				  .$lastfmURL."','"
																																				  .date("Y-m-d H:i:s", $datetime)."','"
																																				  .$myId3->getArtist()."','"
																																				  .$myId3->getTitle()."','"
																																				  .$myId3->getGender()."','"
																																				  .$myId3->getAlbum()."')";

								$result = mysql_query( $sql );  // finally do the query
							
								if (!$result) 
							   		echo mysql_error();
								else 
								{
									$id     = mysql_insert_id();
									$sql    = "INSERT INTO user (id, ci_session_id, dropbox_user_id) VALUES ('".$id."','".$ci_session_id."','".$userid."')";
									$result = mysql_query( $sql );  // finally do the query														
								}
						}
					
						$metadata[] = array('path'           => $file->path, 
											'streamingURL'   => $mediaURL->url, 
											'lastfmURL'      => $lastfmURL,
											'coverArtUrl'    => "",
											'modified'       => $file->modified,
											'userid'         => $userid,
											'artist'         => htmlentities($myId3->getArtist()),
											'title'          => htmlentities($myId3->getTitle()),
											'genre'          => htmlentities($myId3->getGender()),
											'albumname'      => htmlentities($myId3->getAlbum()));
					} 
					else {
						  //echo "Error reading out ID3 metadata!!!</br>";
				    }
				} 
			}
		}  // end for loop

		echo json_encode($metadata);  
	}
	
	
	/**
	 * To avoid doing a full sync every time this delta sync mechansim was introduced.
	 * At MySQL side a table "dummy" gets used to be part of SQL operations to check which files were added
	 * deleted or modified since the last full sync. 
	 */
	public function deltaSync()
	{
	  	  date_default_timezone_set('Europe/Berlin');
		$params['key']    = '2ni38qr1rws4vk3';
		$params['secret'] = 'uaj4ziwokikaa41';
		$params['access'] = array('oauth_token'=>urlencode($this->session->userdata('oauth_token')), 'oauth_token_secret'=>urlencode($this->session->userdata('oauth_token_secret')));
		
		$this->load->library('dropbox', $params);
		
		$path = $_GET["path"];  // extract path which should be synchronized from url parameter
		
		$params  = array();  // no special params needed - therefore empty array
		$results = $this->dropbox->metadata($path, $params, $root='dropbox');

		$dropboxDLPrefix = "http://dl.dropbox.com/u/";
        $userid          = $this->session->userdata('dropbox_uid'); 
        $ci_session_id   = $this->session->userdata('session_id');
		
		// connect to MySQL database
		$db_link = @mysql_connect (MYSQL_HOST,  MYSQL_USER,  MYSQL_PW);
		
		if ($db_link) 
		{
			    $db_sel = mysql_SELECT_db (MYSQL_DB, $db_link);
				$result = mysql_query("TRUNCATE TABLE dummy");  // clear temporary dummy table first
								
				// loop over the users files
				foreach($results->contents as $file) 
				{
					if ((array_key_exists("mime_type", $file)) && ($file->mime_type==MIME_TYPE_AUDIO_MPEG)) 
					{		
					    $datetime = strtotime($file->modified)-7200;  // date() adds two hours ???!?! so remove these first
									
						if ($db_sel) 
						{
								$sql    = "INSERT INTO dummy (path, modified) VALUES ('".$file->path."','".date("Y-m-d H:i:s", $datetime)."')";
								$result = mysql_query( $sql );  // finally do the query
						}
					}
				}
				
		// check for files which were added after the last sync
				$result = mysql_query("SELECT DISTINCT path, modified FROM dummy WHERE (path) NOT IN (SELECT path FROM metadata)");
				
				while ($row = mysql_fetch_assoc($result)) 
				{
						    $mediaURL       = $this->dropbox->media($row["path"], $root='dropbox');  // URL which can be used for streaming
							$file_meta_data = $this->dropbox->shares($row["path"], $root='dropbox'); // URL which can be used for ID3 data extraction
			
							// Dropbox is returning only a shorten URL - to extract ID3 tags we need the real URL to the audio file
							$longURL = $this->unshortenURL($file_meta_data->url);  // howto avoid this http request ?!?!
							
							if (preg_match("/location\:/"," $longURL")) {
							
								$url             = explode("location: ",$longURL);
								$reversed_url    = explode("\r",$url[1]);
								$filename        = strrchr($row["path"], "/");
								$downloadLink    = $dropboxDLPrefix.$userid.$filename;
								$myId3 			 = new ID3($downloadLink);
								
								// extract Id3v2 metadata from file - only the first couple of bytes are read - not the complete file
								if ($myId3->getInfo()) {
									$lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=507c7a9240a4794851afa81b8af14632&artist=".$myId3->getArtist()."&album=".$myId3->getAlbum();
									
									// store meta data into database - info will be used at delta sync
									if ($db_sel) {
											$sql = "INSERT INTO metadata (path, streamingURL, lastfmURL, modified, artist, title, genre, albumname) VALUES ('".$row["path"]."','"
																																								 .$mediaURL->url."','"
																																								 .$lastfmURL."','"
																																								 .$row["modified"]."','"
																																								 .$myId3->getArtist()."','"
																																								 .$myId3->getTitle()."','"
																																								 .$myId3->getGender()."','"
																																								 .$myId3->getAlbum()."')";
			
											$query_result = mysql_query( $sql );  // finally do the query
										
											if (!$query_result) 
										   		echo mysql_error();
											else 
											{
												$id     = mysql_insert_id();
												$sql    = "INSERT INTO user (id, ci_session_id, dropbox_user_id) VALUES ('".$id."','".$ci_session_id."','".$userid."')";
												$query_result = mysql_query( $sql );  // finally do the query														
											}
									}
								
									$metadata[] = array('path'           => $row["path"], 
														'streamingURL'   => $mediaURL->url, 
														'lastfmURL'      => $lastfmURL,
														'coverArtUrl'    => "",
														'modified'       => $row["modified"],
														'userid'         => $userid,
														'artist'         => htmlentities($myId3->getArtist()),
														'title'          => htmlentities($myId3->getTitle()),
														'genre'          => htmlentities($myId3->getGender()),
														'type'           => "added",
														'albumname'      => htmlentities($myId3->getAlbum()),
														'oldartist'         => ($myId3->getArtist()),
														'oldtitle'          => ($myId3->getTitle()),
														'oldgenre'          => ($myId3->getGender()),
														'oldalbumname'      => ($myId3->getAlbum()));
								} 
								else {
									  //echo "Error reading out ID3 metadata!!!</br>";
							    }
							} 
				}  // end while
				

		// check for missing files
				$result = mysql_query("SELECT DISTINCT path, id FROM metadata WHERE (path) NOT IN (SELECT path FROM dummy)");
				
				while ($row = mysql_fetch_assoc($result)) 
				{
					$metadata[] = array('path'           => $row["path"], 
										'streamingURL'   => "", 
										'lastfmURL'      => "",
										'coverArtUrl'    => "",
										'modified'       => "",
										'userid'         => "",
										'artist'         => "",
										'title'          => "",
										'genre'          => "",
										'type'           => "deleted",
										'albumname'      => "");
										
					 
					mysql_query("DELETE FROM metadata WHERE id=".$row["id"]);	// finally delete entry from metadata table - entry in table "user" will be deleted via foreign key delete propagation 
				}
				
		
				// $metadata holds all files which where added or deleted to the dropbox account after the last full sync
				if (isset($metadata))
					echo json_encode($metadata);  
				else {
					echo json_encode(array());  // nothing has changed return empty array
				}
		}
	}

public function getMetaData()
	{
		// connect to MySQL database
		$db_link = @mysql_connect (MYSQL_HOST,  MYSQL_USER,  MYSQL_PW);
		
		if ($db_link) 
		{
				$db_sel = mysql_SELECT_db (MYSQL_DB, $db_link);
			
			if ($db_sel) {
				$result = mysql_query("SELECT * FROM metadata");
				
				while ($row = mysql_fetch_assoc($result)) 
				{
					$metadata[] = array('path'           => $row["path"], 
										'streamingURL'   => $row["streamingURL"], 
										'lastfmURL'      => $row["lastfmURL"],
										'coverArtUrl'    => "",
										'modified'       => $row["modified"],
										'userid'         => "1",
										'artist'         => $row["artist"],
										'title'          => $row["title"],
										'genre'          => $row["genre"],
										'albumname'      => $row["albumname"]);
				}
						
		}
		}
		
		if (isset($metadata))
			echo json_encode($metadata);  
		
	}





}

