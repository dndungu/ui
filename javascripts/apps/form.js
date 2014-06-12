"use strict";
os.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('form:change', app.change);
		},
		change: function(){
			console.log(arguments);
		}
	};
});
