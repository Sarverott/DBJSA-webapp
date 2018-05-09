// -------------------------DataBase JS accesser-----------------------------
//just a map for programmist
/*
	BE={
		menu:'.menu',
		insert:'.insert',
		confirm:'.confirm',
		save:'.save'
		cache:'.cache'
		favor:'.favor'
		
	}
*/
var listConst='.list-group .list-group-item',
	saveCache = new Array(10),
	favorite = [],
	callbackData;
$(document).ready(function(){
	$('.last-mod-DBJSA').last().append(document.lastModified);
	setup();
});
function anyCookieAvaible(){
	
}
function setup(){
	if(!anyCookieAvaible()){
			$(".info-DBJSA").click()
	}
	registListeners();
	readCookieData();
}

// --------- cookies reading -----------

//----main read----
function readCookieData(){
	readStoreCache();
	loadConnectionDataCookies();
}
function readStoreCache(){
	saveCache = readStoreCookie('saveCache');
	favorite = readStoreCookie('favorite');
	!((saveCache.length)||(favorite.length))?true:refreshStore();
}
function loadConnectionDataCookies(){
	readConnectCookie('host');
	readConnectCookie('log');
	readConnectCookie('pass');
}
//----subfunctions
function readStoreCookie(name){
	var returnData=[];
	if($.cookie(name)){
		returnData=( atob($.cookie(name)) ).split('","');
	}
	return returnData;
}
function readConnectCookie(name){
	if( ($.cookie(name)) && ($('.'+name+'-DBJSA').val() == '') ){
		$('.'+name+'-DBJSA').val( atob($.cookie(name)) );
	}
}

// --------- writeing cookies ----------

function saveConnectionSettings(){
	$.cookie(
		'host',
		btoa($('.host-DBJSA').val()), 
		{ expires: 360 }
	);
	$.cookie(
		'log', 
		btoa($('.log-DBJSA').val()), 
		{ expires: 360 }
	);
	$.cookie(
		'pass', 
		btoa($('.pass-DBJSA').val()), 
		{ expires: 360 }
	);
	console.log('zapisano dane logowania("'+$('.host-DBJSA').val()+'", "'+$('.log-DBJSA').val()+'")');
}
function updateStoreCookies(){
	$.cookie(
		'favorite', 
		btoa(favorite.join('","')), 
		{ expires: 360 }
	);
	$.cookie(
		'saveCache', 
		btoa(saveCache.join('","')), 
		{ expires: 360 }
	);
}

// --------- listeners setting ------------

//for textarea resizing enable
/*
function createInsertBoxListeners(){
	$('.insert').on('focus', function(){
		$('.menu').css('opacity', '0.3');
	});
	$('.insert').on('blur', function(){
		$('.menu').css('opacity', '1');
	});
}
*/
function registListeners(){
	//createInsertBoxListeners()
	$(".info-DBJSA").click(function(){
        $(".info-modal-DBJSA").modal();
    });
	$('.btn').on( "mouseleave", function(){
		$(this).blur();
	});
	$('.confirm-DBJSA').on('click', function(){
		confirmCommand();
	});
	$('.save-textarea-DBJSA').on('click', function(){
		addToSaveCache( $('.insert-DBJSA').val() );
	});
	$('.clear-textarea-DBJSA').on('click', function(){
		$('.insert-DBJSA').val('');
	});
	$('.save-settings-DBJSA').on('click', function(){
		saveConnectionSettings();
	});
	$('.forgot-me-DBJSA').on('click', function(){
		$.removeCookie('host');
		$.removeCookie('log');
		$.removeCookie('pass');
		$.removeCookie('saveCache');
		$.removeCookie('favorite');
		location.reload();
	});
}
function addListenerOnStoreElements(){
	$('.cache-DBJSA span, .cache-DBJSA button, .favor-DBJSA span, .favor-DBJSA button').off();
	$('.cache-DBJSA span').on('click', function() {
		followCommandFromCache($(this).data('index'));
	});
	$('.favor-DBJSA span').on('click', function() {
		followCommandFromFavorite($(this).data('index'));
	});
	$('.cache-DBJSA button').on('click', function() {
		followTaskForStoreButton(
			$(this).data('index'), 
			$(this).attr('title'), 
			'saveCache');
	});
	$('.favor-DBJSA button').on('click', function() {
		followTaskForStoreButton(
			$(this).data('index'), 
			$(this).attr('title'), 
			'favorite');
	});
	addListenerOnSettingsMenu()
}
function addListenerOnSettingsMenu(){
	$('.check-table-DBJSA').on('click', function() {
		console.log("zmiana trybu wyświetlania zwrotki");
		displayCallback(callbackData);
	});
}

// --------- refreshing store, cookies ----------

function refreshStore(){
	$('.favor-DBJSA').html('');
	$('.cache-DBJSA').html('');
	updateStoreCookies();
	$('.cache-DBJSA, .favor-DBJSA').append($('<ul>',{
		class:'list-group'
	}));
	saveCache=$.grep(saveCache, function(arrayElement, indexOfArray){
		return saveCacheGrepAction(arrayElement, indexOfArray);
	});
	favorite=$.grep(favorite, function(arrayElement, indexOfArray){
		return favoriteGrepAction(arrayElement, indexOfArray)
	});
	addListenerOnStoreElements();
	return false;
}

//---------create DOM elements----------

