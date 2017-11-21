<html>
<head><title>Buy Products</title></head>
<body>

<fieldset><legend><h3>Shopping Basket:</h3></legend>
<?php 

session_start();
$basket="";
$price=0;
$addid;
$cart = array();
error_reporting(E_ALL);
ini_set('display_errors','On');

$xmlgetMenu = file_get_contents('http://sandbox.api.ebaycommercenetwork.com/publisher/3.0/rest/CategoryTree?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&visitorUserAgent&visitorIPAddress&trackingId=7000610&categoryId=72&showAllDescendants=true');
$xmlgetMenuDefault = new SimpleXMLElement($xmlgetMenu);

echo '<table id="basket" border="1" width="100%">
			<tr><th><b>Product ID</b></th>
				<th><b>Product Image</b></th>
				<th><b>Product Details</b></th>
				<th><b>Product Name</b></th>
				<th><b>Product Price</b></th>
				<th><b>Product Description</b></th>
				<th><b>Remove from Basket</b></th>
			</tr>';
	
if(!isset($_SESSION['basket']))	$_SESSION['basket']="";
if (!isset($_SESSION['price']))$_SESSION['price'] = 0;

if(isset($_GET['buy']) || isset($_GET['delete'])){
	if(isset($_GET['delete'])){
		$deltId=$_GET['delete'];
		if((stripos($_SESSION['basket'],$deltId))!== false){
			$pos = stripos($_SESSION['basket'],$deltId);
			$removeHead = $pos-8;
			$removeEnd=$removeHead+3;
			$rest = substr($_SESSION['basket'],$removeHead);
			$lastpos = stripos($rest,"</tr>")+4+$removeHead;
			$len = $lastpos-$removeHead+1;
			$_SESSION['basket']= substr_replace($_SESSION['basket'],'',$removeHead , $len);
			$xmlurldelBasket = "http://sandbox.api.ebaycommercenetwork.com/publisher/3.0/rest/GeneralSearch?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&visitorUserAgent&visitorIPAddress&trackingId=7000610&productId=".$deltId;
			$xmldelstrBasket = file_get_contents($xmlurldelBasket);
			$xmldelBasket = new SimpleXMLElement($xmldelstrBasket);
			foreach ($xmldelBasket->categories->category->items->product as $p){
				$_SESSION['price'] = $_SESSION['price']-(double)$p->minPrice;
			}
			
		}
		$_SESSION['basket']=$_SESSION['basket'];
				
	}
	if(isset($_GET['buy'])){
		$prodid=$_GET['buy'];
		array_push($cart, $prodid);
	}	

	foreach($cart as $bucketid)
	if((stripos($_SESSION['basket'],$prodid))== false){
		$xmlBasket = "http://sandbox.api.ebaycommercenetwork.com/publisher/3.0/rest/GeneralSearch?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&visitorUserAgent&visitorIPAddress&trackingId=7000610&productId=".$bucketid;
		$xmlstrBasket = file_get_contents($xmlBasket);
		$xmlFinalBasket = new SimpleXMLElement($xmlstrBasket);
		foreach ($xmlFinalBasket->categories->category->items->product as $p){
			if((stripos($_SESSION['basket'],$prodid))== false){
			$_SESSION['basket']= $_SESSION['basket'].'<tr><td>'.$p['id'].'</td>
			<td><img src="'.$p->images->image->sourceURL.'"/></td>
			<td><a href="'.$p->productOffersURL.'">More Details</a></td>
			<td>'.$p->name.'</td><td>$'.$p->minPrice.'</td>
			<td>'.$p->fullDescription.'</td>
  			<td><a href="buy.php?delete='.$p['id'].'"><input type="button" value = "Delete From Cart"></a></td>
			</tr>';
			$_SESSION['price'] = $_SESSION['price']+(double)$p->minPrice;
		}}
	}
	echo $_SESSION['basket'];
	echo "</table>";
	if($_SESSION['price']==0) echo "<h4>Cart is Empty</h4>";
	echo "<h4>Total Price:".$_SESSION['price']."$<p/></h4>";
}
else{
	if(isset($_GET['clear'])){
		$_SESSION['basket']="";
		$_SESSION['price'] = 0;
	}	
	echo $_SESSION['basket'];
	echo "</table>";	
	if($_SESSION['price']==0) echo "<h4>Cart is Empty</h4>";
	echo "<h4>Total Price:".$_SESSION['price']."$<p/></h4>";
}
	
?>			

<p/>
<div name="basket"></div>
<form action="buy.php" method="GET">
<input type="hidden" name="clear" value="1"/>

<input type="submit" value="Empty Basket"/>
</form>

</fieldset><p/>

<form action="buy.php" method="GET">
<fieldset><legend><h3>Search Products</h3></legend>
<label>Category: <select name="category"><?php 
foreach ($xmlgetMenuDefault->category as $c){
	echo"</optgroup>";
	echo "<option value='".(string)$c["id"]."'>".(string)$c->name."</option><optgroup label='".(string)$c->name."'>";
	foreach ($c->categories->category as $c1){
		echo"</optgroup>";
		echo "<option value='".(string)$c1["id"]."'>".(string)$c1->name."</option><optgroup label='".(string)$c1->name."'>";	
		foreach ($c1->categories->category as $c2){
			echo "<option value='".(string)$c2["id"]."'>".(string)$c2->name."</option>";
		}
    } 
}	
?></select></label>
<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Enter keywords: <input type="text" name="search"/><label>
<input type="submit" value="Search"/><br></br>
</fieldset><p/>
<fieldset>
<legend><h3>Search Results:</h3></legend>

<?php
if(isset($_GET['category']) && isset($_GET['search']) && $_GET['search'] != null){
	$categoryID=$_GET['category'];
	$keyword=$_GET['search'];
	$keyword=str_replace(" ","+",$keyword);
	$url = "http://sandbox.api.shopping.com/publisher/3.0/rest/GeneralSearch?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&visitorUserAgent&visitorIPAddress&trackingId=7000610&categoryId=".$categoryID."&keyword=".$keyword."&numItems=20";
	$xmlstr = file_get_contents($url);
	$xml = new SimpleXMLElement($xmlstr);
	echo '<table id="results" border="1" width="100%">
			<tr><th><b>Product ID</b></th>
				<th><b>Product Image</b></th>
				<th><b>Product Details</b></th>
				<th><b>Product Name</b></th>
				<th><b>Product Price</b></th>
				<th><b>Product Description</b></th>
				<th><b>Buy</b></th>
			</tr>';
	foreach ($xml->categories->category->items->product as $p){
		echo '<tr><td>'.$p['id'].'</td>
				  <td><img src="'.$p->images->image->sourceURL.'"/></td>
				  <td><a href="'.$p->productOffersURL.'">More Details</a></td>
				  <td>'.$p->name.'</td><td>$'.$p->minPrice.'</td>
				  <td>'.$p->fullDescription.'</td>
				  <td><a href="buy.php?buy='.$p['id'].'"><input type="button" value = "Add To Cart"></a></td>
			  </tr>';
    }
	echo'</table>';	
}	
?>

</fieldset>
</form>
<p/>
</body>
</html>