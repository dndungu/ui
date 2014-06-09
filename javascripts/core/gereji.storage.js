"use strict";
gereji.extend('storage', {
	init: function(){
		this.scope = arguments[0] ? arguments[0] : 'gereji';
		this.localStorage = localStorage;
		this.localStorage.hasOwnProperty(this.scope) || this.localStorage.setItem(this.scope, "{}");
	},
	set: function(key, value){
		var store = this.getStore();
		store[key] = value;
		this.localStorage.setItem(this.scope, JSON.stringify(store));
	},
	get: function(key){
		var store = this.getStore();
		return store.hasOwnProperty(key) ? JSON.parse(store[key]) : null;
	},
	where: function(filters){
		var store = this.getStore();
		var matches = [];
		for(var i in store){
			
		}
	},
	getStore: function(){
		return this.localStorage.hasOwnProperty(this.scope) ? JSON.parse(this.localStorage.getItem(this.scope)) : {};
	}
});