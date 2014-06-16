"use strict";
gereji.extend("model", {
	meta: {},
	data: {}
	init: function(){
		
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
	about: function(){
		if(arguments[0])
			this.meta["about"] = arguments[0];
		return this.meta["about"];
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	}
});
