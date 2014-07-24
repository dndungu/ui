"use strict";
gereji.view.extend("form", {
    init: function(options){
		this.options = options;
        this.initStore();
        this.initBroker();
        this.initStage();
        this.initTemplate();
		this.initModel();
		this.attachEvents();
		this.activate();
		return this;
	},
	initModel: function(){
		this.store.source = new gereji.model();
		this.store.source.init();
		this.store.source.meta("about", this.options.about);
		this.store.source.meta("name", this.options.name);
		if(this.options.data)
			this.store.source.store.data = this.options.data;
		return this;
	},
	getModel: function(){
		return this.store.source;
	},
	attachEvents: function(){
		var that = this;
        this.store.template.broker.on(["ready", "update"], function(){
            that.render();
        });
	},
	activate: function(){
        var template = this.store.template;
        if(!template.ready())
            template.fetch();
	},
	render: function(){
		if(!this.store.template.ready())
			return this;
        var data = this.store.source.find();
        this.store.template.transform(data);
        this.store.stage.innerHTML = "";
		var html = this.store.template.getHTML();
        this.store.stage.appendChild(html);
		this.options.sandbox.emit({type: "body:change", data: this.store.stage});
		var type = this.options.name + "-form:render";
		this.options.sandbox.emit({type: type, data: this.options.data});
        return this;		
	}
});
