"use strict";
gereji.extend("collection", {
	init: function(){
		this.store = {data: {}, meta: {}};
		if(arguments[0].meta)
			this.store.meta = arguments[0].meta;
		if(arguments[0].data)
			this.store.data = arguments[0].data;
		this.status = null;
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
        this.storage = new gereji.storage();
        this.storage.init();
		var collections = this.storage.get("collections");
		if(!collections.hasOwnProperty(this.store.meta.name))
			return this.fetch(this.store.meta.name);
		this.store.data = collections[this.store.meta.name];
		this.status = "ready";
		return this;
	},
	fetch: function(name){
		var that = this;
		this.ajax.get(this.store.meta.about, function(response){
			that.status = "ready";
			that.store.data = response;
			that.broker.emit({type: "update", data: that.store.data});
			var collections = that.storage.get("collections");
			collections[name] = that.store.data;
			that.storage.set("collections", collections);
		});
		return this;
	},
    ready: function(){
        return (this.status == "ready");
    },
    meta: function(){
        var key = arguments[0];
        var value = arguments[1];
        if(value != undefined)
            this.store.meta[key] = value;
        if(key != undefined && value == undefined)
            return this.store.meta[key] ? this.store.meta[key] : undefined;
        return this;
    },
	find: function(){
		return this.store.data;
	}
});
