"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['input:keyup', 'textarea:keyup', 'select:change'], app.save);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['form:submit'], app.submit);
			return this;
		},
		save: function(){
			var target = arguments[0].data.target;
			var property = target.getAttribute('property');
			var form = app.findForm(target);
			var _id = app.findId(form);
			var about = form.getAttribute('about');
			if(!property || !form || arguments[0].data.event.keyCode == 13)
				return;
			if(!_id || !sandbox.validator.test('uuid', _id))
				_id = app.createIdInput(form);
			sandbox.models[_id] = sandbox.models.hasOwnProperty(_id) ? sandbox.models[_id] : app.createModel({about: about, form: form, _id : _id});
			sandbox.models[_id].set(property, target.value);
			sandbox.models[_id].broker.emit({type: "change", data: {property: target.value}});
		},
		createModel: function(){
			var args = arguments[0];
			var model = (new gereji.model());
			model.init();
			model.meta("about", args.about);
			model.meta("name", args.form.getAttribute("name"));
			model.set("_id", args._id);
			var type = "model." + args.form.name + ":create";
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
		findForm: function(target){
			var tag = target.tagName.toLowerCase();
			if(tag == 'form')
				return target;
			if(tag == 'body')
				return null;
			return app.findForm(target.parentNode);
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
			var about = target.getAttribute('about');
			if(!about)
				return;
			var _id = app.findId(target);
			arguments[0].data.event.preventDefault();
			var model =  sandbox.models[_id] ? sandbox.models[_id] : app.createModel({about: about, form: target, _id : _id});
			if(!(app.parse("input", target, model) && app.parse("textarea", target, model) && app.parse("select", target, model)))
				return;
			model.sync();
			return this;
		},
		parse: function(tagName, target, model){
			var elements = target.getElementsByTagName(tagName);
			for(var i = 0; i < elements.length; i++){
				if(!app.validate({data: {target : elements[i]}}))
					return false;
				var property = elements[i].getAttribute("property");
				property && model.set(property, elements[i].value);
			}
			return true;
		},
		validate: function(){
			var target = arguments[0].data.target;
			var tagName = target.tagName.toLowerCase();
			var value = target.value;
			var cls = target.className.split(' ');
			app.removeClass(['invalid-input', 'valid-input'], target);
			var valid = true;
			for(var i in cls){
				var test = sandbox.validator.test(cls[i], value);
				app.addClass((test ? " valid-input" : " invalid-input"), target);
				if(test)
					continue;
				target.value = "";
				if(target.className.indexOf("required") != -1)
					valid = false;
			}
			return valid;
		},
		addClass: function(cls, target){
			cls = cls instanceof Array ? cls : [cls];
			for(var i in cls){
				var cl = cls[i];
				target.className = (target.className.indexOf(cl) == -1) ? (target.className + " " + cl) : target.className;
			}
		},
		removeClass: function(cls, target){
			cls = cls instanceof Array ? cls : [cls];
			for(var i in cls){
				target.className = target.className.replace(cls[i], "").replace("  ", " ");
			}
		}
	};
});
