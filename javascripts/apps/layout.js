"use strict";
gereji.apps.register('layout', function(sandbox){
	return {
		init: function(){
			sandbox.on(["body:load"], this.vertical);
		},
		vertical: function(){
			var main = (new gereji.dom()).findTag("main").findClass("fill-vertical");
			if(!main.getElements().length)
				return;
			var header = (new gereji.dom()).findTag("header");
			var headerHeight = header.getElements().length ? header.getElements()[0].offsetHeight : 0;
			var footer = (new gereji.dom()).findTag("footer");
			var footerHeight = footer.getElements().length ? footer.getElements()[0].offsetHeight : 0;
			var space = window.innerHeight - headerHeight - footerHeight - main.getElements()[0].offsetHeight;
			var padding = String(Math.floor(space / 2.4)) + "px 0 " + String(Math.floor(space / 1.6) - 16) + "px";
			main.css({padding: padding});
		}
	};
});
