"use strict";
gerejios.register('basket', function(sandbox){
	return {
		init: function(){
			sandbox.broker.on(['.draggable:dragstart'], this.dragStart);
			sandbox.broker.on(['.draggable:dragend'], this.dragEnd);
			sandbox.broker.on(['.droppable:dragover'], this.dragOver);
			sandbox.broker.on(['.droppable:dragenter'], this.dragEnter);
			sandbox.broker.on(['.droppable:dragleave'], this.dragLeave);
			sandbox.broker.on(['.droppable:drop'], this.drop);
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
