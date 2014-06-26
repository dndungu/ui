"use strict";
gereji.extend('xslt', {
	init: function(){
		this.status = null;
		var name = arguments[0];
		this.broker = new gereji.broker();
		this.broker.init();
		this.sync = new gereji.sync();
		this.sync.init();
		this.processor = new XSLTProcessor();
		this.storage = new gereji.storage();
		this.storage.init();
		var templates = this.storage.get("templates");
		templates.hasOwnProperty(name) ? (this.status = "ready") : this.fetch(name);
		templates.hasOwnProperty(name) && (this.xsl = templates[name]);
		return this;
	},
	ready: function(){
		return (this.status == "ready");
	},
	fetch: function(name){
		var url = "/templates/" + name + ".xsl";
		var that = this;
		this.sync.get(url, function(xsl){
			that.xsl = xsl;
			that.status = "ready";
			that.broker.emit({type: "update", data: xsl});
			var templates = that.storage.get("templates");
			templates[name] = xsl;
			that.storage.set("templates", templates);
		});
		return this;
	},
	transform: function(){
		this.processor.importStylesheet(this.parse(this.xsl));
		var model = typeof arguments[0] == 'string' ? JSON.parse(arguments[0]) : arguments[0];
		var xml = this.parse(this.json2xml(model));
		this.html = this.processor.transformToFragment(xml, document);
	},
	getHTML: function(){
		return this.html;
	},
	json2xml: function(model){
		var xml = this.createXML({model : this.model});
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
