"use strict"
gereji.extend('broker', {
		events: [],
		on : function() {
			var types = typeof arguments[0] == "string" ? [ arguments[0] ] : arguments[0];
			for ( var i in types) {
				var type = types[i];
				this.events = this.events ? this.events : {};
				this.events[type] = typeof this.events[type] == 'undefined' ? [] : this.events[type];
				this.events[type].push(arguments[1]);
			}
		},
		emit : function(_event) {
			_event = typeof _event == "string" ? {type : _event, data : {}} : _event;
			_event.data = typeof _event.data == "undefined" ? {} : _event.data;
			try{
				var listeners = this.events ? this.events[_event.type] : [];
				for(var i in listeners){
					typeof listeners[i] === 'function' && listeners[i](_event);
				}
			}catch(e){
				console && console.error(e);
			}
		}
});
