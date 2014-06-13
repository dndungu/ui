"use strict";
os.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['input:keyup', 'textarea:keyup', 'select:change'], app.save);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['form:submit'], app.submit);
		},
		save: function(){
			var target = arguments[0].data.target;
			var property = target.getAttribute('property');
			var targetForm = app.findForm(target);
			if(!property || !targetForm || !targetForm.id)
				return;
			var id = targetForm.id;
			var key = (property.indexOf('[') == -1) ? null : property.match(/\[(.*)\]/)[1];
			var name = property.replace(/\[(.*)\]/, '');
			var forms = sandbox.storage.get('forms');
			forms[id] = forms[id] ? forms[id] : {};
			key ? eval("forms." + id + "." + name + " = {"+ key + " : \"" + target.value + "\"}") : eval("forms." + id + "." + name + ' = "' + target.value + '"');
			sandbox.storage.set("forms", forms)	
		},
		findForm: function(target){
			var tag = target.tagName.toLowerCase();
			if(tag == 'form')
				return target;
			if(tag == 'body')
				return null;
			return app.findForm(target.parentNode);
		},
		submit: function(){
			var target = arguments[0].data.target;
			var event = arguments[0].data.event;
			event.preventDefault();
			var inputs = target.getElementsByTagName("input");
			var textareas = target.getElementsByTagName("textarea");
			var selects = target.getElementsByTagName("select");
			var valid = true;
			for(var i = 0; i < inputs.length; i++){
				app.validate({data: {target : inputs[i]}}) || (valid = false);
			}
			valid && app.sync(target);
		},
		sync: function(target){
			var url = target.getAttribute("about");
			var id = app.findForm(target).id;
			var forms = sandbox.storage.get("forms");
			sandbox.sync.post(url, JSON.stringify(forms[id]), function(response){
				console.log(response);
				var type = "#" + id + ":data";
				sandbox.emit({type: type, data: response});
				forms[id] = {};
				sandbox.storage.set("forms", forms);
			});
			var type = "#" + id + ":sync";
			sandbox.emit({type: type, data: target});
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
