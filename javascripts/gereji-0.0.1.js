"use strict";
var gereji = function(){};
gereji.extend =
function() {
	var name = arguments[0];
	var extension = arguments[1];
	var module = function(){};
	module.extend = gereji.extend;
	for(var i in this.prototype){
		module.prototype[i] = this.prototype[i];
	}
	for(var j in extension){
		module.prototype[j] = extension[j];
	}
	this[name] = module;
};
"use strict"
gereji.extend('broker', {
	init: function(){
		this.events = [];
	},
	on : function() {
		var types = typeof arguments[0] == "string" ? [ arguments[0] ] : arguments[0];
		for ( var i in types) {
			var type = types[i];
			this.events = this.events ? this.events : {};
			this.events[type] = typeof this.events[type] == 'undefined' ? [] : this.events[type];
			this.events[type].push(arguments[1]);
		}
	},
	emit : function(_event) {
		_event = typeof _event == "string" ? {type : _event, data : {}} : _event;
		_event.data = typeof _event.data == "undefined" ? {} : _event.data;
		try{
			var listeners = this.events ? this.events[_event.type] : [];
			for(var i in listeners){
				typeof listeners[i] === 'function' && listeners[i](_event);
			}
		}catch(e){
			console && console.error(e);
		}
	}
});
"use strict";
gereji.extend('sync', {
	init: function(){
		this.headers = {};
		this.headers["X-Powered-By"] = "Gereji";
		this.headers["Content-Type"] = "application/json";
		this.headers["Cache-Control"] = "no-cache";
		this.options = {"async": true};
	},
	header: function(key, value){
		this.headers[key] = value;
		return this;
	},
	get: function(uri, then){
		return this.request({uri: uri, method: 'GET', complete: then});
	},
	post: function(uri, payload, then){
		return this.request({method: 'POST', uri: uri, data: payload, complete: then});
	},
	put: function(uri, payload, then){
		return this.request({method: 'PUT', uri: uri, data: payload, complete: then});
	},
	"delete": function(uri, then){
		return this.request({method: 'DELETE', uri: uri, complete: then});
	},
	request: function(){
		var args = arguments[0];
        try{
			var transport = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            transport.onreadystatechange = function(){
				var xhr = arguments[0].target;
				xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400 && args.complete(xhr.responseText);
			};
            transport.open(args.method, args.uri, this.options);
			for(var i in this.headers){
				transport.setRequestHeader(i, this.headers[i]);
			}
            transport.send(args.data)
        }catch(e){
            console && console.log(e);
        }
    },
	xget: function(uri, then){
		try{
			var script = document.createElement("script");
			script.src = uri;
			script.readyState
				? 
					script.onreadystatechange = function(){
						if(script.readyState != "loaded" && script.readyState != "complete") return;
						then();
						script.onreadystatechange = null;
					}
				:
					script.onload = then;
			script.type = 'text/javascript';
			script.async = true;
			document.getElementsByTagName('head')[0].appendChild(script);
		}catch(e){
			console && console.log(e);
		}
	}
});
"use strict";
gereji.extend('storage', {
	init: function(){
		this.scope = arguments[0] ? arguments[0] : 'gereji';
		this.store = localStorage ? localStorage : new gereji.memory();
		this.store.hasOwnProperty(this.scope) || this.store.setItem(this.scope, "{}");
	},
	set: function(key, value){
		var store = this.getStore();
		store[key] = value;
		this.store.setItem(this.scope, JSON.stringify(store));
	},
	get: function(key){
		var store = this.getStore();
		return store.hasOwnProperty(key) ? store[key] : {};
	},
	where: function(filters){
		var store = this.getStore();
		var matches = [];
		for(var i in store){
			
		}
	},
	getStore: function(){
		return this.store.hasOwnProperty(this.scope) ? JSON.parse(this.store.getItem(this.scope)) : {};
	},
	uuid: function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
	}
});
"use strict";
gereji.extend("validator", {
	test: function(type, input){
		switch(type){
			case "required":
				return String(input).length;
				break;
			case "string":
				return this.testString(input);
				break;
			case "integer":
				return this.testInteger(input);
				break;
			case "positiveinteger":
				return this.testPositiveInteger(input);
				break;
			case "negativeinteger":
				return this.testNegativeInteger(input);
				break;
			case "currency":
				return this.testCurrency(input);
				break;
			case "double":
				return this.testDouble(input);
				break;
			case "positivedouble":
				return this.testPositiveDouble(input);
				break;
			case "negativedouble":
				return this.testNegativeDouble(input);
				break;
			case "phone":
				return this.testPhone(input);
				break;
			case "year":
				return this.testYear(input);
				break;
			case "date":
				return this.testDate(input);
				break;
			case "ip":
				return this.testIP(input);
				break;
			case "password":
				return this.testPassword(input);
				break;
			case "email":
				return this.testEmail(input);
				break;
			case "domain":
				return this.testDomain(input);
				break;
			case "subdomain":
				return this.testSubDomain(input);
				break;
			case "handle":
				return this.testHandle(input);
				break;
			case "url":
				return this.testURL(input);
				break;
			case "uuid":
				return this.testUUID(input);
				break;
			case "boolean":
				return (typeof input == "boolean");
				break;
			default:
				return true;
				break;
		}
	},
    testString: function(){
        var pattern = /^.+$/i;
        return pattern.test(arguments[0]);
    },
    testInteger: function(){
        var pattern = /^-{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveInteger: function(){
        var pattern = /^\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeInteger: function(){
        var pattern = /^-\d+$/;
        return pattern.test(arguments[0]);
    },
    testCurrency: function(){
        var pattern = /^-{0,1}\d*\.{0,2}\d+$/;
        return pattern.test(arguments[0]);
    },
    testDouble: function(){
        var pattern = /^-{0,1}\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveDouble: function(){
        var pattern = /^\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeDouble: function(){
        var pattern = /^-\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPhone: function(){
        var pattern = /^\+?[0-9\s]{8,16}/;
        return pattern.test(arguments[0]);
    },
    testYear: function(){
        var pattern = /^(19|20)[\d]{2,2}$/;
        return pattern.test(arguments[0]);
    },
    testDate: function(){
        return !isNaN(Date.parse(arguments[0]));
    },
    testIP: function(){
        var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return pattern.test(arguments[0]);
    },
    testPassword: function(){
        var pattern = /^[a-z0-9_-]{6,18}$/i;
        var pass = pattern.test(arguments[0]);
        return pass;
    },
    testEmail: function(){
        var pattern = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
        return pattern.test(arguments[0]);
    },
    testDomain: function(){
        var pattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
        return pattern.test(arguments[0]);
    },
    testSubDomain: function(){
        var pattern = /^[a-z\d]+([-_][a-z\d]+)*$/i;
        return pattern.test(arguments[0]);
    },
	testHandle: function(){
		var pattern = /^[a-z\d\/\+\-\.]+$/i;
		return pattern.test(arguments[0]);
	},
    testURL: function(){
        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        return pattern.test(arguments[0]);
    },
	testUUID: function(){
		var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return pattern.test(arguments[0]);
	}
});
"use strict";
gereji.extend('transition', {
	options: {
		direction: "left",
		duration: 900,
		timingFunction: "ease"
	},
	duration: function(){
		this.options.duration = arguments[0] ? arguments[0] : this.options.duration;
		return this;
	},
	direction: function(){
		this.options.direction = arguments[0] ? arguments[0] : this.options.direction;
		return this;
	},
	slide: function(){
		var target = arguments[0];
		var then = arguments[1] ? arguments[1] : false;
		switch(this.options.direction){
			case "left":
				this.transition(target, this.next(target), "width", then);		
				break;
			case "right":
				this.transition(target, this.previous(target), "width", then);		
				break;
			case "up":
				this.transition(target, this.next(target), "height", then);		
				break;
			case "down":
				this.transition(target, this.previous(target), "height", then);		
				break;
		}
		return this;
	},
	transition: function(current, next, style, then){
		next.style.display = 'inline-block';
		var max = current[("client" + style.charAt(0).toUpperCase() + style.slice(1))];
		if(!this.modern()){
			return	this.animate(function(fraction){
						next.style[style] = String(Math.ceil(max * fraction)) + '%';
						current.style[style] = String(Math.floor(max - (max * fraction))) + '%';
					}, then);
		}
		var transition = style + " " + this.options.duration + "ms " + this.options.timingFunction;
		current.style.transition = transition;
		next.style.transition = transition;
		current.style[style] = "0";
		next.style[style] = String(max) + "px";
		then && setTimeout(then, this.options.duration);
		return this;
	},
	next: function(target){
		var subject = target.nextSibling ? target.nextSibling : target.parentNode.firstChild;
		while(subject.nodeType != 1){
			subject = subject.nextSibling ? subject.nextSibling : target.parentNode.firstChild;
		}
		return subject;
	},
    previous: function(target){
        var subject = target.previousSibling ? target.previousSibling : target.parentNode.lastChild;
        while(subject.nodeType != 1){
           subject = subject.previousSibling ? subject.previousSibling : target.parentNode.lastChild;
        }
        return subject;
    },
    modern: function(){
        var s = document.createElement('p').style;
        return ('transition' in s || 'webkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s);
    },
	animate: function(action, then){
		var n = 1;
		do {
			var y = Math.sin(0.5 * Math.PI * n / this.options.duration);
			(function() {
				var fraction = y;
				var t = n;
				setTimeout(function() {
					action(fraction);
					(t == duration) && then && then();
				}, n);
			})();
		} while (n++ < duration);
	}
});
"use strict";
gereji.extend("model", {
	init: function(){
		this.status = "ready";
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
		this.store = {data: {}, meta: {}};
		return this;
	},
    ready: function(){
		if(arguments[0])
			this.status = arguments[0];
        return (this.status == "ready");
    },
	meta: function(){
		var key = arguments[0] ? arguments[0] : undefined;
		var value = arguments[1] ? arguments[1] : undefined;
		if(value != undefined)
			this.store.meta[key] = value;
		if(key != undefined && value == undefined)
			return this.store.meta[key] ? this.store.meta[key] : undefined;
		return this;
	},
	set: function(key, value){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		for(var i in path){
			test += "." + path[i];
			eval(test + " = " + test + " ? " + test + " : {}");
		}
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		index || eval(test + ' = "' + value + '"');
		index && eval(test + " = " + test + " instanceof Array ? " + test + " : []");
		index && eval(test + '[' + index + '] = "' + value + '"');
		return this;
	},
	get: function(key){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		var value = undefined;
		for(var i in path){
			test += "." + path[i];
			value = eval(test) === undefined ?  undefined : (index ? eval(test + "[" + index + "]") : eval(test));
		}
		return value;
	},
	sync: function(){
		var url = this.meta("about");
		var name = this.meta("name");
		var that = this;
		this.broker.emit({type: "submit", data: this.store.data});
		this.ajax.post(url, JSON.stringify(this.store.data), function(){
			that.response = JSON.parse(arguments[0]);
			that.broker.emit({type: "sync", data: that.response});
		});
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	},
	find: function(){
		return this.store.data;
	}
});
"use strict";
gereji.extend("collection", {
	init: function(){
		this.store = {data: {}, meta: {}};
		if(arguments[0].meta)
			this.store.meta = arguments[0].meta;
		if(arguments[0].data)
			this.store.data = arguments[0].data;
		this.status = null;
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
        this.storage = new gereji.storage();
        this.storage.init();
		var collections = this.storage.get("collections");
		if(!collections.hasOwnProperty(this.store.meta.name))
			return this.fetch(this.store.meta.name);
		this.store.data = collections[this.store.meta.name];
		this.status = "ready";
		return this;
	},
	fetch: function(name){
		var that = this;
		this.ajax.get(this.store.meta.about, function(response){
			that.status = "ready";
			that.store.data = response;
			that.broker.emit({type: "update", data: that.store.data});
			var collections = that.storage.get("collections");
			collections[name] = that.store.data;
			that.storage.set("collections", collections);
		});
		return this;
	},
    ready: function(){
        return (this.status == "ready");
    },
    meta: function(){
        var key = arguments[0];
        var value = arguments[1];
        if(value != undefined)
            this.store.meta[key] = value;
        if(key != undefined && value == undefined)
            return this.store.meta[key] ? this.store.meta[key] : undefined;
        return this;
    },
	find: function(){
		return this.store.data;
	}
});
"use strict";
gereji.extend("dom", {
	findId: function(id){
		this.elements = document.getElementsById(id);
	},
	findTag: function(tagName){
		this.elements = document.getElementsByTagName(tagName);
		return this;
	},
	findClass: function(className){
		var result = [];
		for(var i = 0; i < this.elements.length; i++){
			var element = this.elements[i];
			if(element.className.split(" ").indexOf(className) != -1)
				result.push(element);			
		}
		this.elements = result;
		return this;
	},
	getElements: function(){
		return this.elements;
	},
    setElement: function(){
        this.elements = [arguments[0]];
        return this;
    },
	setElements: function(){
		this.elements = [];
		for(var i = 0; i < arguments[0].length; i++){
			this.elements.push(arguments[0][i]);
		}
		return this;
	},
	addClass: function(){
		var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		for(var i = 0; i < this.elements.length; i++){
			for(var j in classes){
				var className = this.elements[i].className;
				this.elements[i].className = (className.indexOf(classes[i]) == -1) ? (className + " " + classes[i]) : className;
			}
		}
		return this;
	},
	removeClass: function(){
		var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		for(var i = 0; i < this.elements.length; i++){
			for(var j in classes){
				this.elements[i].className = this.elements[i].className.replace(classes[j], "").replace("  ", " ");
			}
		}
		return this;
	},
	hasClass: function(){
		return (this.elements[0] && this.elements[0].className && this.elements[0].className.indexOf(arguments[0]) != -1)
	},
	findParentTag: function(parentTag){
		var tag = this.elements[0].tagName.toLowerCase();
		if(tag == "body")
			this.elements = [];
		if(tag == parentTag || tag == "body")
			return this;
		this.elements = [this.elements[0].parentNode];
		return this.findParentTag(parentTag);
	},
    findNextSibling: function(){
		var target = this.elements[0];
        var subject = target.nextSibling ? target.nextSibling : target.parentNode.firstChild;
        while(subject.nodeType != 1){
            this.elements[0] = subject.nextSibling ? subject.nextSibling : target.parentNode.firstChild;
        }
        return this;
    },
    findPreviousSibling: function(){
		var target = this.elements[0];
        var subject = target.previousSibling ? target.previousSibling : target.parentNode.lastChild;
        while(subject.nodeType != 1){
           this.elements[0] = subject.previousSibling ? subject.previousSibling : target.parentNode.lastChild;
        }
        return this;
    },
	attribute: function(){
		if(arguments.length == 1)
			return this.elements[0].getAttribute(arguments[0]);
		for(var i in this.elements){
			this.elements[i].setAttribute(arguments[0], arguments[1]);
		}
		return this;
	},
	css: function(css){
		for(var i in this.elements){
			for(var j in css){
				this.elements[i].style[j] = css[j];
			}
		}
		return this;
	}
});
"use strict";
gereji.extend('xslt', {
	init: function(){
		this.status = null;
		var type = arguments[0];
		var name = arguments[1];
		this.key = type + "-" + name;
		this.broker = new gereji.broker();
		this.broker.init();
		this.sync = new gereji.sync();
		this.sync.init();
		this.storage = new gereji.storage();
		this.storage.init();
		var templates = this.storage.get("templates");
		this.processor = new XSLTProcessor();
		if(!templates.hasOwnProperty(this.key))
			return this.fetch(type, name);
		this.xsl = templates[this.key];
		this.status = "ready";
		return this;
	},
	ready: function(){
		return (this.status == "ready");
	},
	fetch: function(type, name){
		var url = "/static/" + type + "/" + name + ".xsl";
		var that = this;
		this.sync.get(url, function(xsl){
			that.xsl = xsl;
			that.status = "ready";
			that.broker.emit({type: "update", data: xsl});
			var templates = that.storage.get("templates");
			templates[that.key] = xsl;
			that.storage.set("templates", templates);
		});
		return this;
	},
	transform: function(){
		var stylesheet = this.parse(this.xsl);
		this.processor.importStylesheet(stylesheet);
		var data = typeof arguments[0] == 'string' ? JSON.parse(arguments[0]) : arguments[0];
		var xml = this.parse(this.json2xml(data));
		this.html = this.processor.transformToFragment(xml, document);
	},
	getHTML: function(){
		return this.html;
	},
	json2xml: function(data){
		var xml = this.createXML(data);
		xml.unshift('<?xml version="1.0"?>');
		return xml.join("\n");
	},
	createXML: function(){
        var content = arguments[0];
        var xml = [];
        for(var i in content){
            var name = isNaN(i) ? i : 'node-' + String(i);
            var value = ['number', 'boolean', 'string'].indexOf(typeof content[i]) == -1 ? this.createXML(content[i]) : String(content[i]);
            xml.push('<'+name+'>'+value+'</'+name+'>');
        }
        return xml;
	},
	parse2: function(){
		return Saxon.parseXML(arguments[0]);
	},
	parse: function(){
		try{
			return ((new DOMParser).parseFromString(arguments[0], "application/xml"));
		}catch(e){
			var doc = document.implementation.createHTMLDocument("");
			doc.documentElement.innerHTML = arguments[0];
			return doc;
		}
	}
});
"use strict";
gereji.extend("view", {
	init: function(){
		this.store = {
			data: {},
			template: {},
			stage: {}
		};
		return this;
	},
	ready: function(){
		return (this.store.template.ready() && this.store.data.ready());
	},
	data: function(){
		this.store.data = arguments[0];
		var that = this;
		this.store.data.broker.on("update", function(){
			that.render(arguments[0]);
		});
		return this;
	},
	template: function(){
		this.store.template = arguments[0];
		var that = this;
		this.store.template.broker.on("update", function(){
			that.render(arguments[0]);
		});
		return this;
	},
	stage: function(){
		this.store.stage = arguments[0];
		return this;
	},
	render: function(){
		var data = this.store.data.find();
		if(!data || !this.ready())
			return this;
		this.store.template.transform(data);
		this.store.stage.innerHTML = "";
		this.store.stage.appendChild(this.store.template.getHTML());
		return this;
	}
});
"use strict";
gereji.extend('os', {
	sandbox: {},
	apps: {},
	register : function(appId, creator) {
		this.apps[appId] = {
			creator : creator,
			instance : null
		};
	},
	start : function(appId) {
		var app = this.apps[appId];
		app.instance = app.creator(this.sandbox);
		try {
			app.instance.init();
		} catch (e) {
			console && console.error(e.message);
		}
	},
	stop : function(appId) {
		var data = this.apps[appId];
		if(!data.instance)
			return;
		data.instance.kill();
		data.instance = null;
	},
	boot : function() {
		this.sandbox = new gereji.broker();
		this.sandbox.init();
		this.sandbox.models = {};
		this.sandbox.collections = {};
		this.sandbox.views = {};
		this.sandbox.validator = new gereji.validator();
		this.sandbox.transition = new gereji.transition();
		this.sandbox.storage = new gereji.storage();
		this.sandbox.sync = new gereji.sync();
		this.sandbox.storage.init();
		this.sandbox.sync.init();
		for (var i in this.apps) {
			this.apps.hasOwnProperty(i) && this.start(i);
		}
		this.sandbox.emit({type: "body:load", data: {}});
	},
	halt : function() {
		for ( var i in this.apps) {
			this.apps.hasOwnProperty(i) && this.stop(i);
		}
	}
});
gereji.apps = new gereji.os();
"use strict";
gereji.apps.register('events', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			for(var i in app.events){
				var ev = 'on' + app.events[i];
				document[ev] = function(){
					app.fire.apply(app, arguments);
				}
			}
			window.onresize = function(){
				sandbox.emit({type: "window:resize", data: arguments[0]});
			};
		},
		fire: function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;
			if(target.className.indexOf("bubble-up") != -1)
				return target.parentNode[event.type] && target.parentNode[event.type]();
			var cls = target.className.split(' ');
			var tagName = target.tagName.toLowerCase();
			var data = {target: target, event: event};
			sandbox.emit({type: tagName + ':' + event.type, data: data});
			target.id && sandbox.emit({type: '#' + target.id + ':' + event.type, data: data});
			for(var i in cls){
				var type = '.' + cls[i] + ':' + event.type;
				sandbox.emit({type: type, data: data});
			}
		},
		events: [
			'load',
			'change',
			'resize',
			'submit',
			'drag',
			'dragstart',
			'dragenter',
			'dragleave',
			'dragover',
			'dragend',
			'drop',
			'mousedown',
			'mouseup',
			'mousemove',
			'mouseover',
			'mouseout',
			'click',
			'dblclick',
			'keyup',
			'keydown',
			'keypress'
		]
	}
});
"use strict";
gereji.apps.register('form', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on([".dashboard-add-new:click"], app.add);
//			sandbox.on(['input:keyup', 'textarea:keyup', 'select:change'], app.save);
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
//		save: function(){
//			var target = arguments[0].data.target;
//			var property = target.getAttribute('property');
//			var form = (new gereji.dom()).setElement(target).findParentTag("form").getElements()[0];
//			var _id = form ? app.findId(form) : undefined;
//			var about = form ? form.getAttribute('about') : undefined;
//			if(!about || !property || !form || arguments[0].data.event.keyCode == 13)
//				return;
//			if(!_id || !sandbox.validator.test('uuid', _id))
//				_id = app.createIdInput(form);
//			var name = form.getAttribute("name");
//			sandbox.models[_id] = sandbox.models.hasOwnProperty(_id) ? sandbox.models[_id] : app.model({about: about, name: name, _id : _id});
//			sandbox.models[_id].set(property, target.value);
//			sandbox.models[_id].broker.emit({type: "change", data: {property: target.value}});
//		},
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
			var about = target.getAttribute('about');
			if(!about)
				return;
			var _id = app.findId(target);
			arguments[0].data.event.preventDefault();
			var model =  sandbox.models[_id] ? sandbox.models[_id] : app.model({about: about, form: target, _id : _id});
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
"use strict";
gereji.apps.register('layout', function(sandbox){
	return {
		init: function(){
			sandbox.on(["body:load"], this.vertical);
		},
		vertical: function(){
			var main = (new gereji.dom()).findTag("main").findClass("fill-vertical");
			if(!main.getElements().length)
				return;
			var header = (new gereji.dom()).findTag("header");
			var headerHeight = header.getElements().length ? header.getElements()[0].offsetHeight : 0;
			var footer = (new gereji.dom()).findTag("footer");
			var footerHeight = footer.getElements().length ? footer.getElements()[0].offsetHeight : 0;
			var space = window.innerHeight - headerHeight - footerHeight - main.getElements()[0].offsetHeight;
			var padding = String(Math.floor(space / 2.4)) + "px 0 " + String(Math.floor(space / 1.6) - 16) + "px";
			main.css({padding: padding});
		}
	};
});
"use script";
gereji.apps.register("dashboard", function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			app.header = document.getElementsByTagName("header")[0];
			app.main = document.getElementsByTagName("main")[0];
			app.primary = document.getElementById("primary");
			app.secondary = document.getElementById("secondary");
			sandbox.on(["body:load", "window:resize"], app.resize);
			sandbox.on([".dashboard-nav:mousedown"], app.clear);
			sandbox.on([".dashboard-nav:mousedown"], app.navigate);
			sandbox.on([".dashboard-nav:mousedown"], app.stage);
			sandbox.on([".dashboard-nav:click"], app.brake);
			sandbox.on([".dashboard-add-new:click"], app.toggleMode);
		},
		resize: function(){
			var height = app.main.offsetHeight - app.main.getElementsByTagName("section")[0].offsetHeight;
			app.main.getElementsByTagName("section")[1].style.height = height + "px";
		},
		clear: function(){
			var target = arguments[0].data.target;
			var anchors = app.header.getElementsByTagName("a");
			for(var i = 0; i < anchors.length; i++){
				anchors[i].className = anchors[i].className.replace(/current/, "").replace("  ", " ");
			}
		},
		navigate: function(){
			var target = arguments[0].data.target;
			if(target.className.indexOf("openclose") == -1)
				return (target.className += " current");
			var subject = target.parentNode.getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0];
			app.stage({data: {target: subject}});
			app.navigate({data: {target: subject}});
		},
		stage: function(){
			var target = arguments[0].data.target;
            var data = {};
            data.type = target.getAttribute("type");
            data.href = target.getAttribute("href");
            data.about = target.getAttribute("about");
            data.name = target.getAttribute("name");
            data.target = target.getAttribute("target");
            if(data.href && data.about && data.name)
                sandbox.emit({type: (data.type + ":stage"), data: data});
		},
		brake: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
		},
		toggleMode: function(){
            var target = arguments[0].data.target;
            var button = (new gereji.dom()).setElement(target).getElements()[0];
            var className = button && button.getAttribute("mode") ? button.getAttribute("mode") : "split-mode";
			(new gereji.dom()).findTag("main").removeClass(["primary-mode", "split-mode", "secondary-mode"]).addClass(className);
		}
	}
});
"use strict";
gereji.apps.register('collapsible', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(["body:load", "body:change"], app.close);
			sandbox.on([".collapsible-single-openclose:click"], app.toggle)
			sandbox.on([".collapsible-openclose:mousedown"], app.dance);
		},
		close: function(){
			var tags = (new gereji.dom()).findTag("*").findClass("collapsible-single").getElements();
			if(!tags.length)
				return;
			for(var i = 0; i < tags.length; i++){
				var tag = (new gereji.dom()).setElement(tags[i]);
				tag.attribute("collapsible-height") || tag.attribute("collapsible-height", tags[i].clientHeight);
				tag.addClass("collapsible-single-closed");
			}
		},
		toggle: function(){
			var target = (new gereji.dom()).setElement(arguments[0].data.target.parentNode);
			if(!target.hasClass("collapsible-single-closed"))
				return target.css("collapsible-height", "auto").addClass("collapsible-single-closed");
			var height = target.attribute("collapsible-height") + "px";
			target.css("height", height).removeClass("collapsible-single-closed");
		},
		dance: function(){
			var target = (new gereji.dom()).setElement(arguments[0].data.target);
			target.attribute("target") ? target.findParentTag(target.attribute("target")) : target.setElement(arguments[0].data.target.parentNode);
			var open = target.hasClass("collapsible-open");
			(new gereji.dom()).setElements(target.getElements()[0].parentNode)
			.findClass("collapsible")
			.removeClass("collapsible-open");
			open ? target.removeClass("collapsible-open") : target.addClass("collapsible-open");
		},
		findCollapsible: function(target){
			if(target.className.indexOf('collapsible') != -1)
				return target;
			var parent = target.parentNode;
			if(parent.className.indexOf('collapsible') != -1)
				return parent;
			return app.findCollapsible(parent);
		}
	}
});
"use strict";
gereji.apps.register('basket', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['.draggable:dragstart'], app.dragStart);
			sandbox.on(['.draggable:dragend'], app.dragEnd);
			sandbox.on(['.droppable:dragover'], app.dragOver);
			sandbox.on(['.droppable:dragenter'], app.dragEnter);
			sandbox.on(['.droppable:dragleave'], app.dragLeave);
			sandbox.on(['.droppable:drop'], app.drop);
		},
		dragStart: function(){
			var target = arguments[0].data.target;
			target.id = target.id ? target.id : sandbox.storage.uuid();
			var event = arguments[0].data.event;
			event.dataTransfer.setData("id", target.id);
		},
		dragOver: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
			event.dataTransfer.effectAllowed = 'move';
		},
		dragEnter: function(){
			var target = arguments[0].data.target;
			target.classList.add('dragover');
		},
		dragLeave: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		},
		drop: function(){
			var target = arguments[0].data.target;
			var event = arguments[0].data.event;
			var id = event.dataTransfer.getData("id");
			var subject = document.getElementById(id);
			target.appendChild(subject);
			target.classList.remove('dragover');
		},
		dragEnd: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		}
	};
});