function favoriteGrepAction(arrayElement, indexOfArray){
	$('.favor-DBJSA .list-group').append($('<li>',{
		class:'list-group-item'
	}));
	createDivInStore('favor', arrayElement, indexOfArray);
	createButtonInStore('favor', 'delete', indexOfArray);
	return arrayElement;
}
function saveCacheGrepAction(arrayElement, indexOfArray){
	if(arrayElement){
		$('.cache-DBJSA .list-group').append($('<li>',{
			class:'list-group-item'
		}));
		createDivInStore('cache', arrayElement, indexOfArray);
		createButtonInStore('cache', 'save', indexOfArray);
		createButtonInStore('cache', 'delete', indexOfArray);
	}
	return arrayElement;
}
function displayCallback(dataIn){
	$('.callback-DBJSA').removeClass('panel-default panel-success').addClass('alert-danger').append($('<strong>',{
		html:'BŁĄD! '+e.status
	}));
	if ($('.check-table-DBJSA').prop('checked')) {
		tableCallbackDisplay(dataIn);
	}else{
		simpleCallbackDisplay(dataIn);
	}
}
//---- simple callback display ----
function simpleCallbackDisplay(inputArray){
	$.grep(inputArray, function(arrayElement){
		singleCallbackDivCreate(arrayElement)
	});
}
function singleCallbackDivCreate(inputArray){
	$('.callback-DBJSA').append($('<div>'));
	$.grep(inputArray, function(arrayElement){
		$('.callback-DBJSA div').last().append(arrayElement + ',');
	});
}
//---- table callback display ----
function tableCallbackDisplay(inputArray){
	$('.callback-DBJSA').html($('<table>'));
	$.grep(inputArray,function(arrayElement){
		singleCallbackTabCreate(arrayElement);
	});
}
function singleCallbackTabCreate(inputArray){
	$('.callback-DBJSA table').append($('<tr>'));
	$.grep(inputArray,function(arrayElement){
		$('.callback-DBJSA table tr').last().append($('<td>',{
			html:arrayElement
		}));
	});
}
//---- store elements display ----
function createDivInStore(storeName, dataInElement, dataIndex){
	var className=(storeName == 'favor') ? '.favor-DBJSA '+listConst : '.cache-DBJSA '+listConst;
	$(className).last().append($('<span>',{
		html:'<mark>'+dataInElement+'</mark>'
	}).data('index', dataIndex));
}
function createButtonInStore(storeName, classOfButton, dataIndex){
	var className=(storeName == 'favor') ? '.favor-DBJSA '+listConst : '.cache-DBJSA '+listConst;
	$(className).last().append($('<button>',{
		class:classOfButton,
		title:classOfButton,
		html:(classOfButton == 'delete' ? 'X' : '@')
	}).data('index', dataIndex));
}

//---------execution functions----------

function confirmCommand(){
	var insertData = $('.insert-DBJSA').val();
	//$('.insert').val('');
	addToSaveCache( insertData );
	prepareMyAJAX( insertData );
}
function addToSaveCache(item){
	saveCache.unshift( item );
	saveCache.splice( 10 , saveCache.length - 10 );
	refreshStore();
}
function followCommandFromCache( indexOfCell ){
	$('.insert-DBJSA').val( saveCache.splice( indexOfCell , 1) );
	$('.confirm-DBJSA').click();
}
function followCommandFromFavorite( indexOfCell ){
	$('.insert-DBJSA').val( favorite[indexOfCell] );
	$('.confirm-DBJSA').click();
}

//---store boxes function---

function followTaskForStoreButton( index , task , mode ){
	console.log('dsadsad');
	if( mode == 'saveCache'){
		if(task == 'delete'){
			saveCache.splice( index, 1);
		}else{
			favorite.unshift( saveCache.splice( index , 1 ) );
		}
	}else{
		favorite.splice( index, 1 );
	}
	refreshStore();
}

// ------- preparing ajax request ---------

function prepareMyAJAX( sendData ){
	console.log('wprowadzono: "' + sendData + '"');
	ajaxHELLO(
		sendData,
		$('.host-DBJSA').val(), 
		'POST'
	);
}
function ajaxHELLO( sendData , serverURL , sendType ){
	$.ajax({
		type: sendType,
		dataType: 'json',
		url: serverURL,
		data: sendData,
		beforeSend: function ( x ){ 
			x.withCredentials = true;
			console.log('"Authorization", "' + makeBaseAuth($('.log').val(), $('.pass-DBJSA').val()) + '"');
			x.setRequestHeader(
				'Authorization', 
				makeBaseAuth($('.log-DBJSA').val(), $('.pass-DBJSA').val())
			); 
		},
		error: function ( e ){
			$('.callback-DBJSA').removeClass('panel-default panel-success').addClass('alert-danger').html($('<div>',{
				class:'panel-heading',
				html:'BŁĄD! '+e.status
			})).append($('<div>',{
				class:'panel-body',
				html:$('<strong>',{html:e.statusText})
			}).append('<br />'+e.getAllResponseHeaders()+'<br /><br />błąd wskazuje że, najprawdopodobniej gdzieś źle są wprowadzone informacje, bądź nie masz połączenia z bazą danych'));
			
		}	
	}).done(function( data ){
		callbackData=data;
		displayCallback( data );
	});
}
function makeBaseAuth(login, pass) {
	return "Basic " + btoa(login + ':' + pass);
}