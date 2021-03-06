(function(window,document,undefined){
    var _DragView = DragView;
    var DragView = function(options){
	    this.defaultSettings = {
		    "dragWrap": document.body,
			"dragableArea": document.body,
			"isDrag": true,
			"isDummyWrap": true,
			"dummyWrapClass": "dragview_dummy_wrap",
			"dragStatus": false
		};
		this.options = this.extend(this.defaultSettings,options);
		this.options.tempDragWrap = this.options.dragWrap;
		this.options.dragableArea = this.options.dragableArea ? this.options.dragableArea : this.options.dragWrap;
        this.init();
    }
	DragView.prototype = {
	        "constructor": DragView,
		    "init": function(){
			    var that = this;
				var dragMove = document.createElement("div");
				dragMove.setAttribute("class","dragview_move");
				document.body.appendChild(dragMove);
				that.options.isDrag && (that.options.dragableArea.style.cursor = "move");
				that.options.dragableArea.onmousedown = function(e){
				    if(!that.options.dragStatus){
						that.throttle(function(){
							that.options.isDrag && that.mouseDown(e);
						},null,0);
					}
				}.bind(that);
		    },
			"getEvent": function(e){
			    return e ? e : window.event;
			},
		    "extend": function(setting,option){
		      for(var attr in setting){
			      if(typeof option[attr] != "undefined"){
				      setting[attr] = option[attr];
				  }
			  }
			  return setting;
		    },
			"throttle": function(fn,context,delay){
			    clearTimeout(fn.timeoutId);
				fn.timeoutId = setTimeout(function(){
					fn.call(context);
				},delay);
			},
		    "mouseDown": function(e){
				var that = this;
				var dragMoveArea = "";
				var dragWrap = that.options.dragWrap;
				var events = that.getEvent(e);
				var disX = events.clientX - dragWrap.offsetLeft;
				var disY = events.clientY - dragWrap.offsetTop;
				document.getElementsByClassName("dragview_move")[0].style.display = "block";
				dragWrap.style.position = "absolute";
				dragWrap.style.zIndex = "99999";
				that.options.tempDragWrap = that.options.dragWrap;
				if(that.options.isDummyWrap){
					dragMoveArea = document.createElement("div");
					dragMoveArea.setAttribute("class",that.options.dummyWrapClass);
					dragMoveArea.style.width = dragWrap.clientWidth + "px";
					dragMoveArea.style.height = dragWrap.clientHeight + "px";
					dragMoveArea.style.position = "absolute";
					dragMoveArea.style.zIndex = "99999";
					dragMoveArea.style.top = dragWrap.style.top;
					dragMoveArea.style.left = dragWrap.style.left;
					document.body.appendChild(dragMoveArea);
					that.options.tempDragWrap = dragMoveArea;
                }				
				that.options.dragStatus = true;
				document.onmousemove = function(e){
					that.throttle(function(){
					    var _events = that.getEvent(e);
					    that.mouseMove(_events,disX,disY,dragMoveArea);
					},null,0);
				}
				document.onmouseup = function(){
					that.options.dragStatus && that.mouseUp(dragMoveArea);
				}
			},
			"mouseMove": function(_events,disX,disY,dragMoveArea){
				if(this.options.dragStatus){
					var _x = _events.clientX - disX;
					var _y = _events.clientY - disY;
					var _winW = document.documentElement.clientWidth || document.body.clientWidth;
					var _winH=document.documentElement.clientHeight || document.body.clientHeight;
					var option = {
						"x": _x,
						"y": _y,
						"winX": _winW,
						"winY": _winH,
						"dragW": this.options.tempDragWrap.offsetWidth,
						"dragH": this.options.tempDragWrap.offsetHeight
					};
					this.limiteRange(option);
				}
			},
			"mouseUp": function(dragMoveArea){
			    this.options.dragWrap.style.left = this.options.tempDragWrap.style.left;
				this.options.dragWrap.style.top = this.options.tempDragWrap.style.top;
				this.options.dragStatus = false;
				dragMoveArea!="" && document.body.removeChild(dragMoveArea);
				document.getElementsByClassName("dragview_move")[0].style.display = "none";
			},
			"limiteRange": function(option){
				if(option.x <= 0 || option.dragW >= option.winX){
					this.options.tempDragWrap.style.left = "0px";
				}else if((option.x + option.dragW) >= option.winX){
					this.options.tempDragWrap.style.left = (option.winX - option.dragW) + "px";
				}else{
					this.options.tempDragWrap.style.left = option.x + "px";
				}

				if(option.y <= 0 || option.dragH >= option.winY){
					this.options.tempDragWrap.style.top = "0px";
				}
				else if((option.y + option.dragH) >= option.winY){
					this.options.tempDragWrap.style.top = (option.winY - option.dragH) + "px";
				}
				else{
					this.options.tempDragWrap.style.top = option.y + "px";
				}
			}
	};
	window.DragView = DragView;
})(window,document)