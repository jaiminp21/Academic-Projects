<html>
<head><title>Message Board</title></head>
<body>

<?php

session_start();
$refreshedPage = isset($_SERVER['HTTP_CACHE_CONTROL']) && $_SERVER['HTTP_CACHE_CONTROL'] === 'max-age=0';
$currentUser;
if(!isset($_SESSION['currentUserID']) && !isset($_GET['user'])){
	include('login.php');
	exit;
}
if(isset($_GET['user'])){
	$_SESSION['currentUserID']=$_GET["user"];
}	
error_reporting(E_ALL);
ini_set('display_errors','On');
$currentUser;
$currentUserID;

try {
	$dbh = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
	$dbh->beginTransaction();
	$stmtUserName = $dbh->prepare('select fullname from users where username="'.$_SESSION['currentUserID'].'"');
	$stmtUserName->execute();
	while ($row = $stmtUserName->fetch()) {
		$currentUser =($row["fullname"]);
	}

	
	$action = "document.location.href='board.php?newpost=true&user=".$_SESSION['currentUserID']."';";
	echo '<form name="postmessage" action="board.php" method="get" accept-charset="utf-8"><h1 align="center">Welcome '.$currentUser.'!</h1><p align="right"><input type="submit" name="logout" value="Logout"/></p>';
	echo '<p align="center"><textarea rows="3" cols="200" name="messageBox" id="messageBox" placeholder="Write Your Post Or Reply Here And Then Press The New Post Or Reply Button"></textarea></p><p align="center"><input type="submit" name="newPost" value="New Post"/></p>';
	if(isset($_GET["logout"])){
		unset($_SESSION['currentUserID']);
		unset($_GET['user']);		
		session_destroy();
		header("Location: login.php");
		exit();
	}
	if((isset($_GET["newPost"]) || isset($_GET["reply"])) && $_GET["messageBox"]==""){
		$message="Enter Message First!";
		echo "<script type='text/javascript'>alert('$message');</script>";
	}
	if(isset($_GET["newPost"]) && !$refreshedPage && !$_GET["messageBox"]==""){
		$dbh->exec('insert into posts values("'.uniqid().'","","'.$_SESSION['currentUserID'].'",CURRENT_TIMESTAMP,"'.$_GET['messageBox'].'")')
		or die(print_r($dbh->errorInfo(), true));
		$dbh->commit();
	}
	if(isset($_GET["reply"]) && !$refreshedPage && !$_GET["messageBox"]==""){
		$splits=explode(" ",$_GET["reply"]);
		$orgMessageID = $splits[count($splits)-1];
		$dbh->exec('insert into posts values("'.uniqid().'","'.$orgMessageID.'","'.$_SESSION['currentUserID'].'",CURRENT_TIMESTAMP,"'.$_GET['messageBox'].'")')
		or die(print_r($dbh->errorInfo(), true));
		$dbh->commit();
	}
	$stmtMessages = $dbh->prepare('select * from posts,users where username=postedby order by datetime DESC');
	$stmtMessages->execute();
	echo '<fieldset><legend>Your Messeges</legend><table id="messages" border="2" width="100%">
			<tr><th><b>Message ID</b></th>
				<th><b>User Name</b></th>
				<th><b>Full Name</b></th>
				<th><b>Date & Time</b></th>				
				<th><b>In Response Of Message ID</b></th>
				<th><b>Message</b></th>
				<th><b>Action</b></th>
			</tr>';
	while ($row = $stmtMessages->fetch()) {
		echo '<tr>
			  <td align="center">'.$row["id"].'</td>
			  <td align="center">'.$row["postedby"].'</td>
			  <td align="center">'.$row["fullname"].'</td>
			  <td align="center">'.$row["datetime"].'</td>
			  <td align="center">'.$row["replyto"].'</td>
			  <td align="center">'.$row["message"].'</td>
			  <td align="center"><input type="submit" name= "reply" value="Reply To '.$row["id"].'"/></td>			  
			  </tr>';
	}		
	echo '</fieldset></form>';
 
} catch (PDOException $e) {
	print "Error!: " . $e->getMessage() . "<br/>";
	die();
}

?>

</body>
</html>
