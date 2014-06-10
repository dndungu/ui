"use strict";
gereji.extend('dom', {
	init: function(broker){
		this.broker = broker;
		var that = this;
		for(var i in this.events){
			var ev = 'on' + this.events[i];
			document[ev] = function(){
				that.fire.apply(that, arguments);
			}
		}
	},
	fire: function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		var cls = target.className.split(' ');
		var tagName = target.tagName.toLowerCase();
		for(var i in cls){
			var data = {target: target, event: event};
			this.broker.emit({type: tagName + ':' + event.type, data: data});
			this.broker.emit({type: '.' + cls[i] + ':' + event.type, data: data});
			this.broker.emit({type: tagName + '.' + cls[i] + ':' + event.type, data: data});
		}
	},
	events: [
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
});
