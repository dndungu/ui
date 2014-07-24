"use script";
gereji.apps.register("dashboard", function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(["body:load", "window:resize"], app.resize);
			sandbox.on([".dashboard-nav:click"], app.navigate);
			sandbox.on([".dashboard-add-new:click", ".dashboard-nav:click", ".list-body-row:click", ".list-select-row:click"], app.toggle);
		},
		kill: function(){},
		resize: function(){
			var height = (new gereji.dom()).findTag("main").getElements()[0].offsetHeight;
			height = height - (new gereji.dom()).findTag("section").findClass("topbar").getElements()[0].offsetHeight;
			(new gereji.dom()).findTag("section").findClass("stage").css({"height": (height + "px")});
		},
		navigate: function(){
			arguments[0].data.event.preventDefault();
			(new gereji.dom()).findTag("header").findChildrenTag("a").removeClass("current");
			var target = (new gereji.dom()).setElement(arguments[0].data.target);
			if(!target.hasClass("openclose"))
				return target.addClass("current");
			var subject = target.findNextSibling().findChildrenTag("li").findChildrenTag("a");
			subject.addClass("current");
		},
		toggle: function(){
            var target = arguments[0].data.target;
			var mode = (new gereji.dom()).setElement(target).attribute("mode");
            var className = mode ? mode : "primary-mode";
			(new gereji.dom()).findTag("main").removeClass(["primary-mode", "split-mode", "secondary-mode"]).addClass(className);
		}
	}
});
