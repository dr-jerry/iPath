/*
 * Copyright 2010 Jeroen Dijkmeijer.
 *
 * Licensed under the GPL, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * http://www.fsf.org/licensing/licenses/gpl.txt
 *
 * Credit also due to those who have helped, inspired, and made their code available to the public:
 * Alexander Rulkens, After studying his idea I came up with this software.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

var StretchSketch = (function() {
    function parseControlString(str, settings) {
        var keyvals = str.split(",");
        result = {};
        for (var i=0;i<keyvals.length;i++) {
    	    var pair;
            var duo = keyvals[i].split(":");
	    // MS IE Fuckup
	    result[$.trim(duo[0])] = $.trim(duo[1]);
        }
        return result;
    }

    function StretchSketch(jsvg) {
        this.fileText = jsvg;
	this.strippedText = "";
        this.controls = [];
    }
    StretchSketch.unitConversion = 1;

    StretchSketch.load = function load(sts) {
        var renderer = function(event) {
            if(event) {
                eval(event.data.control["var"] + '=' + event.stretchSketchValue);
                $('svg').replaceWith(event.data.control.stretchSketch.evalJSVG());
            } else {
		    $('svg').replaceWith(instance.evalJSVG());
            }
        };
        var options = $.extend({
            url: '', jsvg: '', controlPanel: undefined, edit: false, showOnInit: true
            , defaultRenderer: renderer, initRenderer: renderer}, sts || {});
        //timers.stop();
        var instance;
        if (options["url"]) {
        $.ajax( {url: options["url"]
           , async: false
           , timeout: 1000
           , datatype: "text"
           , complete: function(xml) {
           }
           , success: function(text) {
              if (typeof text === 'object') {
 	          instance = new StretchSketch();
                  instance.document = text;
                  return;
	      }
	      instance = new StretchSketch(text); 
	   }
           , error: function(http, msg, ex) {
        	   alert("error during processload url: '" + id+".jsvg'" , msg);
           }
        });
        } else {
            instance = new StretchSketch(options.jsvg);
        }
        instance.defaultRenderer = options.defaultRenderer;
        instance.initRenderer = options.initRenderer;
        if (instance.document) {

            return instance;

        }
        instance.stripControls();
        if (options["controlPanel"]) {
            $('.inputline', options["controlPanel"]).remove();
            instance.controls.forEach(function(control) {
                options["controlPanel"].append(control.element);
            });
            if (options["edit"]) {
                $('<div class="inputline"><div class="edit button" id="editme">Edit</div></div>').appendTo('#draggable');
                    $("#editme").click({stretchSketch: instance }, function (evt) {
		        LazyLoad.js(['js/codemirror.js', 'js/mode/javascript.js'], function() {
			    LazyLoad.css('css/codemirror.css', function() {
				editor = CodeMirror(document.getElementById('editedit')
				    , { value: evt.data.stretchSketch.fileText, mode: "javascript", lineNumbers: true, matchBrackets: true, theme: "default"});
				setTimeout(function(){editor.refresh();}, 200);
				$('#editedit').dialog('open');
			    })
			})
		    });
		    $('.reload').click(function(evt) {
                        // todo with lambda function, stretchSketch is global variable. Bad
			stretchSketch = StretchSketch.load({jsvg: editor.getValue(), controlPanel: options["controlPanel"], edit : true, showOnInit : true});
		    });
		
            }
            options["controlPanel"].show();
        }
	if (options["showOnInit"]) {
	    options.defaultRenderer();
	}
       	return instance;
    };

    StretchSketch.prototype.stripControls = function(animation) {
        handleChange = function(evt, value) {
    	    if ("textfield.password".indexOf(evt.data.control["type"]) != -1) {
    	        evt.stretchSketchValue = "'" + (value || evt.target.value) + "'";
    	    } else {
    	        evt.stretchSketchValue = (value || evt.target.value);
            }
            if (evt.data.control.handleChange) {
		evt.data.control.handleChange(evt);
            } else {
		evt.data.control.stretchSketch.defaultRenderer(evt);
            }
        }
        this.controls = [];
        // remove all Controls (@{}) from jsvg, controls are stored as elements in controls, 
        // all parameters are initialized with defaultValues
        this.strippedText = this.fileText.replace(/@{(.*?)}/g, function(str, evalstr) {
	    var control = parseControlString(evalstr);
            // create (and assign) a variable
            parseVariable(control);
            // when in animation we don't need the controls.
            if (animation) return "";
            // id is always the var name with . replaced for _
            control.id = control["var"].replace(/\./g,"_");
	    control.stretchSketch = this;
            if (control.type == undefined || control.type.toLowerCase() === "numericfield") {
                control.element = $('<div class="controlline inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <input type="text" id="'
                	  + control["id"] +'" value="' + control["defaultvalue"] + '" size="' + control["size"] + '"></div></div>');
                $('#' + control['id'], control.element).bind('change', {control : control}, function(event) {
                    handleChange(event);
                }); 
            } else if (control.type.toLowerCase() === "textfield") {
                control.element = $('<div class="controlline inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <input type="text" id="'
                	  + control["id"] + '" value="' + control["defaultvalue"] + '" size="' + control["size"] + '"></div></div>');
	        $('#' + control['id'], control.element).bind('change', {control : control}, function(event) {
                    handleChange(event);
                });
            } else if (control.type.toLowerCase() === "password") {
                control.element = $('<div class="inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <input type="password" id="'
                + control["id"] + '" value="' + control["defaultvalue"] + '" size="' + control["size"] + '"></div></div>');
                $("#" + control["id"], control.element).bind('change', {control : control}, function(event) {
		    handleChange(event);
                });
            } else if (control.type.toLowerCase() === "display") {
                control.element = $('<div class="inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <span id="' 
	          + control["id"] + '"></span></div>');

	    } else if (control.type === "slider") {
	        var mySlider = $('<div class="controlline inputline"><div class="inputlabel">' + control.label + ':</div><div class="slider-control-value">' + control.defaultvalue + '</div>'
				     + '<div id="' + control.id + '"></div></div>');
	        $("#"+control.id, mySlider)
		  .slider({ min: parseFloat(control.min)
		          , max: parseFloat(control.max)
		          , step: parseFloat(control.step)
		          , value:parseFloat(control.defaultvalue) });
		control.element = mySlider;
		mySlider[0].data = control.defaultvalue;
	    	mySlider.bind("slide", {control: control }, function(event, ui) {
		    event.stretchSketchValue = ui.value;
		    this.data = ui.value;
		    $('.slider-control-value',  $('#' + event.data.control["id"]).parent()).html(ui.value);
		    if(event.data.control.handleChange) {
		        event.data.control.handleChange(event);
		    } else {
		        event.data.control.stretchSketch.defaultRenderer(event);
		    }
		});
            } else if (control.type.toLowerCase() === "checkbox") {
                control.element = $('<div class="inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <input type="checkbox" id="'
	            + control.id + '" ' + (control["defaultvalue"] === 'true' ? 'checked' : '') + ' value="true"/></div></div>').bind('change', {control :control}, function(event) {
                  event.target.value = event.target.checked;
                  handleChange(event);
	      });
            } else if (control.type.toLowerCase() === "button") {
                control.element = $('<div class="inputline"><div class="button" id="' + control.id + '">' + control["label"] + '</div></div>');
	        $("#"+control.id,control.element).click({'function': control['function']}, function (evt) {
		//  MS IE fuckup all other browsers accept data.function
		    eval(evt.data["function"]);
	        });
            } else if (control.type.toLowerCase() === "unit") {
                control.id="units";
		control["defaultValue"] = control["defaultValue"] || "mm";
		var unitsOfMeasurement = {mm:1,cm:10,inch:25.4};
		var optionString = ''
		for (var label in unitsOfMeasurement) {
		    var value = unitsOfMeasurement[label]
		    optionString += '<option value="' + value + '"'  
			+ ( control.stretchSketch.unitConversion === control["defaultvalue"] ? ' selected>' : '>') + label +'</option>';
		    };
                control.element = $('<div class="inputline"><div class="inputlabel">' + control["label"] + ':</div><div class="inputfield"> <select id="' + control.id + '">' + optionString + '</select></div></div>');
		  $('#units', control.element).bind('change', {control :control}, function(event) {
                  control.stretchSketch.unitConversion = 1/parseFloat($(this).attr('value'));
 		  $('.slider-control-value').each(function (index, elem) {
		      $(elem).html((parseFloat($(elem).parent()[0].data) * control.stretchSketch.unitConversion).toFixed(2));
		  });
	          control.stretchSketch.controls.forEach(function(ctrl) { 
		      $('.slider-control-value', ctrl.element) });
	      });
            } 
            this.controls.push(control);
	    return "";
        }.bind(this));
    }

    function parseVariable(attributes) {
        var variables = attributes["var"].split(".");
        var variableName = "";
        for (var i=0;i<variables.length;i++) {
       	    variableName += (i > 0 ? "." : "") + variables[i];
    	    if (i < variables.length-1) {
    	        try {
    		    if (typeof (eval(variableName)) === 'undefined') {
        	        eval(variableName + "= {};");
    		    }
    	        } catch (err) {
    		    eval(variableName + "={};");
    	        }
    	    } else {
    	        if ("textfield.password".indexOf(attributes["type"]) == -1) {
		    var a = variableName + '=' + attributes["defaultvalue"];
    		    eval(variableName + '=' + attributes["defaultvalue"]);
    	        } else {
    		    eval(variableName + '="' + attributes["defaultvalue"] + '"');
    	        }
    	    }
       	}
        return variableName;
    }
    StretchSketch.prototype.evalJSVG = function () {
        var result = this.strippedText.replace(/[^:]\/\/.*$/mg, "");
        result = result.replace(/\r\n?|\n/g, "");
        result = result.replace(/&gt;/g, ">");
        result = result.replace(/&lt;/g, "<");
        //some how new line characters are not appreciated in javascript's eval
        result = result.replace(/--{.*?}/g, "");
        // because we retrieve the text with .html() instead of .text, the &gt and &lt are not recognized by the javascript's eval.
        result = result.replace(/\${(.*?)}\$/g, function(str, evalstr) {
            try {
                eval(evalstr);
            } catch (error) {
		console.log("erorror =s " + error + evalstr);
//               alert("error on " + error + ' >>>' + evalstr);
            }
            // gets evaluated but returns empty string, used for declarations.
            return "";
        });
        result = result.replace(/#{(.*?[^\\])}/g, function(str, evalstr) {
            var result2;
                try {
     	   evalstr = evalstr.replace(/\\}/g, '}');
               result2 = eval(evalstr);
            } catch (error) {
		console.log("eroror on " + error + ' evalstr ' + evalstr);
  //             alert("error on " + evalstr);
            }
                //allow only 3 digits significance
        	if (typeof(result2) == 'number') {
    	    result2 = parseFloat(result2).toFixed(3);
                } else {
        	    try {
        		result2 = result2.replace(/([\d\.e\-]+)/g, function(str2, evalstr2) {
    			result3 = parseFloat(evalstr2).toFixed(3);
                        if (result3 == 'NaN') {
        		    return str2;
        		}
        		//somehow the arc fails with numbers .000
        		result3 = result3.replace(/\.000/g, "");
        		return result3;
    					  });
                    } catch (x) {
        		return result2;
        	    }
        	}
    	return result2;
        });
        return result;
    }
    return StretchSketch;
})()
    

// MS IE fuckup.
if (!Array.prototype.forEach) { 
    Array.prototype.forEach = function(fn, callback) { 
	for (var i = 0; i < this.length; i++) {
	    fn.call(callback || null, this[i], i, this); 
	}
    };
}

timers = {
   timerID: 0
   , runCount : 0
   , startTime : 0
   , timers: []
   , slideIndex : 0 
   , callList: []
   , animationList: []
   , startOver: true
   , add: function(fn) { this.timers.push(fn); }
   , queue: function (sts) {
        this.animationList.push(sts);
     }
   , animate: function(sketch, restart) {
                  (function() {
		      var theTime = new Date().valueOf() - timers.startTime;
		      var init = theTime < (restart || 80);
		      for (var theVar in sketch.timePoints) {
		          if (!sketch.timePoints.hasOwnProperty(theVar) || !sketch.timePoints[theVar]) {
		                   continue;
		          }
		          var timePoints = sketch.timePoints[theVar];
		          var lastIndex = timePoints[0].lastIndex || 0;
		          if (lastIndex >= timePoints.length -1) {
		              timePoints[0].currentValue = parseFloat(timePoints[lastIndex].value);
		          } else { 
		              for (var i = lastIndex; i<timePoints.length && theTime >= timePoints[i].time;i++) ;
		      	      lastIndex = i-1;
		      	      if (lastIndex >= timePoints.length - 1) {
		      	          timePoints[0].currentValue = parseFloat(timePoints[lastIndex].value);
		      	      } else {
		      	          timePoints[0].currentValue = timePoints[lastIndex].value
		          	  	     + (timePoints[lastIndex+1].value - timePoints[lastIndex].value)
		          	  	        * (theTime-timePoints[lastIndex].time) / (timePoints[lastIndex+1].time - timePoints[lastIndex].time);
		              }
		          }

		          eval (theVar + '=' + timePoints[0].currentValue);
		      }
		      if (init && sketch.init) sketch.init(sketch);
		      sketch.stretchSketch.defaultRenderer();
		      if (theTime < sketch.endTime) {
			  timers.timerID = setTimeout(arguments.callee, restart);
	              } else {
			  timers.timerID = 0;
			  timers.nextSketch(restart);
		      }
  	          })();
     }
   , nextSketch: function(restart) {
	if (this.timerID) return;
	if (this.slideIndex >= this.animationList.length) { 
	    if (this.startOver) {
                timers.runCount++;
		console.log('starting over count:' + timers.runCount);

		this.slideIndex = 0;
	    } else {
		return;
	    }
	}
	var animationElement = this.animationList[this.slideIndex++];
	var endTime = 0;
        if (timers.runCount == 0) {
	    for (var theVar in animationElement.timePoints) {
	        if (animationElement.timePoints.hasOwnProperty(theVar)) {
                var timePoints = animationElement.timePoints[theVar].split(/ ?, ?/)
		    .map(function(elem) { var a = elem.split(/ ?: ?/); return {time: parseFloat(a[0]), value: parseFloat(a[1])}})
                        .sort(function(een,twee) { return een.time - twee.time });

		if(timePoints[0].time > 0) { timePoints.unshift({time:0, value:0}); }
		var lastTime = timePoints[timePoints.length-1].time;
		endTime = lastTime > endTime ? lastTime : endTime;
		animationElement.timePoints[theVar] = timePoints;
	    }
	  }
        }
	if (!animationElement.endTime) { 
	    animationElement.endTime = endTime;
	}
	timers.startTime = new Date().valueOf();
        animationElement.stretchSketch.initRenderer();
	timers.animate(animationElement, restart || 80);
    }
   , stop: function() {
   	 clearTimeout(this.timerID);
	 this.timerID = 0;
   } 
};
