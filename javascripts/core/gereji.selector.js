"use strict";
gereji.extend("selector", {
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
	}
});
