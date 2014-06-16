"use strict";
gereji.extend("model", {
	meta: {},
	data: {}
	init: function(){
		return this;
	},
	meta: function(){
		var key = arguments[0] ? arguments[0] : undefined;
		var value = arguments[1] ? arguments[1] : undefined;
		if(value != undefined)
			this.meta[key] = value;
		if(key != undefined && value == undefined)
			return this.meta[key] ? this.meta[key] : undefined;
		return this;
	},
	set: function(key, value){
		var test = 'this.data';
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
		var test = 'this.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		var value = undefined;
		for(var i in path){
			test += "." + path[i];
			value = eval(test) === undefined ?  undefined : (index ? eval(test + "[" + index + "]") : eval(test));
		}
		return value;
	},
	sync: function(then){
		var url = this.meta("about");
		var name = this.meta("name");
		sandbox.sync.post(url, this.data, function(response){
			var type = "model." + name + ":data";
			then({type: type, data: response});
		});
		var type = "model." + name + ":sync";
		then({type: type, data: this});
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	}
});
