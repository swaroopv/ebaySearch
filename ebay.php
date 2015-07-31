<?php 
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");
//require_once('FirePHPCore/fb.php');
//ob_start();
//error_reporting(0);
//fb("hello");

	define("APP_ID", "student6b-3af5-4e84-8b08-541cbaf6c51") ;

	$myURL = 'http://svcs.ebay.com/services/search/FindingService/v1?';
	$options =  array(
	"siteid" => "0",
	"SECURITY-APPNAME" => APP_ID,	
	"OPERATION-NAME" => "findItemsAdvanced",
	"SERVICE-VERSION" => "1.0.0",
	"RESPONSE-DATA-FORMAT" => "XML",
	"keywords" => $_GET["Keywords"]
	);
	$itemFilterCount = 0;
	$x = 0;	
//	$options["itemFilter(".$itemFilterCount.").paramName"] =  "Currency";
//	$options["itemFilter(".$itemFilterCount.").paramValue"] =  "XML";	
//	++$itemFilterCount;
	if(!empty($_GET["minPrice"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "MinPrice";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["minPrice"];
		++$itemFilterCount;
	}
	if(!empty($_GET["maxPrice"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "MaxPrice";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["maxPrice"];
		++$itemFilterCount;		
	}

	if(!empty($_GET['condition'])){
		
		$options["itemFilter(".$itemFilterCount.").name"] =  "Condition";
		
		foreach($_GET['condition'] as $condition) {
			$options["itemFilter(".$itemFilterCount.").value(".$x.")"] =  $condition;
			++$x;
		}
		++$itemFilterCount;
		$x =0;
	}	
	if(!empty($_GET['ListingType'])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "ListingType";
		$x = 0;
		foreach($_GET['ListingType'] as $ListingType) {
			$options["itemFilter(".$itemFilterCount.").value(".$x.")"] =  $ListingType;
			++$x;
		}
		++$itemFilterCount;
		$x = 0;
	}
	if(isset($_GET["ReturnsAcceptedOnly"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "ReturnsAcceptedOnly";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["ReturnsAcceptedOnly"];
		++$itemFilterCount;	
	}
	if(isset($_GET["FreeShippingOnly"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "FreeShippingOnly";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["FreeShippingOnly"];
		++$itemFilterCount;	
	}
	if(isset($_GET["ExpeditedShippingType"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "ExpeditedShippingType";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["ExpeditedShippingType"];
		++$itemFilterCount;	
	}	
	if(!empty($_GET["MaxHandlingTime"])){
		$options["itemFilter(".$itemFilterCount.").name"] =  "MaxHandlingTime";
		$options["itemFilter(".$itemFilterCount.").value"] =  $_GET["MaxHandlingTime"];
		++$itemFilterCount;	
	}	
	if(isset($_GET["sortOrder"])){
		$options["sortOrder"] =  $_GET["sortOrder"];
	}
	if(isset($_GET["entriesPerPage"])){
		$options["paginationInput.entriesPerPage"] =  $_GET["entriesPerPage"];		
	}	
	$options["outputSelector(1)"] =  "SellerInfo";
	$options["outputSelector(2)"] =  "PictureURLSuperSize";
	$options["outputSelector(3)"] =  "StoreInfo";
	$options["outputSelector(2)"] =  "PictureURLSuperSize";
	$options["paginationInput.pageNumber"] =  $_GET["pageNumber"];	
	
	
	$myURL .= http_build_query($options,'','&');
	//echo $myURL;
	$response = file_get_contents($myURL) or die(print_r(error_get_last()));
	//echo $response;
	$xml = simplexml_load_string($response);
	echo "{";
		if($xml->ack == "Success" && intval( $xml->searchResult['count']) == 0) 
			echo "\"ack\":\"No results found\"";
		else
			echo "\"ack\":\"".$xml->ack."\"";
	if($xml->ack == "Success" && intval( $xml->searchResult['count']) > 0){   
	   echo ",";
	   echo "\"resultCount\":\"".$xml->paginationOutput->totalEntries."\",";
	   echo "\"pageNumber\":\"".$xml->paginationOutput->pageNumber."\",";
	   echo "\"itemCount\":\"".$xml->paginationOutput->entriesPerPage."\",";
	   $count = intval( $xml->searchResult['count']);
	   for ($i=0 ; $i< $count; ++$i) {
			$item = $xml->searchResult->item[$i];
			echo "\"item".$i."\" : {";
				echo "\"basicInfo\" : {";
					echo "\"title\":\"".urlencode($item->title)."\",";
					echo "\"viewItemURL\":\"".urlencode($item->viewItemURL)."\",";
					echo "\"galleryURL\":\"".urlencode($item->galleryURL)."\",";
					echo "\"pictureURLSuperSize\":\"".urlencode($item->pictureURLSuperSize)."\",";
					echo "\"convertedCurrentPrice\":\"".$item->sellingStatus->convertedCurrentPrice."\",";
					echo "\"shippingServiceCost\":\"".$item->shippingInfo->shippingServiceCost."\",";
					echo "\"conditionDisplayName\":\"".$item->condition->conditionDisplayName."\",";
					echo "\"listingType\":\"".$item->listingInfo->listingType."\",";
					echo "\"location\":\"".$item->location."\",";
					echo "\"categoryName\":\"".$item->primaryCategory->categoryName."\",";
					echo "\"topRatedListing\":\"".$item->topRatedListing."\"";
				echo "},";
				echo "\"sellerInfo\" : {";
					echo "\"sellerUserName\":\"".$item->sellerInfo->sellerUserName."\",";
					echo "\"feedbackScore\":\"".$item->sellerInfo->feedbackScore."\",";
					echo "\"positiveFeedbackPercent\":\"".$item->sellerInfo->positiveFeedbackPercent."\",";
					echo "\"feedbackRatingStar\":\"".$item->sellerInfo->feedbackRatingStar."\",";
					echo "\"topRatedSeller\":\"".$item->sellerInfo->topRatedSeller."\",";
					echo "\"sellerStoreName\":\"".$item->storeInfo->storeName."\",";
					echo "\"sellerStoreURL\":\"".$item->storeInfo->storeURL."\"";
				echo "},"	;
				echo "\"shippingInfo\" : {";
					echo "\"shippingType\":\"".$item->shippingInfo->shippingType."\",";
					if ( is_array($item->shippingInfo->shipToLocations)){
						echo "\"shipToLocations\":";
						$length = count($item->shippingInfo->shipToLocations);
						for ($j = 0; $j < $length; ++$j) {
						  echo $item->shippingInfo->shipToLocations[$j];
						  if(($j + 1)!= $length)
							echo ",";
						}
						echo ",";
					}else{
						echo "\"shipToLocations\":\"".$item->shippingInfo->shipToLocations."\",";
					}	
					echo "\"expeditedShipping\":\"".$item->shippingInfo->expeditedShipping."\",";
					echo "\"oneDayShippingAvailable\":\"".$item->shippingInfo->oneDayShippingAvailable."\",";
					echo "\"returnsAccepted\":\"".$item->shippingInfo->returnsAccepted."\",";
					echo "\"handlingTime\":\"".$item->shippingInfo->handlingTime."\"";
				echo "}"					;
			echo "}";
			if(($i + 1) != $count)
				echo ",";
	   }
	}   
	   
    echo "}";


	
?>	