"use strict";
gereji.extend('dom', {
	init: function(){
		for(var i in this.events){
			var ev = 'on' + this.events[i];
			document[ev] = this.fire;
		}
	},
	fire: function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		var classes = target.className.split(' ');
		console.log(event.type); 
	},
	events: [
		'mousedown',
		'mouseup',
		'mousemove',
		'mouseover',
		'mouseout',
		'dblclick',
		'keyup',
		'keydown',
		'keypress'
	]
});
