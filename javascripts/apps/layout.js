"use strict";
os.register('layout', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('body:resize', function(){
				console.log(arguments[0]);
			});
		}
	};
});
