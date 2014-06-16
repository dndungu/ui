"use strict";
gereji.apps.register('form', function(sandbox){
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
			if(!property || !targetForm || !targetForm.id || arguments[0].data.event.keyCode == 13)
				return;
			var id = targetForm.id;
			var key = (property.indexOf('[') == -1) ? null : property.match(/\[(.*)\]/)[1];
			var name = property.replace(/\[(.*)\]/, '');
			var forms = sandbox.storage.get('forms');
			forms[id] = forms[id] ? forms[id] : {};
			app.inject(target.value, name, forms[id], key);
			sandbox.storage.set("forms", forms)	
		},
		inject: function(value, name, obj, key){
			var n = name.match(/\./g);
			n = n ? n.length : 0;
			var levels = name.split('.');
			var i = 0;
			var path = 'obj.' + levels[0];
			while(i++ < n){
				eval(path + " = " + path + " ? " + path + " : {}");
				path += "." + levels[i]; 
			}
			key || eval(path + ' = "' + value + '"');
			key && eval(path + " = " + path + " instanceof Array ? " + path + " : []");
			key && eval(path + '[' + key + '] = "' + value + '"');
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
			var valid = true;
			var inputs = target.getElementsByTagName("input");
			for(var i = 0; i < inputs.length; i++){
				app.validate({data: {target : inputs[i]}}) || (valid = false);
			}
			var textareas = target.getElementsByTagName("textarea");
			for(var i = 0; i < textareas.length; i++){
				app.validate({data: {target : textareas[i]}}) || (valid = false);
			}
			var selects = target.getElementsByTagName("select");
			for(var i = 0; i < selects.length; i++){
				app.validate({data: {target : selects[i]}}) || (valid = false);
			}
			valid && app.sync(target);
		},
		sync: function(target){
			var url = target.getAttribute("about");
			var id = app.findForm(target).id;
			var forms = sandbox.storage.get("forms");
			sandbox.sync.post(url, JSON.stringify(forms[id]), function(response){
				var type = "#" + id + ":data";
				sandbox.emit({type: type, data: response});
				delete forms[id];
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
