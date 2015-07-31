function scrollToResult(){
	var resultTitle = document.getElementById("resultContainer");
	if(resultTitle && ($(document).scrollTop() + 50 )<= resultTitle.offsetTop){
		//var left = resultTitle.offsetLeft;
		var top = resultTitle.offsetTop ;
		var i=0;
		var id = setInterval(function(){
			scrollTo(0,top*i/100);
			++i;
			if(i >= 100)clearInterval(id);
		}, 5);
	}	
}
function onClear(){
	validator.resetForm()
	return false;
}
function processResult(){
	
	document.getElementById("resultContainer").innerHTML = "";
	document.getElementById("pagination").innerHTML = "";
	
	var total = Number(result.itemCount);
	var pageNo;
	if(total > 0){
		pageNo = Number($("[name='pageNumber']").attr("value"));
		var from = (pageNo-1)*Number(result.itemCount) + 1;
		var to = pageNo*Number(result.itemCount);
		if( to > Number(result.resultCount))
			to = Number(result.resultCount);
			total = to - from + 1;
		$("#resultContainer").append("<h3> "+from+"-"+to+" items out of "+ result.resultCount +"</h3>");
	}else{
		$("#resultContainer").append("<h3> No results found </h3>");
		return;
	}
	for(var i=0; i < total; ++i){
		var item = result["item"+i];
		var mediaObject = $(
		'<div class="media">\
		  <div class="media-left">\
			<a data-toggle="modal" data-target="#myModal'+i+'" >\
			  <img class="media-object" src="'+ decodeURIComponent(item.basicInfo.galleryURL) +'" alt="no image" >\
			</a>\
		  </div>\
		  <div class="media-body">\
			<h4 class="media-heading"><a target="_blank" href="'+decodeURIComponent(item.basicInfo.viewItemURL.replace(/\+/g, '%20'))+'">'+decodeURIComponent(item.basicInfo.title.replace(/\+/g, '%20'))+'</a></h4>\
			<div id="content">\
				<span class="price">Price:$'+item.basicInfo.convertedCurrentPrice+'</span>\
			</div>\
		  </div>\
		</div>'	)
		var content = mediaObject.find("#content");
		var shipType = 'Not Free';
		if(item.shippingInfo.shippingType == "Free"){
			content.append('<span class="inline-block">(FREE Shipping)</span>');
			shipType = 'Free';
		}else if(item.basicInfo.shippingServiceCost && item.basicInfo.shippingServiceCost != "0.0"){
			content.append('<span class="">(+ $'+item.basicInfo.shippingServiceCost+' for shipping)</span>');
		}
		content.append('<span> Location: '+item.basicInfo.location+'</span')
		if(item.basicInfo.topRatedListing == "true"){
			content.append('<span><img class=topRated title=topRated src="http://cs-server.usc.edu:45678/hw/hw6/itemTopRated.jpg"></span>')
		}					
		content.append('<span class="inline-block"> <a data-toggle="collapse" href="#collapse'+i+'" aria-expanded="false" >View Details</a></span>')
		content.append('<span> <img onclick="fbClick('+i+', this)" src="http://cs-server.usc.edu:45678/hw/hw8/fb.png"></span>');
		var buyFormat;
		if(item.basicInfo.listingType == "FixedPrice" || item.basicInfo.listingType == "StoreInventory"){
			buyFormat = "Buy It Now";
		}else if(item.basicInfo.listingType == "Auction"){
			buyFormat =  "Auction";
		}else if(item.basicInfo.listingType == "Classified"){
			buyFormat =  "Classified Ad";
		}					
		var topRated;
		if(item.sellerInfo.topRatedSeller == "true")
			topRated = '<span class="glyphicon glyphicon-ok" style="color: green"></span>';
		else
			topRated = '<span class="glyphicon glyphicon-remove" style="color: red"></span>';
		var storeURL;
		if(item.sellerInfo.sellerStoreURL)
			storeURL = '<a target="_blank" href=\"'+item.sellerInfo.sellerStoreURL+'\">'+item.sellerInfo.sellerUserName+'</a>';
		else
			storeURL = "N/A";

		var expShip;
		if(item.shippingInfo.expeditedShipping == "true")
			expShip = '<span class="glyphicon glyphicon-ok" style="color: green"></span>';
		else
			expShip = '<span class="glyphicon glyphicon-remove" style="color: red"></span>';

		var oneShip;
		if(item.shippingInfo.oneDayShippingAvailable == "true")
			oneShip = '<span class="glyphicon glyphicon-ok" style="color: green"></span>';
		else
			oneShip = '<span class="glyphicon glyphicon-remove" style="color: red"></span>';

		var returnAccepted;
		if(item.shippingInfo.returnsAccepted == "true")
			returnAccepted = '<span class="glyphicon glyphicon-ok" style="color: green"></span>';
		else
			returnAccepted = '<span class="glyphicon glyphicon-remove" style="color: red"></span>';			
		var condition = "N/A";
		if(item.basicInfo.conditionDisplayName){
			condition = item.basicInfo.conditionDisplayName;
		}
		var bigPicture = item.basicInfo.pictureURLSuperSize;
		if(!bigPicture){
			bigPicture = item.basicInfo.galleryURL;
		}					
		
		mediaObject.append('	\
		<div role="tabpanel" class="collapse" id="collapse'+i+'">\
		  <ul class="nav nav-tabs" role="tablist">\
			<li role="presentation" class="active"><a href="#basic'+i+'" aria-controls="home" role="tab" data-toggle="tab">Basic Info</a></li>\
			<li role="presentation"><a href="#seller'+i+'" aria-controls="profile" role="tab" data-toggle="tab">Seller Info</a></li>\
			<li role="presentation"><a href="#shipping'+i+'" aria-controls="messages" role="tab" data-toggle="tab">Shipping Info</a></li>\
		  </ul>\
		  <div class="tab-content">\
			<div role="tabpanel" class="tab-pane active" id="basic'+i+'">\
				<div><label>Category Name</label><span>'+item.basicInfo.categoryName+'</span></div>\
				<div><label>Condition</label><span>'+condition+'</span></div>\
				<div><label>Buying Format</label><span>'+buyFormat+'</span></div>\
			</div>\
			<div role="tabpanel" class="tab-pane" id="seller'+i+'">\
				<div><label>User Name</label><span>'+item.sellerInfo.sellerUserName+'</span></div>\
				<div><label>Feedback score</label><span>'+item.sellerInfo.feedbackScore+'</span></div>\
				<div><label>Positive feedback</label><span>'+item.sellerInfo.positiveFeedbackPercent+'</span></div>\
				<div><label>Feedback rating</label><span>'+item.sellerInfo.feedbackRatingStar+'</span></div>\
				<div><label>Top rated</label><span>'+topRated+'</span></div>\
				<div><label>Store</label><span>'+storeURL+'</span></div>\
			</div>\
			<div role="tabpanel" class="tab-pane" id="shipping'+i+'">\
				<div><label>Shipping type Name</label><span>'+shipType+'</span></div>\
				<div><label>Handling time</label><span>'+item.shippingInfo.handlingTime+'(s)</span></div>\
				<div><label>Shipping location</label><span>'+item.shippingInfo.shipToLocations+'</span></div>\
				<div><label>Expedited shipping</label><span>'+expShip+'</span></div>\
				<div><label>One day shipping</label><span>'+oneShip+'</span></div>\
				<div><label>Returns accepted</label><span>'+returnAccepted+'</span></div>\
			</div>\
		  </div>\
		</div>');
		mediaObject.append('\
		<div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		  <div class="modal-dialog">\
			<div class="modal-content">\
			  <div class="modal-header">\
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
				<h4 class="modal-title" id="myModalLabel">'+decodeURIComponent(item.basicInfo.title.replace(/\+/g, '%20'))+'</h4>\
			  </div>\
			  <div class="modal-body">\
				<img src="'+decodeURIComponent(bigPicture)+'">\
			  </div>\
			  <div class="modal-footer">\
			  </div>\
			</div>\
		  </div>\
		</div>');
		$("#resultContainer").append(mediaObject);

	
	}
	$('#pagination').pagination(Number(result.resultCount),{
		callback:function(page,component){
			console.info(page);
			if (pageNo == (page+1))
				return;
			else{
				$("[name='pageNumber']").attr("value",page+1);
				ajaxSubmit(oldForm);
			}	
		},
		items_per_page: Number($("[name=entriesPerPage]").val()),
		current_page: pageNo-1,
		num_display_entries: 5					
	});				


}
$(document).ready(function() {
	validator = $("#myForm").validate({
		rules: {
			Keywords: {
				required: true,
			},
			minPrice: {
				number: true,
				min: 0
			},
			maxPrice: {
			  number: true,
			  min: 0,
			  max: {
				depends: function(maxNode) {
					var minNode = document.getElementById("minPrice");
					var minValue = Number(minNode.value);
					var maxValue = Number(maxNode.value);

					if( minValue && maxValue < minValue){ //some value in min field not just white space
						return true;
					}				
					return false;
				}
			  }
			},
			MaxHandlingTime: {
				digits: true,
				min: 1
			}
		},
		messages: {
			Keywords: {
			  required: "Please enter a key word",
			  minlength: "Please enter atleast two characters"
			},					
			minPrice:{
				number: "Price should be a valid decimal number",
				min: "Minimum price cannot be below 0"
			},
			maxPrice:{
				number: "Price should be a valid decimal number",
				min: "Maximum price cannot be below 0",
				max: "Maximum price cannot be less than minimum price"
			},
			MaxHandlingTime:{
				digits: "Max handling time should be a valid digit",
				min: "Max handling time should be greater than or equal to 1"
			}
		}

	})
});

function ajaxSubmit(formData){

	if((!validator.valid() || !$("[name=Keywords]")[0].value) && !formData )
		return	
	if(formData){
		formData = formData.split("&");
		formData.pop();
		formData.push("pageNumber="+$("[name='pageNumber']").attr("value"));
		formData = formData.join('&');				
	}else{
		oldForm = null;
		result = null;
		$("[name='pageNumber']").attr("value",1)
	}

	$.ajax({
		   type: "GET",
		   url: "ebay.php",
		   data: formData || $("#myForm").serialize(), // serializes the form's elements.
		   success: function(data){
			   //console.log(data); // show response from the php script.
			   result = JSON.parse(data);
			   processResult();
			   scrollToResult();
		   }
		 });	
	oldForm = formData || $("#myForm").serialize();
	return false;

}
function fbClick(i, ref){
	var item = result["item"+i];
	var itemContents = ref.parentNode.parentNode.children;
	OnFbClick(decodeURIComponent(item.basicInfo.viewItemURL.replace(/\+/g, '%20')),
	decodeURIComponent(item.basicInfo.title.replace(/\+/g, '%20')),
	decodeURIComponent(item.basicInfo.galleryURL.replace(/\+/g, '%20')),
	itemContents[0].innerHTML+" "+itemContents[1].innerHTML+" "+itemContents[2].innerHTML,"");
}