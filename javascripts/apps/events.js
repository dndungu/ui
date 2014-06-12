"use strict";
os.register('events', function(sandbox){
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
		},
		fire: function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;
			var cls = target.className.split(' ');
			var tagName = target.tagName.toLowerCase();
			var data = {target: target, event: event};
			sandbox.emit({type: tagName + ':' + event.type, data: data});
			target.id && sandbox.emit({type: '#' + target.id + ':' + event.type, data: data});
			for(var i in cls){
				sandbox.emit({type: '.' + cls[i] + ':' + event.type, data: data});
			}
		},
		events: [
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
