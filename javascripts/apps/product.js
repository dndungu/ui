"use strict";
gereji.apps.register("product", function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on([".product-add-category:keypress"], app.addCategory);
			sandbox.on([".product-category-item:change"], app.removeCategory);
			sandbox.on(["product-form:render"], app.renderForm);
			sandbox.on([".product-variant-value:keypress"], app.updateVariants);
		},
		kill: function(){
		},
		addCategory: function(){
			var event = arguments[0].data.event;
			if(event.keyCode != 44)
				return;
			var target = arguments[0].data.target;
			if(!target.value.length)
				return;
			var value = target.value.trim().toLowerCase();
			var label = value.charAt(0).toUpperCase() + value.slice(1);
			var li = '<li class="grid2 half-space-top"><label><input class="product-category-item" name="tags" type="checkbox" value="' + value + '" checked="true"/> ' + label + '</label></ul>';
			(new gereji.dom()).findTag("ul").findClass("product-category-list").append(li);
			target.value = "";
			event.preventDefault();
		},
		removeCategory: function(){
			var target = arguments[0].data.target;
			if(!target.checked)
				(new gereji.dom()).setElement(target).findParentTag("li").remove();
		},
		renderForm: function(){
			app.data = {};
			app.variants = {};
			if(!arguments[0].data.generic)
				return;
			app.data = arguments[0].data.generic.rest[0][0];
			app.renderVariants();
			app.variants = app.formatVariants();
		},
		formatVariants: function(){
			var variants = app.data.variants ? app.data.variants : {};
			var results = {};
			for(var i in variants){
				for(var j in variants[i].variants){
					var variant = variants[i].variants[j];
					if(!results.hasOwnProperty(variant.name))
						results[variant.name] = [];
					results[variant.name].push(variant.content);
				}
			}
			return results;
		},
		renderVariants: function(){
			var div = (new gereji.dom()).findTag('div').findClass('product-variants');
			var xslt = new gereji.xslt();
			xslt.init({type: "list", name: "variant"});
			xslt.broker.on(["update", "ready"], function(){
				xslt.transform({variants : app.data.variants});	
				div.html(xslt.getHTML());
			});
			if(xslt.ready())
				return xslt.broker.emit("ready");
			xslt.fetch();
		},
		updateVariants: function(){
            var event = arguments[0].data.event;
            if(event.keyCode != 44)
                return;
			var target = arguments[0].data.target;
			var content = target.value.trim().toLowerCase();
			target.value = "";
			event.preventDefault();
			var name = (new gereji.dom()).findTag("*").findClass("product-variant-name").value();
			app.addVariant(name, content);
		},
		addVariant: function(name, content){
            var variants = app.variants;
            if(!variants.hasOwnProperty(name))
                variants[name] = [];
            if(variants[name].indexOf(content) == -1)
                variants[name].push(content);
			var keys = [];
			for(var name in variants){
				var key = [];
				for(var i in variants[name]){
					key.push(Number(i));
				}
				keys.push(key);
			}
			var rows = app.cartesian.apply(this, keys);
			app.revert(variants, rows);
			for(var i in rows){
				var row = rows[i].slice(0);
				var columns = [];
				for(var name in variants){
					columns.push({name: name, content: variants[name][row.shift()]});
				}
                var variant = app.variant();
                variant.variants = columns.slice(0);
                app.data.variants.push(variant);
			}
			app.renderVariants();
		},
		cartesian: function(){
			var r = [], arg = arguments, max = arg.length - 1;
			function combine(arr, i){
				var l = arg[i].length;
				for (var j=0; j<l; j++) {
					var a = arr.slice(0);
					a.push(arg[i][j]);
					if (i==max){
						r.push(a);
					}else{
						combine(a, i+1);
					}
				}
			}
			combine([], 0);
			return r;
		},
		revert: function(variants, rows){
			app.data.variants = app.data.variants ? app.data.variants : [];
			for(var i in app.data.variants){
				var item = [];
				for(var j in app.data.variants[i].variants){
					var variant = app.data.variants[i].variants[j];
					item.push(variants[variant.name].indexOf(variant.content));
				}
				for(var k in rows){
					if(rows[k].length != item.length)
						return (app.data.variants = []);
					if(rows[k].join("") != item.join(""))
						continue;
					rows.splice(k, 1);
					break;
				}
			}
		},
		variant: function(){
			return {
				_id: ((new gereji.storage()).uuid()),
				variants: [],
				price: {
					price:"0.00",
					currency: "KES"
				},
				capacity: {
					capacity: 0,
					unit: "Kg"
				},
				pre_order: false,
				stock: 0,
				sku: "",
				barcode: ""
			};
		},
		sortObject: function(o){
			var s = {};
			var a = [];
			for(var i in o){
				if(o.hasOwnProperty(i))
					a.push({key : i, value: o[i]});
			}
			a.sort(function(x, y){return x.value.length - y.value.length;});
			for(var j in a){
				s[a[j].key] = a[j].value;
			}
			return s;
		},
		cloneObject: function(o) {
			var c = o.constructor();
			for (var i in o) {
				if (o.hasOwnProperty(i))
					c[i] = o[i];
			}
			return c;
		}		
	};
});	
