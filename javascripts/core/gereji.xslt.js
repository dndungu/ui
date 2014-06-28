"use strict";
gereji.extend('xslt', {
	init: function(){
		this.status = null;
		var type = arguments[0];
		var name = arguments[1];
		this.broker = new gereji.broker();
		this.broker.init();
		this.sync = new gereji.sync();
		this.sync.init();
		this.storage = new gereji.storage();
		this.storage.init();
		var templates = this.storage.get("templates");
		if(!templates.hasOwnProperty(name))
			return this.fetch(type, name);
		this.xsl = templates[name];
		this.status = "ready";
		return this;
	},
	ready: function(){
		return (this.status == "ready");
	},
	fetch: function(type, name){
		var url = "/static/templates/" + type + "/" + name + ".xsl";
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
		var stylesheet = this.parse(this.xsl);
		this.processor = Saxon.newXSLT20Processor(stylesheet);
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
	parse: function(){
		return Saxon.parseXML(arguments[0]);
	},
	parse2: function(){
		try{
			return ((new DOMParser).parseFromString(arguments[0], "application/xml"));
		}catch(e){
			var doc = document.implementation.createHTMLDocument("");
			doc.documentElement.innerHTML = arguments[0];
			return doc;
		}
	}
});
