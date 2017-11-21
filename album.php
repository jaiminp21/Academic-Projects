<?php

// display all errors on the browser
error_reporting(E_ALL);
ini_set('display_errors','On');

set_time_limit(0);

require_once("DropboxClient.php");

// Dropbox API Auth
$dropbox = new DropboxClient(array(
	'app_key' => "xk44qwz7i1as9qh",      // Dropbox API key
	'app_secret' => "c6czmk801va7fei",   // Dropbox API secret
	'app_full_access' => false,
),'en');

// first try to load existing access token
$access_token = load_token("access");
if(!empty($access_token)) {
	$dropbox->SetAccessToken($access_token);
//	echo "loaded access token:";
//	print_r($access_token);
}
elseif(!empty($_GET['auth_callback'])) // are we coming from dropbox's auth page?
{
	// then load our previosly created request token
	$request_token = load_token($_GET['oauth_token']);
	if(empty($request_token)) die('Request token not found!');
	
	// get & store access token, the request token is not needed anymore
	$access_token = $dropbox->GetAccessToken($request_token);	
	store_token($access_token, "access");
	delete_token($_GET['oauth_token']);
}

// checks if access token is required
if(!$dropbox->IsAuthorized())
{
	// redirect user to dropbox auth page
	$return_url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']."?auth_callback=1";
	$auth_url = $dropbox->BuildAuthorizeUrl($return_url);
	$request_token = $dropbox->GetRequestToken();
	store_token($request_token, $request_token['t']);
	die("Authentication required. <a href='$auth_url'>Click here.</a>");
}

//echo "<pre>";
//echo "<b>Account:</b>\r\n";
//print_r($dropbox->GetAccountInfo());

?>

<html>
    <head> <title>Photo Album</title> </head>
    <body>
		<fieldset><legend><H1>Upload Photo</H1></legend>
		<form action="album.php" method="post" enctype="multipart/form-data">
		<input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
		Choose Photo To Upload <input type="file" name="UploadedFile"/></br>
		<input type="submit" value="Upload Photo" name="submit"/>
		</form></fieldset>

<?php

// For Upload Photo 
if(isset($_POST["submit"])){
	$fileName = $_FILES["UploadedFile"]["name"];
	if (move_uploaded_file($_FILES['UploadedFile']['tmp_name'], $fileName)) {
		$dropbox->UploadFile($fileName);
	}
}
//$name = $_FILES["UploadedFile"]["tmp_name"];
//echo $name;


// For Delete Photo
$files = $dropbox->GetFiles("",false);
if(isset($_GET["del"]) and trim($_GET["del"])!="")
{
  foreach ($files as $file)
{
    if($file->path==urldecode($_GET["del"]))
    {
        $dropbox->Delete($file->path);		
    }
}
}

// For Preview Photo
unset($GLOBALS['files']);
unset($files);
//print_r($files);
$files = $dropbox->GetFiles("",false);
//$files=$dropbox->Search("/", ".jpg");
//echo "\r\n\r\n<b>Files:</b>\r\n";
//print_r($files);
echo '<div style="width: 100%;">';
echo '<div style="float:left; width:65%"><fieldset><legend><H1>All Photos</H1></legend>';
		echo "</br><table align='center' border ='1'>
			<tr><th align='center'><h3>Photo Name</h3></th>
				<th align='center'><h3>Show Preview</h3></th>
				<th align='center'><h3>Delete</h3></th></tr>";
				foreach ($files as $file){
					echo "<tr><td align='center'   width='100'><h4>".$file->path."</h4></td>
						<td align='center'><a href='album.php?df=".$file->path."'></h4>Click To See Preview</h4></a></td>
						<td align='center'><a href='album.php?del=".$file->path."'><h4><input type='button' name='Delete' value='Delete'></h4></a></input></td></tr>";
				}		 
				echo "</table></fieldset></div>";
				
echo '<div style="float:right; width:35%"><fieldset><legend><H1>Preview</H1></legend>';				
	if(isset($_GET["df"]) and trim($_GET["df"])!=""){
		foreach ($files as $file){
			if($file->path==urldecode($_GET["df"])){
				$test_file = basename($file->path);
				$dropbox->DownloadFile($file, $test_file);
				$img_data = base64_encode($dropbox->GetThumbnail($file->path,'l'));
				echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />";
			}
		}
	}	
echo "</fieldset></div></div>";	


// store token
function store_token($token, $name)
{
	if(!file_put_contents("tokens/$name.token", serialize($token)))
		die('<br />Could not store token! <b>Make sure that the directory `tokens` exists and is writable!</b>');
}

// load token
function load_token($name)
{
	if(!file_exists("tokens/$name.token")) return null;
	return @unserialize(@file_get_contents("tokens/$name.token"));
}

// delete token
function delete_token($name)
{
	@unlink("tokens/$name.token");
}

?>
	</body>
</html>