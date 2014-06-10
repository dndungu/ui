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
		if (data.instance) {
			data.instance.kill();
			data.instance = null;
		}
	},
	boot : function() {
		this.sandbox = {
			broker: (new gereji.broker()),
			storage: (new gereji.storage())
		};
		(new gereji.dom()).init(this.sandbox.broker);
		for (var i in this.apps) {
			if (this.apps.hasOwnProperty(i)) {
				this.start(i);
			}
		}
	},
	halt : function() {
		for ( var i in this.apps) {
			if (this.apps.hasOwnProperty(i)) {
				this.stop(i);
			}
		}
	}
});
window.gerejios = new gereji.os();
