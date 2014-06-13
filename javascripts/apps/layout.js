"use strict";
os.register('layout', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			this.fill();
			sandbox.on('body:resize', this.fill);
		},
		fill: function(){
			var main = document.querySelector('main.fill-vertical');
			if(!main)
				return;
			var height = window.innerHeight - document.getElementsByTagName('header')[0].clientHeight - document.getElementsByTagName('footer')[0].clientHeight;
			var padding = (height - document.getElementsByTagName('main')[0].clientHeight) / 2;
			main.style.padding = padding + 'px 0';
		}
	};
});
