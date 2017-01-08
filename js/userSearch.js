/**
 * userSearch is a widget that allows the user to live search for github users
 * It uses the autocomplete jquery-ui plugin and calls the Github API for the 
 * search resutls.
 * @param {jQuery} inputField jQuery element of the input field that the userSearch will be applied to.
 */

var AJAX_QUERY_GITHUB_USERS_GET = 'https://api.github.com/search/users';
var HEADER_TEXT_MATCHES = 'application/vnd.github.v3.text-match+json';
var CLASS_RESULT_CONTAINER = 'userResultContainer';
var CLASS_USER_AVATAR = 'userAvatar';
var CLASS_HIGHLIGHTED_MATCH = 'highlightedMatch';
var accessToken = '9a5600c977a80ce7759e4be83765d25ec40f7361';

var userSearch = function (params) {
	'use strict';

	var config = {
		inputField: null
	};

	$.extend(config,params,true);

	/**
	 * Initializes the autocomplete plugin to the element passed
	 * as parameter.
	 */
	var init = function(){
		if(config.inputField instanceof jQuery){
			config.inputField.autocomplete({
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

			config.inputField.data('ui-autocomplete')._renderItem = function( ul, item ) {
		  		return renderResultItem(ul,item);
			};

		}
	};
	
	/**
	 * Makes the ajax call to fetch the data of the users.
	 * @param {Object} request The object with the request given by the autocomplete plugin
	 * @param {function} response The callback function that will return the data from the request to the autocomplete plugin.
	 */

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

	/**
	 * Called when the event of select is triggered from the plugin.
	 * It adds the username in the input field and opens the github
	 * user's profile page in a new tab.
	 * @param {Object} ui 
	 */
	var selectUser = function(ui){
			config.inputField.val(ui.item.login);
			window.open(ui.item.html_url,'_blank');
	};

	/**
	 * Renders the result item as a custom container 
	 * @param {jQuery} ul The HTML element of the list where the result item will be appended to.
	 * @param {Object} item The object containing the information of the user.
	 */
	var renderResultItem = function(ul, item){
		return $( "<li>" )
		    .attr( "data-value", item.login )
		    .append( '<div class="'+CLASS_RESULT_CONTAINER+'"><div class="'+CLASS_USER_AVATAR+'" style="background-image:url(\''+item.avatar_url+'\');"></div>'+highlightMatch(item,config.inputField.val())+'</div>')
		    .appendTo( ul );
	};

	/**
	 * Highlights the typed string in the result item that contains the matched string.
	 * @param {Object} item The object containing the information of the user.
	 * @param {String} val The value of the input field that the user has typed.
	*/
	var highlightMatch = function(item, val){
			var regEx = new RegExp(val, 'ig');
			var highlightedLogin = item.login.replace(regEx,'<span class="'+CLASS_HIGHLIGHTED_MATCH+'">'+val+'</span>');
			return highlightedLogin;
	};

	init();
};