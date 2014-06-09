"use strict";
gereji.extend('xslt', {
	init: function(){
		this.xsl = this.parse(arguments[0]);
		this.processor = new XSLTProcessor();
		this.processor.importStylesheet(this.xsl);
	},
	transform: function(){
		this.model = typeof arguments[0] == 'string' ? JSON.parse(arguments[0]) : arguments[0];
		this.xml = this.parse(this.json2xml(this.json));
		this.html = this.processor.transformToFragment(this.xml, document);
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
	getHTML: function(){
		return this.html;
	},
	parse: function(){
		var html = arguments[0];
		try{
			var doc = (new DOMParser).parseFromString(html, "application/xml");
			return doc;
		}catch(e){
			var doc = document.implementation.createHTMLDocument("");
			doc.documentElement.innerHTML = html;
			return doc;
		}
	}
});
