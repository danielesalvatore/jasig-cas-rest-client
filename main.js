requirejs.config({
 paths: {
        jquery: 'node_modules/jquery/dist/jquery.min'
    }
 });

requirejs(['js/Authentication'], function (Auth){

	var auth = new Auth();

	function onFulfilled(ST){

		$('#log').append('<p>SUCCESS: User is authenticated.</p>');
		$('#log').append('<p>Service ticket:</p>');
		$('#log').append('<p>'+ST+'</p>');
		$('#log').append('<p> ######## </p>');
	}

	function onRejected( jqXHR, textStatus, errorThrown ){

		$('#log').append('<p>ERROR: User is NOT authenticated.</p>');
		$('#log').append('<p>Error Thrown:</p>');
		$('#log').append('<p>'+errorThrown+'</p>');
		$('#log').append('<p> ######## </p>');

		throw new Error('ERROR: ' + errorThrown);
	}

	$('#submit').on('click', function () {
		auth.authenticate($('[name=username]').val(), $('[name=password]').val())
		.then(onFulfilled, onRejected);
	});

})