"use strict";
gereji.apps.register('activate', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on("model.activate_domain:create", app.showSignIn);
			sandbox.on("model.activate_user:create", app.assign);
			sandbox.on('body:load', this.resize);
			sandbox.on('body:load', this.lock);
			sandbox.on("body:load", function(){
				app.alias = document.getElementById("alias");
				app.email = document.getElementById("email");
				app.alias.focus();
			});
		},
		showSignIn: function(event){
			app.siteModel = event.data;
			app.siteModel.broker.on("submit", function(){
				var transition = new gereji.transition();
				var domain_div = document.getElementById("activate_wizard_domain");
				var sync = false;
				app.siteModel.broker.on("sync", function(){
					sync = arguments[0].data;
				});
				transition.duration(900).direction("left").slide(domain_div, function(){
					app.email.focus();
					app.siteModel.broker.on("sync", function(){
						var response = arguments[0].data;
						if(!response.activate.domain[0].error)
							return;
						app.alias.focus();
						var transition = new gereji.transition();
						transition.duration(900).direction("right");
						transition.slide(document.getElementById("activate_wizard_user"));
						app.alias.value = "";
						app.alias.setAttribute("placeholder", response.activate.domain[0].error);
						app.alias.className += " invalid-input";
					});
					sync && app.siteModel.broker.emit({type: "sync", data: sync});
				});
			});
		},
		assign: function(event){
			var userModel = event.data;
			userModel.set("site_id", app.siteModel.get("_id"));
			userModel.broker.on("submit", function(){
				var transition = new gereji.transition();
				transition.duration(900).direction("left");
				var div = document.getElementById("activate_wizard_user");
				var sync = false;
				userModel.broker.on("sync", function(){
					sync = arguments[0];
				});
				transition.slide(div, function(){
					setTimeout(function(){
						userModel.broker.on("sync", function(){	
							document.getElementById("activate_form").setAttribute("action", "//" + app.siteModel.response.activate.domain[0][0].alias[0]);
							document.getElementById("activate_email").value = userModel.response.activate.user[0].email;
							document.getElementById("activate_password").value = userModel.response.activate.user[0].password;
							var transition = new gereji.transition();
							transition.duration(900).direction("left");
							var div = document.getElementById("activate_wizard_creating");
							transition.slide(div);
						});
						sync && userModel.broker.emit({type: "sync", data: sync});
					}, 3000);
				});
			});
			var siteModel = new gereji.model();
			siteModel.init();
			siteModel.set("author", userModel.get("_id"));
			siteModel.meta("about", "/api/activate_domain/" + app.siteModel.get("_id"));
			siteModel.meta("name", "site");
			siteModel.sync();
		},
        resize: function(){
            var main = document.getElementsByTagName('main')[0];
            if(!main || main.className.indexOf('fill-vertical') == -1)
                return;
            var height = window.innerHeight - document.getElementsByTagName('header')[0].clientHeight - document.getElementsByTagName('footer')[0].clientHeight;
            var padding = (height - main.clientHeight) / 2;
            main.style.padding = padding + 'px 0';
            main.style.height = main.clientHeight + 'px';
        },
        lock: function(){
            var divs = document.querySelectorAll('.wizard-item-content');
			if(!divs.length)
				return;
			var width = String(divs[0].clientWidth) + 'px';
			var height = String(divs[0].clientHeight) + 'px';
			for(var i = 0; i < divs.length; i++){
				divs[i].style.width = width;
				divs[i].style.height = height;
			}
        }
	};
});
