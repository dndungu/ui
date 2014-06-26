"use script";
gereji.apps.register("dashboard", function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on("body:load", app.resize);
			sandbox.on("body:load", function(){
				window.onresize = app.resize;
			});
			sandbox.on([".dashboard-nav:mousedown", ".dashboard-nav:click"], app.navigate);
		},
		resize: function(){
			app.header = document.getElementsByTagName("header")[0];
			app.header.style.height = String(window.innerHeight) + "px";
		},
		navigate: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
			var target = arguments[0].data.target;
			var anchors = app.header.getElementsByTagName("a");
			for(var i = 0; i < anchors.length; i++){
				anchors[i].className = anchors[i].className.replace(/current/, "").replace("  ", " ");
			}
			app.moveCursor(event, target);
			var type = target.getAttribute("type") + ":stage";
			var data = {};
			data.href = target.getAttribute("href");
			data.about = target.getAttribute("about");
			data.name = target.getAttribute("name");
			data.target = target.getAttribute("target");
			if(data.href && data.about && data.name)
				sandbox.emit({type: type, data: data});
		},
		moveCursor: function(event, target){
			if(target.className.indexOf("openclose") == -1)
				return (target.className += " current");
			var subject = target.parentNode.getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0];
			subject.click();
		}
	}
});
