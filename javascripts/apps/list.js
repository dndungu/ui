"use strict";
gereji.apps.register('list', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on("list:stage", app.stage);
			sandbox.on(".list-select-all:change", app.select);
			sandbox.on([".list-select-row:change", ".list-select-all:change"], app.toggleButtons);
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
			var checkboxes = (new gereji.selector()).findTag("input").findClass("list-select-row").getElements();
			for(var i = 0; i < checkboxes.length ; i++){
				checkboxes[i].checked = target.checked;
			}
		},
		toggleButtons: function(){
			var checkboxes = (new gereji.selector()).findTag("input").findClass("list-select-row").getElements();
			for(var i = 0; i < checkboxes.length ; i++){
				if(checkboxes[i].checked)
					return app.showButtons();
			}
			app.hideButtons();
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
		},
		showButtons: function(){
			var button = app.getButtons();
			app.positionButtons(button);
			button.style.display = "block";
		},
		hideButtons: function(){
			app.getButtons().style.display = "none";
		},
		positionButtons: function(button){
			var selectAll = (new gereji.selector()).findTag("input").findClass("list-select-all").getElements()[0];
			var rect = selectAll.getBoundingClientRect();
			var width = ((selectAll.parentNode.clientWidth / window.innerWidth) * 100) + 2;
			button.style.top = String(rect.top - 7) + "px";
			button.style.left = width + "%";
		},
		getButtons: function(){
			return (new gereji.selector()).findTag("select").findClass("bulk-buttons").getElements()[0];
		}
	}
});
