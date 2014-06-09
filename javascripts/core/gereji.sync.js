"use strict";
gereji.extend('sync', {
	init: function(){
		this.headers = [];
		this.headers.push({"X-Powered-By": "Gereji"});
		this.headers.push({"Cache-Control": "no-cache"});
		this.options = {"async": true};
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
				xhr.readyState === 4 && xhr.status === 200 && args.complete(xhr.responseText);
			};
            transport.open(args.method, args.uri, this.options);
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
