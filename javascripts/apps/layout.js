"use strict";
gereji.apps.register('layout', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('body:load', this.fill);
		},
		fill: function(){
			var main = document.getElementsByTagName('main')[0];
			if(!main || main.className.indexOf('fill-vertical') == -1)
				return;
			var height = window.innerHeight - document.getElementsByTagName('header')[0].clientHeight - document.getElementsByTagName('footer')[0].clientHeight;
			var padding = (height - main.clientHeight) / 2;
			main.style.padding = padding + 'px 0';
		},
		lock: function(){
			var divs = document.querySelectorAll('wizard-item-content');
		}
	};
});
