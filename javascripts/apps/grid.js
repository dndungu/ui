"use strict";
gereji.apps.register('grid', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on("grid:stage", app.stage);
		},
		stage: function(args){
			var name = arguments[0].data.name;
			var about = arguments[0].data.about;
			var target = arguments[0].data.target;
			var type = arguments[0].data.type;
			var view = type + "-" + name;
			sandbox.collections[name] = sandbox.collections.hasOwnProperty(name) ? sandbox.collections[name] : app.createCollection({name: name, about: about});
			sandbox.views[view] = sandbox.views[view] ? sandbox.views[view] : app.createView(name, sandbox.collections[name], target);
			sandbox.views[view].render();
		},
		createView: function(name, collection, target){
			var view = new gereji.view();
			view.init();
			view.stage(document.getElementById(target));
			view.data(collection);
			var xslt = new gereji.xslt();
			xslt.init(name);
			view.template(xslt);
			return view;
		},
		createCollection: function(){
			var name = arguments[0].name;
			var about = arguments[0].about;
			var collection = new gereji.collection();
			collection.init({meta: {name: name, about:about}});
			return collection;
		}
	}
});
