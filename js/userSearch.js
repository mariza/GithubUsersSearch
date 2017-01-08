var AJAX_QUERY_GITHUB_USERS_GET = 'https://api.github.com/search/users';
var HEADER_TEXT_MATCHES = 'application/vnd.github.v3.text-match+json';
var CLASS_RESULT_CONTAINER = 'userResultContainer';
var CLASS_USER_AVATAR = 'userAvatar';
var CLASS_HIGHLIGHTED_MATCH = 'highlightedMatch';
var accessToken = '9a5600c977a80ce7759e4be83765d25ec40f7361';

var userSearch = function(params){

	$.ajaxSetup({
	    beforeSend: function(xhr) {
	        xhr.setRequestHeader('Accept', HEADER_TEXT_MATCHES);
	    }
	});

	var init = function(){
		if(params){
			params.inputField.autocomplete({
				source: function( request, response ) {
			        makeSearchCall(request,response);
			    },
			    delay: 500,
			    minLength: 2,
			    autoFocus: true,
			    select: function( event, ui ) {
			      	selectUser(ui);
			    }
			});

			params.inputField.data('ui-autocomplete')._renderItem = function( ul, item ) {
		  		return renderResultItem(ul,item);
			};

		}
	};

	var makeSearchCall = function(request,response){
		$.ajax( {
	          url: AJAX_QUERY_GITHUB_USERS_GET,
	          data: {
	            q: request.term,
	            in:'login',
	            access_token: accessToken
	          },
	          success: function( data ) {
	            response( data.items );
	          }});
	};

	var selectUser = function(ui){
			params.inputField.val(ui.item.login);
			window.open(ui.item.html_url,'_blank');
	};

	var renderResultItem = function(ul, item){
		return $( "<li>" )
		    .attr( "data-value", item.login )
		    .append( '<div class="'+CLASS_RESULT_CONTAINER+'"><div class="'+CLASS_USER_AVATAR+'" style="background-image:url(\''+item.avatar_url+'\');"></div>'+highlightMatch(item,params.inputField.val())+'</div>')
		    .appendTo( ul );
	};

	var highlightMatch = function(item, val){
			var regEx = new RegExp(val, 'ig');
			var highlightedLogin = item.login.replace(regEx,'<span class="'+CLASS_HIGHLIGHTED_MATCH+'">'+val+'</span>');
			return highlightedLogin;
	};

	init();
};