"use strict";
gereji.apps.register('activate', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on('#activate_domain:sync', app.showSignIn);
			sandbox.on('body:load', this.fill);
			sandbox.on('body:load', this.lock);
		},
		showSignIn: function(){
			var target = arguments[0].data;
			var transition = new gereji.transition();
			transition.duration(900).direction("left").slide(target.parentNode.parentNode);
		},
        fill: function(){
            var main = document.getElementsByTagName('main')[0];
            if(!main || main.className.indexOf('fill-vertical') == -1)
                return;
            var height = window.innerHeight - document.getElementsByTagName('header')[0].clientHeight - document.getElementsByTagName('footer')[0].clientHeight;
            var padding = (height - main.clientHeight) / 2;
            main.style.padding = padding + 'px 0';
            main.style.height = main.clientHeight + 'px';
        },
        lock: function(){
            var divs = document.querySelectorAll('.wizard-item-content');
			var width = String(divs[0].clientWidth) + 'px';
			var height = String(divs[0].clientHeight) + 'px';
			for(var i = 0; i < divs.length; i++){
				divs[i].style.width = width;
				divs[i].style.height = height;
			}
        }
	};
});
