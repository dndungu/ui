"use strict";
gereji.extend("view", {
	init: function(){
		this.store = {
			data: {},
			template: {},
			stage: {},
			xslt: new gereji.xslt()
		};
		return this;
	},
	ready: function(){
		return (this.store.template.ready() && this.store.data.ready());
	},
	data: function(){
		this.store.data = arguments[0];
		var that = this;
		this.store.data.broker.on("update", function(){
			that.render(arguments[0]);
		});
		return this;
	},
	template: function(){
		this.store.template = arguments[0];
		var that = this;
		this.store.template.broker.on("update", function(){
			that.render(arguments[0]);
		});
		return this;
	},
	stage: function(){
		this.store.stage = arguments[0];
		return this;
	},
	render: function(){
		var data = this.store.data.find();
		if(!data || !this.ready())
			return this;
		this.store.template.transform(data);
		this.store.stage.innerHTML = "";
		console.log(this.store.template.getHTML());
//		this.store.stage.appendChild(this.store.template.getHTML());
		return this;
	}
});
