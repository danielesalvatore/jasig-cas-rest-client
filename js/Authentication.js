define([
	'jquery',
	'config/Config'
	], function ($, config) {

	'use strict';	

	function Auth(){}

	/**
    	Method gets the Ticket Granting Ticket of CAS protocol.
    	For more info: http://jasig.github.io/cas/4.0.0/index.html

     	@method getTGT
     	@param {String} User username
     	@param {String} User password
    **/
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

	/**
    	Method gets the Service Ticket of CAS protocol.
    	For more info: http://jasig.github.io/cas/4.0.0/index.html

     	@method getTGT
    **/
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

 	/**
    	Method performs CAS authentication.

     	@method casLogin
     	@param {Object} credentials Object hash containing user credentials.
    **/
	Auth.prototype.casLogin = function (credentials) {
		
		return this.getTGT(credentials[config.USERNAME], credentials[config.PASSWORD]);
	}

 	/**
    	Method mocks the login process for development purposes.

    	@method mockLogin
    	@param {Object} credentials Object hash containing user credentials.
    **/
	Auth.prototype.mockLogin = function (credentials) {
		
		return new Promise(function(fulfilled, rejected){
			
			if (credentials[config.USERNAME] === 'mock') {
				fulfilled('fake-service-ticket-123456789');
			} else {
				rejected();
			}
		});
	};

	/**
    	Method logs a user into the system with the configured login
     	function.

    	@method authenticate
    **/
	Auth.prototype.authenticate = function (credentials){

		if (!credentials.hasOwnProperty(config.USERNAME) || !credentials.hasOwnProperty(config.PASSWORD)){
			throw new Error('Error: missing '+config.USERNAME+' or '+config.PASSWORD );
		}

		var loginFn = $.proxy(this[config.AUTH_METHOD+'Login'], this);

		if (loginFn){
			return loginFn(credentials);
		} else {
			throw new Error('ERROR: Unknown Authentication method "' + config.AUTH_METHOD +'"');
		}
	};

	return Auth;

});