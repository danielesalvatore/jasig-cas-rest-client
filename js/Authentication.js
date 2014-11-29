define([
	'jquery',
	'js/Config'
	], function ($, config) {

	function Auth(){}

	Auth.prototype.getTGT = function (username, password) {

		var self = this;

		return new Promise(function(fulfilled, rejected){

			$.ajax({
			  type: "POST",
			  url: config.CAS_SERVER,
			  data: 'username='+username+'&password='+password,
			  success: function(data, status, xhr){
			   	return self.getST(data, status, xhr).then(fulfilled, rejected);
			  },
			  error: rejected
			});
		});
	};

	Auth.prototype.getST = function (data, status, xhr) {

		return new Promise(function(fulfilled, rejected){
			
			$.ajax({
			  type: "POST",
			  url: xhr.getResponseHeader('Location'),
			  data: 'service=' + config.SERVICE_TO_ACCESS,
			  success: fulfilled,
			  error: rejected
			});
		});
	};

	Auth.prototype.cas = function (username, password) {
		
		return this.getTGT(username, password);
	}

	Auth.prototype.mock = function (username, password) {
		
		return new Promise(function(fulfilled, rejected){
			
			if (username === 'mock') {
				fulfilled('fake-service-ticket-123456789');
			} else {
				rejected();
			}
		});
	};

	Auth.prototype.authenticate = function (username, password){

		var loginFn = $.proxy(this[config.AUTH_METHOD], this);

		if (loginFn){
			return loginFn(username, password);
		} else {
			throw new Error('ERROR: Unknown Authentication method "' + config.AUTH_METHOD +'"');
		}
	};

	return Auth;

});