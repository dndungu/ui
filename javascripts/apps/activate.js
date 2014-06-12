"use strict";
os.register('activate', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('#activate-domain:submit', app.domain);
		},
		domain: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
			var target = arguments[0].data.target;
			console.log(target);
		}
	};
});
