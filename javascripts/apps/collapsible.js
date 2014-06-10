"use strict";
gerejios.register('collapsible', function(sandbox){
	var module = null;
	return {
		init: function(){
			sandbox.broker.on(['.openclose:click'], this.openClose);
			module = this;
		},
		openClose: function(){
			var target = arguments[0].data.target;
			module.toggle(module.findCollapsible(target));
			var open = target.className.indexOf('fa-plus') == -1;
			target.className = open ? target.className.replace('fa-minus', 'fa-plus') : target.className.replace('fa-plus', 'fa-minus');
		},
		toggle: function(){
			var target = arguments[0];
			var siblings = target.parentNode.children;
			var i = siblings.length;
			var closed = target.className.indexOf('collapsible-open') == -1;
            while(i--){
                siblings[i].className = siblings[i].className.replace('collapsible-open', '');
            }
            target.className = closed ? target.className + ' collapsible-open' : target.className.replace('collapsible-open', '');			
		},
		findCollapsible: function(target){
			if(target.className.indexOf('collapsible') != -1)
				return target;
			var parent = target.parentNode;
			if(parent.className.indexOf('collapsible') != -1)
				return parent;
			return module.findCollapsible(parent);
		}
	}
});
