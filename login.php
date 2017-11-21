<html>
<head><title>Login Page</title></head>
<body>

<?php

error_reporting(E_ALL);
ini_set('display_errors','On');

if(isset($_GET['userID'])){
	try{
		$dbboard = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$stmtlogin = $dbboard->prepare('select * from users where username="'.$_GET["userID"].'" and password="'.md5($_GET["password"]).'"');
		$stmtlogin->execute();
		if ($row = $stmtlogin->fetch()){
			$message="Login Successfully done";
			echo '<script type="text/javascript">window.location.href="board.php?login=success&user='.$_GET["userID"].'";</script>';
			exit;
		}
		else{
			$message="Incorrect user name or passwrord. Please try again.";
			echo "<script type='text/javascript'>alert('$message');</script>";
		}
	}catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
		die();
	}
}

if(!isset($_GET['login'])){
	
echo '<fieldset><legend>Registered Users Login Here</legend>
<form name="login" method="get" accept-charset="utf-8">
    <div>User Name: <input type="text" name="userID"></div></br>
    <div>Password: <input type="password" name="password"></div></br>
    <div><input type="submit" value="Login" action="board.php">
	<a href="login.php?NewUser=true">New User Register Here</a></div>
</form>
</fieldset>';

}

if(isset($_GET['newuserID'])){
	try{
		$dbboard = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$stmtlogin = $dbboard->prepare('select * from users where username="'.$_GET["newuserID"].'"');
		$stmtlogin->execute();
		if ($row = $stmtlogin->fetch()){
			$message="User name alredy exists. Try again with a differnt name.";
			echo "<script type='text/javascript'>alert('$message');</script>";
		}
		else{
			if ($_GET["newuserID"] != "" && $_GET["newpassword"]!= "" ){		
				$dbboard->exec('insert into users values("'.$_GET["newuserID"].'","' . md5($_GET["newpassword"]) . '","'.$_GET["FullName"].'","'.$_GET["Email"].'")');
				$message="Your Registration done Successful";
				echo "<script type='text/javascript'>alert('$message');</script>";
				$dbboard->commit();
			}else{
				$message="Missing Info";
				echo "<script type='text/javascript'>alert('$message');</script>";
			}
		}
	}catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
		die();
	}
}	
if(isset($_GET['NewUser'])){
	echo '<fieldset><legend>Registration Form</legend><form name="New User" action="login.php" method="get" accept-charset="utf-8">
    <div>Enter User Name: <input type="text" name="newuserID"></div></br>
	<div>Enter Password: <input type="password" name="newpassword"></div></br>
	<div>Enter Full Name: <input type="text" name="FullName"></div></br>
    <div>Enter Email: <input type="email" name="Email"></div></br>	
    <div><input type="submit" value="Register">
	<a href="login.php?ExistingUser=true">Already Have An Account?</a></div></form></fieldset>';
}

?>

</body>
</html>