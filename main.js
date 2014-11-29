requirejs.config({
 paths: {
        jquery: 'node_modules/jquery/dist/jquery.min'
    }
 });

requirejs(['js/Authentication'], function (Auth){

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
		
		auth.authenticate($('[name=username]').val(), $('[name=password]').val())
		.then(onFulfilled, onRejected);
	});

})