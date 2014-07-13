"use script";
gereji.apps.register("dashboard", function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			app.header = document.getElementsByTagName("header")[0];
			app.main = document.getElementsByTagName("main")[0];
			app.primary = document.getElementById("primary");
			app.secondary = document.getElementById("secondary");
			sandbox.on(["body:load", "window:resize"], app.resize);
			sandbox.on([".dashboard-nav:mousedown"], app.clear);
			sandbox.on([".dashboard-nav:mousedown"], app.navigate);
			sandbox.on([".dashboard-nav:mousedown"], app.stage);
			sandbox.on([".dashboard-nav:click"], app.brake);
			sandbox.on([".dashboard-add-new:click"], app.toggleMode);
		},
		kill: function(){
		},
		resize: function(){
			var height = app.main.offsetHeight - app.main.getElementsByTagName("section")[0].offsetHeight;
			app.main.getElementsByTagName("section")[1].style.height = height + "px";
		},
		clear: function(){
			var target = arguments[0].data.target;
			var anchors = app.header.getElementsByTagName("a");
			for(var i = 0; i < anchors.length; i++){
				anchors[i].className = anchors[i].className.replace(/current/, "").replace("  ", " ");
			}
		},
		navigate: function(){
			var target = arguments[0].data.target;
			if(target.className.indexOf("openclose") == -1)
				return (target.className += " current");
			var subject = target.parentNode.getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0];
			app.stage({data: {target: subject}});
			app.navigate({data: {target: subject}});
		},
		stage: function(){
			var target = arguments[0].data.target;
            var data = {};
            data.type = target.getAttribute("type");
            data.href = target.getAttribute("href");
            data.about = target.getAttribute("about");
            data.name = target.getAttribute("name");
            data.target = target.getAttribute("target");
            if(data.href && data.about && data.name)
                sandbox.emit({type: (data.type + ":stage"), data: data});
		},
		brake: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
		},
		toggleMode: function(){
            var target = arguments[0].data.target;
            var button = (new gereji.dom()).setElement(target).getElements()[0];
            var className = button && button.getAttribute("mode") ? button.getAttribute("mode") : "split-mode";
			(new gereji.dom()).findTag("main").removeClass(["primary-mode", "split-mode", "secondary-mode"]).addClass(className);
		}
	}
});
