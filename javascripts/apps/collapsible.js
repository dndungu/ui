"use strict";
gereji.apps.register('collapsible', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(["body:load", "body:change"], app.close);
			sandbox.on([".collapsible-single-openclose:click"], app.toggle)
			sandbox.on([".collapsible-openclose:mousedown"], app.dance);
		},
		close: function(){
			var tags = (new gereji.dom()).findTag("*").findClass("collapsible-single").getElements();
			if(!tags.length)
				return;
			for(var i = 0; i < tags.length; i++){
				var tag = (new gereji.dom()).setElement(tags[i]);
				tag.attribute("collapsible-height") || tag.attribute("collapsible-height", tags[i].clientHeight);
				tag.addClass("collapsible-single-closed");
			}
		},
		toggle: function(){
			var target = (new gereji.dom()).setElement(arguments[0].data.target.parentNode);
			if(!target.hasClass("collapsible-single-closed"))
				return target.css("collapsible-height", "auto").addClass("collapsible-single-closed");
			var height = target.attribute("collapsible-height") + "px";
			target.css("height", height).removeClass("collapsible-single-closed");
		},
		dance: function(){
			var target = (new gereji.dom()).setElement(arguments[0].data.target);
			target.attribute("target") ? target.findParentTag(target.attribute("target")) : target.setElement(arguments[0].data.target.parentNode);
			var open = target.hasClass("collapsible-open");
			(new gereji.dom()).setElements(target.getElements()[0].parentNode)
			.findClass("collapsible")
			.removeClass("collapsible-open");
			open ? target.removeClass("collapsible-open") : target.addClass("collapsible-open");
		},
		findCollapsible: function(target){
			if(target.className.indexOf('collapsible') != -1)
				return target;
			var parent = target.parentNode;
			if(parent.className.indexOf('collapsible') != -1)
				return parent;
			return app.findCollapsible(parent);
		}
	}
});
