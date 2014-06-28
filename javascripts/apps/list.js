"use strict";
gereji.apps.register('list', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on("list:stage", app.stage);
			sandbox.on(".list-select-all:mousedown", app.select);
		},
		stage: function(){
			var args = arguments[0].data;
			var name = args.name;
			var view = args.type + "-" + name;
			sandbox.collections[name] = sandbox.collections.hasOwnProperty(name) ? sandbox.collections[name] : app.collection(args);
			args.collection = sandbox.collections[name];
			sandbox.views[view] = sandbox.views[view] ? sandbox.views[view] : app.view(args);
			sandbox.views[view].render();
		},
		select: function(){
			var target = arguments[0].data.target;
			var checkboxes = document.getElementsByTagName("input");
			for(var i = 0; i < checkboxes.length ; i++){
				var checkbox = checkboxes[i];
				if(checkbox.className.indexOf("list-select-row") != -1)
					checkbox.checked = !target.checked;
			}
		},
		view: function(){
			var args = arguments[0];
			var view = new gereji.view();
			view.init();
			view.stage(document.getElementById(args.target));
			view.data(args.collection);
			var xslt = new gereji.xslt();
			xslt.init(args.type, args.name);
			view.template(xslt);
			return view;
		},
		collection: function(){
			var args = arguments[0];
			var collection = new gereji.collection();
			collection.init({meta: {name: args.name, about: args.about}});
			return collection;
		}
	}
});
