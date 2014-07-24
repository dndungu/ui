"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			app.views = {};
			sandbox.on([".add-item:click"], app.render);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['form:submit'], app.submit);
			sandbox.on([".select-add:change"], app.selectAdd);
			return this;
		},
        render: function(){
            var options = {};
			var target = arguments[0].data.target;
			options.sandbox = sandbox;
			options._id = target.getAttribute("_id");
			options.type = "form";
            options.about = target.getAttribute("about");
            options.name = target.getAttribute("name");
            options.stage = target.getAttribute("stage");
            if(!options.about || !options.name)
                return;
            app.findOrCreate(options).render();
        },
		findOrCreate: function(options){
			if(!options._id)
				options._id = ((new gereji.storage()).uuid());
			if(!app.views[options._id])
                app.views[options._id] = (new gereji.view.form()).init(options);
			return app.views[options._id];
		},
		createIdInput: function(form){
			var _id = (new gereji.storage()).uuid();
			var input = document.createElement("input");
			input.name = "_id";
			input.value = _id;
			input.setAttribute("type", "hidden");
			input.setAttribute("property", "_id");
			form.appendChild(input);
			return _id;
		},
		findId: function(target){
			var elements = (new gereji.dom()).setElement(target).findTag("*");
			for(var i = 0; i < elements.length; i++){
				if(elements[i].name == "_id")
					return elements[i].value;
			}
			return undefined;
		},
		submit: function(){
			var target = arguments[0].data.target;
			var options = {};
			options.type = "form";
			options.about = target.getAttribute('about');
			options.name = target.getAttribute("name");
			if(!options.about || !options.name)
				return this;
			arguments[0].data.event.preventDefault();
			options._id = app.findId(target);
			if(!options._id)
				options._id = app.createIdInput(target);
			var model;
			if(app.views[options._id])
				model = app.views[options._id].getModel();
			if(!model)
				 model = (new gereji.model()).init().meta("about", options.about).meta("name", options.name);
			if(!app.parse(["input", "textarea", "select"], target, model))
				return this;
			model.sync();
			return this;
		},
		parse: function(tags, target, model){
			for(var i in tags){
				var tagName = tags[i];
				var elements = target.getElementsByTagName(tagName);
				for(var i = 0; i < elements.length; i++){
					if(!app.validate({data: {target : elements[i]}}))
						return false;
					var property = elements[i].getAttribute("property");
					property && model.set(property, elements[i].value);
				}
			}
			return true;
		},
		validate: function(){
			var target = arguments[0].data.target;
			var tagName = target.tagName.toLowerCase();
			var value = target.value;
			var cls = target.className.split(' ');
			(new gereji.dom()).setElement(target).removeClass('invalid-input');
			var valid = true;
			for(var i in cls){
				var test = sandbox.validator.test(cls[i], value);
				test || (new gereji.dom()).setElement(target).addClass(" invalid-input");
				if(test)
					continue;
				target.value = "";
				if(target.className.indexOf("required") != -1)
					valid = false;
			}
			return valid;
		},
		selectAdd: function(){
			var target = arguments[0].data.target;
			if(target.value != "add-new")
				return;
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("size", "32");
			input.setAttribute("style", "width:100%;");
			input.setAttribute("name", target.getAttribute("name"));
			input.setAttribute("about", target.getAttribute("about"));
			target.parentNode.insertBefore(input,target);
			target.remove();
			input.focus();
		}
	};
});
