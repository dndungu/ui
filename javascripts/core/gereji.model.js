"use strict";
gereji.extend("model", {
	store: {
		meta: {},
		data: {}
	},
	init: function(){
		this.broker = new gereji.broker();
		this.ajax = new gereji.sync();
		this.ajax.init();
		return this;
	},
	meta: function(){
		var key = arguments[0] ? arguments[0] : undefined;
		var value = arguments[1] ? arguments[1] : undefined;
		if(value != undefined)
			this.store.meta[key] = value;
		if(key != undefined && value == undefined)
			return this.store.meta[key] ? this.store.meta[key] : undefined;
		return this;
	},
	set: function(key, value){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		for(var i in path){
			test += "." + path[i];
			eval(test + " = " + test + " ? " + test + " : {}");
		}
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		index || eval(test + ' = "' + value + '"');
		index && eval(test + " = " + test + " instanceof Array ? " + test + " : []");
		index && eval(test + '[' + index + '] = "' + value + '"');
		return this;
	},
	get: function(key){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		var value = undefined;
		for(var i in path){
			test += "." + path[i];
			value = eval(test) === undefined ?  undefined : (index ? eval(test + "[" + index + "]") : eval(test));
		}
		return value;
	},
	sync: function(){
		var url = this.meta("about");
		var name = this.meta("name");
		var that = this;
		this.ajax.post(url, JSON.stringify(this.store.data), function(response){
			that.broker.emit({type: "sync", data: response});
		});
		this.broker.emit({type: "submit", data: this.store.data});
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	}
});
