"use strict";
os.register('transition', function(sandbox){
	return {
		init: function(){
		},
		animate: function(duration, action, then){
			var n = 1;
			do {
				var y = Math.sin(0.5 * Math.PI * n / duration);
				(function() {
					var value = y;
					var t = n;
					setTimeout(function() {
						action(value);
						(t == duration) && then &&  then();
					}, n);
				})();
			} while (n++ < duration);
		}
	};
});
