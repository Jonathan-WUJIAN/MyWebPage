var DROPBOX__LOGIN_URL     = "/cloudplayerOIP/CodeIgniter_2.1.1/index.php/dropboxplayer/request_dropbox";
var DROPBOX__TIMEOUT_LOGIN = 3000;

/**
 * Stores for Source: Cloud a mode val if tracks should be played in a continuous mode
 * Screen to make this setting "Settings"
 * 1: continuous mode enabled
 * 0: continuous mode disabled
 */
function checkbox_onchange() {
	// check localstorage is supported by browser
	if (localStorage) 
	{
		if ($("#continuous_playmode_checkbox").is(':checked')) {
			  // store continuous mode val=1 to localStorage
			   localStorage.setItem(CONTINUOUS_PLAY, 1);  
		 }
		 else {
			  // store continuous mode val=0 to localStorage
			  localStorage.setItem(CONTINUOUS_PLAY, 0);  
		 }
	}
}


/**
 * Stores to local storage if the synchronization should be done via Dropbox or just via a simple public Web Directory
 * 1: Dropbox Sync
 * 0: Web Server Directory Sync
 */
function cloudmode_onchange() {
	// check localstorage is supported by browser
	if (localStorage) 
	{
		 if ($("#cloudmode_checkbox").is(':checked')) {
			   // store that Dropbox should be used val=1 to localStorage
			   localStorage.setItem(DROPBOX_SYNC_USAGE, 1);  
			   USE_DROPBOX_CLOUD = true;
		 }
		 else {
			  // store that a simply web server directory should be used val=0 to localStorage as synchronization
			  localStorage.setItem(DROPBOX_SYNC_USAGE, 0);  
			  USE_DROPBOX_CLOUD = false;
		 }
	}
}



/**
 * Login to the users Dropbox account 
 */
function settings_login_clicked() {

        jsDevApi.log("Login to Dropbox");
	jQuery.ajax({
	  url:         DROPBOX__LOGIN_URL,  /* Step 1: request_token */
	  dataType:    "json",
	  timeout: 	   DROPBOX__TIMEOUT_LOGIN,
	  beforeSend:  function(){ 
	  							$("#progress_loading_div").show();
								$("#progress_loading_text").text("Login to your account ...");
							  },
	  complete:    function(){ $("#progress_loading_div").hide();},
	  success:     function(data){
                              jsDevApi.log("success login do a redirect to: "+data.redirect);
                   
		  	      // take the returned redirect url and trigger the redirect from client side - otherwise same orgin policy will
			      // occure and the AJAX called would be canceled
			      window.location.href = data.redirect;  /* Step 2: authorize + callback url*/
                              jsDevApi.log("after window.location.href");		
				   },
	  error:       function(e){$("#progress_loading_div").hide(); jsDevApi.log("Dropbox login failed!");}
  });
}
