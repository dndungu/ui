"use strict";
os.register('activate', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('#activate-domain:sync', app.showSignIn);
		},
		showSignIn: function(){
			console.log(arguments[0]);
		}
	};
});
