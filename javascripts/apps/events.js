"use strict";
gereji.apps.register('events', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			for(var i in app.events){
				var ev = 'on' + app.events[i];
				document[ev] = function(){
					app.fire.apply(app, arguments);
				}
			}
			window.onresize = function(){
				sandbox.emit({type: "window:resize", data: arguments[0]});
			};
		},
		fire: function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;
			if(target.className.indexOf("bubble-up") != -1)
				return target.parentNode[event.type] && target.parentNode[event.type]();
			var cls = target.className.split(' ');
			var tagName = target.tagName.toLowerCase();
			var data = {target: target, event: event};
			sandbox.emit({type: tagName + ':' + event.type, data: data});
			target.id && sandbox.emit({type: '#' + target.id + ':' + event.type, data: data});
			for(var i in cls){
				var type = '.' + cls[i] + ':' + event.type;
				sandbox.emit({type: type, data: data});
			}
		},
		events: [
			'load',
			'change',
			'resize',
			'submit',
			'drag',
			'dragstart',
			'dragenter',
			'dragleave',
			'dragover',
			'dragend',
			'drop',
			'mousedown',
			'mouseup',
			'mousemove',
			'mouseover',
			'mouseout',
			'click',
			'dblclick',
			'keyup',
			'keydown',
			'keypress'
		]
	}
});
