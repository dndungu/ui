"use strict";
gereji.apps.register('list', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			app.views = {};
			app.stage = {};
			sandbox.on([".list-items:click"], app.render);
			sandbox.on([".list-select-all:change", ".list-select-row:change"], app.toggleButtons);
			sandbox.on([".list-select-all:change"], app.toggleSelectors);
			sandbox.on([".list-select-row:change"], app.toggleBulkSelector);
			sandbox.on([".list-body-row:click", ".list-select-row:click"], app.renderEdit);
		},
        render: function(){
            var options = {};
			var target = arguments[0].data.target;
			options.sandbox = sandbox;
            options.type = target.getAttribute("type");
            options.about = target.getAttribute("about");
            options.name = target.getAttribute("name");
            options.stage = target.getAttribute("stage");
            if(!options.type || !options.name)
				return;
			if(!app.views.hasOwnProperty(options.name))
				app.views[options.name] = (new gereji.view[options.type]()).init(options);
			app.views[options.name].render();
			app.stage[options.stage] = app.views[options.name];
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
			}, 100);
			return this;
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
		renderEdit: function(){
			var target = arguments[0].data.target;
			var stage_id = (new gereji.dom()).setElement(target).findParentTag("section").getElements()[0].id;
			var options = new Object(app.stage[stage_id].options);
			options.stage = "secondary";
			options.type = "form";
			var _id = target.getAttribute("_id");
			var record = app.stage[stage_id].store.source.filter({_id : _id});
			options.data = {generic: {rest : [record]}};
			var view = (new gereji.view.form()).init(options)
			view.render();
		},
		getSelectors: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-row").getElements();
		},
		getBulkSelector: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-all").getElements()[0];
		}
	}
});
