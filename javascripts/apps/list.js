"use strict";
gereji.apps.register('list', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on(["list:stage", "chart:stage"], app.stage);
			sandbox.on([".list-select-all:change", ".list-select-row:change"], app.toggleButtons);
			sandbox.on([".list-select-all:change"], app.toggleSelectors);
			sandbox.on([".list-select-row:change"], app.toggleBulkSelector);
		},
		stage: function(){
			var args = arguments[0].data;
			var name = args.name;
			var view = args.type + "-" + name;
			sandbox.collections[name] = sandbox.collections.hasOwnProperty(name) ? sandbox.collections[name] : app.createCollection(args);
			args.collection = sandbox.collections[name];
			sandbox.views[view] = sandbox.views[view] ? sandbox.views[view] : app.createView(args);
			sandbox.views[view].render();
		},
		createView: function(){
			var args = arguments[0];
			var view = new gereji.view();
			view.init();
			view.stage(document.getElementById(args.stage));
			view.data(args.collection);
			var xslt = new gereji.xslt();
			xslt.init(args.type, args.name);
			view.template(xslt);
			return view;
		},
		createCollection: function(){
			var args = arguments[0];
			var collection = new gereji.collection();
			collection.init({meta: {name: args.name, about: args.about}});
			return collection;
		},
		toggleSelectors: function(){
			var target = arguments[0].data.target;
			var checkboxes = app.getSelectors(target);
			for(var i = 0; i < checkboxes.length ; i++){
				checkboxes[i].checked = target.checked;
			}
		},
		toggleBulkSelector: function(){
			var target = arguments[0].data.target;
			var checkboxes = app.getSelectors(target);
			var n = 0;
			for(var i = 0; i < checkboxes.length ; i++){
				if(checkboxes[i].checked)
					n++;
			}
			app.getBulkSelector(target).checked = !!n;
		},
		toggleButtons: function(){
			var target = arguments[0].data.target;
			setTimeout(function(){
				var button = (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("select").findClass("bulk-buttons").getElements()[0];
				if(!button)
					return this;
				var checkboxes = app.getSelectors(target);
				for(var i = 0; i < checkboxes.length ; i++){
					if(checkboxes[i].checked)
						return button.style.display = "block";
				}
				button.style.display = "none";
			}, 600);
			return this;
		},
		getSelectors: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-row").getElements();
		},
		getBulkSelector: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-all").getElements()[0];
		}
	}
});
