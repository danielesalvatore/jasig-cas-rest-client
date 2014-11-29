requirejs.config({
 paths: {
        jquery: 'node_modules/jquery/dist/jquery.min'
    }
 });

requirejs([
	'js/Authentication',
	'config/Config'
	], function (Auth, config){

	'use strict';

	var auth = new Auth(),
		count = 0;

	function onFulfilled(ST){

		$('#log').prepend('<p>['+ count +'] SUCCESS: User is authenticated. [ST: '+ST+'] </p><p> ######## </p>');
	}

	function onRejected( jqXHR, textStatus, errorThrown ){

		$('#log').prepend('<p>['+ count +'] ERROR: User is NOT authenticated. [Error: '+errorThrown+']</p><p> ######## </p>');

		throw new Error('ERROR: ' + errorThrown);
	}

	$('#submit').on('click', function () {
		
		count++;

		var credentials = {};
		credentials[config.USERNAME] = $('[name=username]').val();
		credentials[config.PASSWORD] = $('[name=password]').val();

		auth.authenticate(credentials).then(onFulfilled, onRejected);
	});

})