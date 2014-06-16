"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['input:keyup', 'textarea:keyup', 'select:change'], app.save);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['form:submit'], app.submit);
			sandbox.models = {};
		},
		save: function(){
			var target = arguments[0].data.target;
			var property = target.getAttribute('property');
			var about = target.getAttribute('about');
			var form = app.findForm(target);
			var _id = app.findId(form);
			if(!property || !form || arguments[0].data.event.keyCode == 13)
				return;
			if(!_id || !sandbox.validator.test('uuid', _id))
				_id = sandbox.storage.uuiid();
			if(!sandbox.models[_id])
				sandbox.models[_id] = (new gereji.model()).meta("about", about).set("name", form.name).set("_id", _id);
			sandbox.models[_id].set(property, target.value);
			var type = "model." + sandbox.models[_id].get("name") + ":change";
			sandbox.emit({type: type, data: sandbox.models[_id]});
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
			arguments[0].data.event.preventDefault();
			var model = sandbox.models[(app.findId(target))];
			var inputs = target.getElementsByTagName("input");
			for(var i = 0; i < inputs.length; i++){
				if(!app.validate({data: {target : input[i]}}))
					return;
				model.set(inputs[i].getAttribute("property"), inputs[i].value);
			}
			var textareas = target.getElementsByTagName("textarea");
			for(var i = 0; i < textareas.length; i++){
				if(!app.validate({data: {target : textareas[i]}}))
					return;
				model.set(textareas[i].getAttribute("property"), textareas[i].value);
			}
			var selects = target.getElementsByTagName("select");
			for(var i = 0; i < selects.length; i++){
				if(!app.validate({data: {target : selects[i]}}))
					return;
				model.set(selects[i].getAttribute("property"), selects[i].value);
			}
			model.sync(target);
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
				test || app.setValue("", target);
				!test && target.className.indexOf("required") != -1 && (valid = false);
			}
			return valid;
		},
		setValue: function(value, target){
			target.value = value;
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
