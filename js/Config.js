define(function () {

    var HOST = 'http://92.222.22.211',
        PORT = ':8090/';

    return {
        SERVICE_TO_ACCESS : 'http://myservice',
        CAS_SERVER: HOST + PORT + 'cas/v1/tickets',
        AUTH_METHOD : 'cas'
    }
});