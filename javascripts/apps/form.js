"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on([".dashboard-add-new:click"], app.add);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['form:submit'], app.submit);
			return this;
		},
		add: function(){
			var button = (new gereji.dom()).setElement(arguments[0].data.target).findParentTag("button").getElements()[0];
			app.stage({
				_id: (new gereji.storage()).uuid(),
				name: button.getAttribute("name"),
				type: button.getAttribute("type"),
				stage: button.getAttribute("stage"),
				about: button.getAttribute("about") 
			});
		},
		stage: function(){
			var args = arguments[0];
			var view = (new gereji.view()).init();
			view.template((new gereji.xslt()).init(args.type, args.name));
			view.stage(document.getElementById(args.stage));
			var model = app.model({about: args.about, name: args.name, _id : args._id});
			view.data(model);
			view.render();
			setTimeout(function(){
				sandbox.emit({type: "body:change", data: {}});
			}, 1200);
		},
		model: function(){
			var args = arguments[0];
			var model = (new gereji.model());
			model.init();
			model.meta("about", args.about);
			model.meta("name", args.name);
			model.set("_id", args._id);
			var type = "model." + args.name + ":create";
			sandbox.emit({type: type, data: model});
			return model;
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
			var inputs = target.getElementsByTagName("input");
			for(var i=0; i < inputs.length; i++){
				if(inputs[i].name == '_id')
					return inputs[i].value;
			}
			return undefined;
		},
		submit: function(){
			var target = arguments[0].data.target;
			var event = arguments[0].data.event;
			var about = target.getAttribute('about');
			if(!about)
				return this;
			event.preventDefault();
			var _id = app.findId(target);
			var name = target.getAttribute("name");
			var model = sandbox.models[_id];
			if(!_id)
				app.createIdInput(target);
			if(!model)
				model = app.model({about: about, form: target, _id : _id, name: name});
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
		}
	};
});
