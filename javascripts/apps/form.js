"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			app.views = {};
			sandbox.on([".add-item:click"], app.render);
			sandbox.on(['input:change', 'textarea:change', 'select:change'], app.validate);
			sandbox.on(['input:change'], app.putFile);
			sandbox.on(['form:submit'], app.submit);
			sandbox.on([".select-add:change"], app.toggleTag);
			sandbox.on([".select-add:keyup"], app.revertTag);
			return this;
		},
        render: function(){
            var options = {};
			var target = arguments[0].data.target;
            options.about = target.getAttribute("about");
            options.name = target.getAttribute("name");
            if(!options.about || !options.name)
                return;
			options.sandbox = sandbox;
			options.type = "form";
            options.stage = target.getAttribute("stage");
			var view = new gereji.view.form();
			view.init(options);
			view.render();
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
			var event = arguments[0].data.event;
			var options = {};
			options.about = target.getAttribute('about');
			options.name = target.getAttribute("name");
			if(!options.about || !options.name)
				return this;
			options.type = "form";
			options.about = options.about.replace(/\/$/, "");
			event.preventDefault();
			var model = new gereji.model();
			model.init();
			model.meta("about", options.about);
			model.meta("name", options.name);
			if(!app.parse(["input", "textarea", "select"], target, model))
				return this;
			model.broker.on(["sync"], console.log);
			model.sync();
			return this;
		},
		parse: function(tags, target, model){
			for(var i in tags){
				var tagName = tags[i];
				var elements = target.getElementsByTagName(tagName);
				for(var i = 0; i < elements.length; i++){
					var property = elements[i].getAttribute("property");
					if(!property)
						continue;
					if(!app.validate({data: {target : elements[i]}}))
						return false;
					model.set(property, elements[i].value);
				}
			}
			return true;
		},
		validate: function(){
			var target = arguments[0].data.target;
			var element = (new gereji.dom()).setElement(target);
			element.removeClass('invalid-input');
			var cls = target.className.split(' ');
			for(var i in cls){
				if(sandbox.validator.test(cls[i], target.value))
					continue;
				target.focus();
				element.addClass(" invalid-input");
				if(target.tagName.toLowerCase() != 'select')
					target.value = "";
				if(element.hasClass("required"))
					return false;
			}
			return true;
		},
		putFile: function(){
			var target = arguments[0].data.target;
			if(target.getAttribute("type") != "file")
				return;
			var about = target.getAttribute("about");
			var mime = new gereji.mime();
			for(var i = 0; i < target.files.length; i++){
				var file = target.files.item(i);
				var fd = new FormData();
				fd.append(file.name, file);
				var sync = new gereji.sync();
				sync.init();
				sync.broker.on(["loadstart"], function(){
					app.putStart(target);
				});
				sync.broker.on(["progress"], function(){
					app.putProgress(target, arguments[0].data);
				});
				sync.broker.on(["loadend"], function(){
					app.putEnd(target, arguments[0].data);
				});
				sync.header("filename", file.name);
				console.log(file.type);
				sync.header("content-type", file.type);
				sync.put(about, fd, function(){
					console.log(arguments[0]);
				});
			}
		},
		putStart: function(target){
			(new gereji.dom())
			.setElement(target.parentNode.parentNode)
			.findChildrenTag("label")
			.findClass("placeholder")
			.css({display: "none"});
			var animation = (new gereji.dom())
			.setElement(target.parentNode.parentNode)
			.findChildrenTag("label")
			.findClass("animation")
			.css({display: "inline-block"});
		},
		putProgress: function(target, event){
            var animation = (new gereji.dom()).setElement(target.parentNode.parentNode).findChildrenTag("label").findClass("animation");
			var max = animation.getElements()[0].clientHeight;
			var progress = event.position / event.totalSize;
			var border = String(Math.ceil(progress * max)) + "px";
            animation.css({"border-bottom-width": border});
		},
		putEnd: function(target, event){
			var animation = (new gereji.dom()).setElement(target.parentNode.parentNode).findChildrenTag("label").findClass("animation");
			var max = animation.getElements()[0].offsetHeight;
			animation.css({"border-bottom-width": max + "px"});
		},
		toggleTag: function(){
			var target = arguments[0].data.target;
			if(target.tagName.toLowerCase() == "input"){
				if(!app.validate({data: {target: target}}))
					return
				var element = (new gereji.dom()).setElement(target).findNextSibling();
				var options = {};
				options.about = element.attribute("about");
				options.name = element.attribute("name");
				var model = new gereji.model();
				model.init();
				model.meta("about", options.about);
				model.meta("name", options.name);
				model.sync();
				var options = element.findChildrenTag("option").getElements();
				var lastOption = options[(options.length - 1)];
				var option = document.createElement("option");
				option.innerHTML = target.value;
				option.value = target.value;
				lastOption.parentNode.insertBefore(option, lastOption);
				lastOption.parentNode.value = target.value;
				app.revertTag({data: {event: {keyCode: 27}, target: target}});
				return;
			}
			if(target.value != "add-new")
				return;
			var element = document.createElement("input");
			app.copyAttributes(element, target);
			target.parentNode.insertBefore(element, target);
			target.style.display = "none";
			element.focus();
		},
		copyAttributes: function(element, target){
			var style = "width: " + target.clientWidth + "px;";
			element.setAttribute("style", style);
			element.setAttribute("name", target.getAttribute("name"));
			element.setAttribute("about", target.getAttribute("about"));
			element.setAttribute("placeholder", target.getAttribute("placeholder"));
			element.setAttribute("class", target.getAttribute("class"));
			return this;
		},
		revertTag: function(){
			var event = arguments[0].data.event;
			var target = arguments[0].data.target;
			if(target.tagName.toLowerCase() != "input" || event.keyCode != 27)
				return this;
			var element = (new gereji.dom()).setElement(target).findNextSibling();
			element.css({"display": "inline-block"});
			element.removeClass("invalid-input");
			target.remove();
		}
	};
});
