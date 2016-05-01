/*
 * Copyright 2010 Jeroen Dijkmeijer.
 *
 * Licensed under the GPL, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * http://www.fsf.org/licensing/licenses/gpl.txt
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
Array.prototype.peek = function() {
    return this[this.length-1];
}
var utils = function(){
  "use strict";

  var _class2type = {};
  var hasOwn = _class2type.hasOwnProperty;
  var _type = function( obj ) {
    return obj == null ?
      String( obj ) :
      _class2type[ Object.prototype.toString.call(obj) ] || "object";
  };

  var _isWindow = function( obj ) {
    return obj != null && obj == obj.window;
  };

  var _isFunction = function(target){
    return Object.prototype.toString.call(target) === "[object Function]";
  };

  var _isArray =  Array.isArray || function( obj ) {
      return _type(obj) === "array";
  };

  var _isPlainObject = function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || _type(obj) !== "object" || obj.nodeType || _isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
  };

  var _extend = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !_isFunction(target) ) {
      target = {};
    }

    if ( length === i ) {
      target = this;
      --i;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if ( deep && copy && ( _isPlainObject(copy) || (copyIsArray = _isArray(copy)) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && _isArray(src) ? src : [];

            } else {
              clone = src && _isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = _extend( deep, clone, copy );

          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }
    // Return the modified object
    return target;
  };

    var _hypotenuse = function(v) {
	v = _extend({x:0,y:0}, v);
	return Math.sqrt((v.x * v.x) + (v.y * v.y));
    }

  return {
      class2type: _class2type,
      type: _type,
      isWindow: _isWindow,
      isFunction: _isFunction,
      isArray: _isArray,
      isPlainObject: _isPlainObject,
      extend: _extend
      , dot : function (v1,v2){
	  return (v1.x*v2.y) + (v1.y*v2.x)
      }
      , EPSILON : parseFloat("1e-10")
      , hypotenuse : _hypotenuse
      , diag : _hypotenuse
      , normalized: function(v) {
	  var d = _hypotenuse(v);
	  v = _extend({x:0, y:0}, v);
	  return {x:v.x/d, y:v.y/d}
      }
  }
}();

Function.prototype.curry = function() {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function() {
	return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};

function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

function mod(m, n) {
    var result =  ((m % n) + n) % n;
    return result;
}

 function isNumber(n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
 }

 // addMethod - By John Resig (MIT Licensed)
 function addMethod(object, name, fn){
     var old = object[ name ];
     if ( old )
	 object[ name ] = function(){
	     if ( fn.length == arguments.length )
		 return fn.apply( this, arguments );
	     else if ( typeof old == 'function' )
		 return old.apply( this, arguments );
	 };
     else
	 object[ name ] = fn;
 }

function partialBezier(array, percent, startPoint) {
        interpolate = function interp (percent, p0, p1) {
	    return  {x: p0.x + (p1.x - p0.x) * percent
		    , y: p0.y + (p1.y - p0.y) * percent};
        };
	if (array.length < 2) {
		alert("error on partial Bezier");
		return [{x: 0, y:0}, {x: 0, y: 0} , { x: 0, y:0 }];
	}
	if (startPoint == null) {
		startPoint = array[0];
		array[0] = {x:0, y:0};
	}
	var subresult = [];
	if (array.length == 2) {
		crossPoint = interpolate(1-percent, array[0], array[1]);
		return [array[0], crossPoint, array[1]];
	}
	for (i = 0; i< array.length-1; i++) {
		subresult.push(interpolate(1-percent, array[i], array[i+1]));
	}
	return partialBezier(subresult, percent, startPoint).concat(subresult);
};

Number.prototype.between = function (min, max) {
    return this > Math.min(min,max) && this < Math.max(min,max);
};


 // 
iPath = function () {
    this.path = []; this.location={x:0,y:0}; this.heading=0; this.labels={};this.lineCache = {};
};
 iPath.prototype.type = 'iPath';
 iPath.cs = "CS"; //coordinate system
 iPath.cartesian = "cartesian";
 iPath.polar = "polar";
 iPath.alpha = "a";
 iPath.Alpha = "A";
 iPath.radius = "r";
 iPath.settings = {};
 iPath.bezierTolerance = 0.11;
 iPath.prototype.utilFunctions = {};
 
 addMethod(iPath.prototype, 'travel', function( pt, prefix) {
     if (typeof pt === "object") {
       pt.prefix = prefix;
       if (!pt[iPath.cs] || pt[iPath.cs] !== iPath.cartesian) {
	  pt = utils.extend(true, {x:0, y:0}, pt);
       }
       this.path.push(pt);
       return this;
     } else if (prefix === 'Circle' && typeof pt === 'number') {
	 this.path.push({prefix: 'circle', r: pt});
	 return this;
     }
 });

 addMethod(iPath.prototype, 'travel', function travel ( x, y, prefix) {
       if (!isNumber(x) || !isNumber(y)) {
	   throw { name: "Invalid number", level: "critical"} ;
       }
     this.path.push(utils.extend(true, {x: 0, y:0}, {x: x
		       , y: y
		       , prefix: prefix}));
       return this;
     });

 // Method used for updating current element on path list. 
 // The values are *replaced* with the values of the passed argument.
 // if Path List is empty nothing happens.
 addMethod(iPath.prototype, 'peekChange', function peekChange(pt) {
     if (typeof pt === "object") {
       pt.prefix = prefix;
       if (!pt[iPath.cs] || pt[iPath.cs] !== iPath.cartesian) {
	  pt = utils.extend(true, {x:0, y:0}, pt);
       }
       this.path.push(pt);
       return this;
     }
 });
 addMethod(iPath.prototype, 'modify', function travel ( x, y, prefix) {
       if (!isNumber(x) || !isNumber(y)) {
	   throw { name: "Invalid number", level: "critical"} ;
       }
       this.path.push(utils.extend(true, {x: 0, y:0}, {x: x
		       , y: y
		       , prefix: prefix}));
       return this;
     });

addMethod(iPath.prototype, 'store', function(label) {
	this.path.push({prefix: "store", label: label});
	return this;
    });

addMethod(iPath.prototype, 'line2Label', function(lbl, dlta) {
	this.path.push({prefix: "line2Label", label: lbl, delta: dlta ? dlta : {x:0, y:0}, prf: 'l'});
	return this;
    });
addMethod(iPath.prototype, 'move2Label', function(lbl, dlta, prfx) {
	this.path.push({prefix: "line2Label", label: lbl, delta: dlta ? dlta : {x:0, y:0}, prf: 'm'});
	return this;
    });

addMethod(iPath.prototype, 'repeat', function(times) {
	this.path.push({prefix: "repeat", nrof: times});
	return this;
    });
addMethod(iPath.prototype, 'move', function (x, y) {
	return this.travel(x,y, 'm');     
    });
addMethod(iPath.prototype, 'move', function (pt) {
	return this.travel(pt, 'm');     
    });
addMethod(iPath.prototype, 'Move', function (x, y) {
	return this.travel(x,y, 'M');     
    });
addMethod(iPath.prototype, 'Move', function (pt) {
	return this.travel(pt, 'M');     
    });
addMethod(iPath.prototype, 'turtleLine', function (pt) {
	pt[iPath.cs] = iPath.polar;
	return this.travel(pt, 'l');
    });
addMethod(iPath.prototype, 'turtleMove', function (pt) {
	pt[iPath.cs] = iPath.polar;
	return this.travel(pt, 'm');
    });
addMethod(iPath.prototype, 'arc', function(x,y,opts) {
    opts.x = x;
    opts.y = y;
    return this.travel(opts,'a');
});
addMethod(iPath.prototype, 'arc', function(pt) {
    return this.travel(pt,'a');
});
addMethod(iPath.prototype, 'turtleBezier', function (pt) {
	pt[iPath.cs] = iPath.polar;
	return this.travel(pt, 'c');
    });
addMethod(iPath.prototype, 'rectBezier', function (pt, options) {
	var settings = utils.extend({ xFact: 1
				  , yFact: 1
				  , angle: 0}
	    , options || {});
	var bez1;
	(bez1 = new iPath()).bezier(0,  (settings.yFact * pt.y),  (pt.x/2 - settings.xFact * pt.x/2),  pt.y,  pt.x/2,  pt.y).concat(bez1.reverse(bez1).reflect({y:1})).rotate(settings.angle);
	return this.concat(bez1);
    });
addMethod(iPath.prototype, 'line', function (x, y) {
	return this.travel(x,y, 'l');     
    });
addMethod(iPath.prototype, 'line', function (pt) {
	return this.travel(pt, 'l');     
    });
addMethod(iPath.prototype, 'Line', function (x, y) {
	return this.travel(x,y, 'L'); 
    });
addMethod(iPath.prototype, 'Line', function (pt) {
	return this.travel(pt, 'L');     
    });
addMethod(iPath.prototype, 'circle', function (r) {
	return this.travel(r, 'Circle');     
    });
// 

iPath.prototype.log = function() {
    rad2Degrees = function(rad) {
	return rad/Math.PI * 180;
    }
    var element = this.path.slice(-1)[0];
    if (element instanceof iPath) {
	return 'iPath';
    } else {
	if (element[iPath.cs] == iPath.polar) {
	    return '{ r: ' + element.r + ',  a: ' + (element.A != undefined ? rad2Degrees(element.A) : rad2Degrees(element.a))  + '}';
	} else {
	    return '{ x: ' + element.x + ',  y: ' + element.y + '}';
	}
    }
}


iPath.prototype.utilFunctions= {normalize: function(v) {
                                     var hypotenuse = Math.sqrt((v.x * v.x) + (v.y * v.y));
                                     return {x: v.x/hypotenuse, y:v.y/hypotenuse};
                                }
				, reverse: 
		      { controlPoint : function (endPoint, controlPoint) {
    var ep = utils.extend(true, {x:0, y:0}, endPoint);
    var cp = utils.extend(true, {x:0, y:0}, controlPoint);
    return { x: cp.x - ep.x, y: cp.y - ep.y };
		      },
			point : function(point) {
    var element = utils.extend(true, {}, point);
    if (element.cp2 && element.cp1) {
	var temp = element.cp1;
	element.cp1 = element.cp2;
	element.cp2 = temp;
    } 
    if (element.cp1) {
	element.cp1 = this.utilFunctions.reverse.controlPoint({x: element.x, y:element.y}, element.cp1);
    }
    if (element.cp2) {
	element.cp2 = this.utilFunctions.reverse.controlPoint({x: element.x, y:element.y}, element.cp2);
    }
    element.x *= -1;
    element.y *= -1;
    return element
			}}};


iPath.prototype.reverse= function(arg) {
    var clone = true;
    var target;
    if (arguments.length === 0 || arg.type !== this.type) {
	target = this;
	clone = false;
    } else {
	target = arg;
    }
    var resultPath = [];
    for (var i=target.path.length-1;i>=0;i--) {
	if (target.path[i] instanceof iPath) {
	    if (clone) {
		resultPath.push(new iPath().reverse(target.path[i]));
	    } else {
		resultPath.push(target.path[i].reverse());
	    }
	    continue;
	}
	// if target.path[i] is instance of iPath code below is never reached.
        // 
        //   ________ _  _  _
        //           \ ) a    new iPath().line(x,0),turtleLine({a:a, r:r}).line(x,y);               x: -x, y: -y
        //            \  /                                                                          a: Math.Pi - a - atan2(y,x), r: r
        //             \/_)_b_  resulting = Math.Pi - a - b                                         x: -x, y: 0

        //       __                                                                                 a: - endHeading, r:r3
        //   \  /     turtleLine({a: a1, r:r1}).turtleLine({a:a2, r:r2}).turtleLine({a:a3, r:r3})   a: -a3, r:r2
        //    \/                                                                                    a: -a2, r:r1
        //   reverse:
        //        probably the idede of iterating backwards is wrong. Better do a positive iteration and unshift elements on array, while keeping the heading.
        //        maybe integrate into the traverse builder paradigm.
        //
        var element = this.utilFunctions.reverse.point.call(this,target.path[i]);
	resultPath.push(element);
    }

    if (!clone) {
	this.path=resultPath;
	return this;
    } else {
	var result = new iPath();
	result.path = resultPath;
	return result;
    }
}




    iPath.prototype.iterate = function () { 
	var target;
	var clone = true;
	var args = Array.prototype.slice.call(arguments); //clone
	var fn = args[0];
	// not sure how to prevent the empty argument
	if (args.length === 1 || args[1].type !== this.type) {
	    target = this;
	    clone = false;
	} else {
	    target = args[1];
	}
	var resultPath = [];
	for (var i=0;i<target.path.length;i++) {
	    if (target.path[i] instanceof iPath) {
	        if (this.previousPoint) {
		    target.path[i].previousPoint = this.previousPoint;    			
		}
		if (!clone) {
		    resultPath.push(fn.call(this, target.path[i]));
		} else {
		    resultPath.push(fn.call(this, target.path[i], target.path[i]));
		}
	    } else {
		var element = utils.extend(true, {}, target.path[i]);
		if (element.cp1) {
		    element.cp1 = fn.call(this, element.cp1);
		}
		if (element.cp2) {
		    element.cp2 = fn.call(this, element.cp2);
		}
		utils.extend(element, fn.call(this, element));
		resultPath.push(element);
	        this.previousPoint = element;

	    }
	}

	if (!clone) {
	    this.path=resultPath;
	    return this;
	} else {
	    var result = new iPath();
	    result.path = resultPath;
	    return result;
	}
    }

    
    iPath.prototype.reflect= function() {
	var args = Array.prototype.slice.call(arguments);
	var reflectionVector  = utils.extend(true, {x:0, y:0}, args.shift());
	var hypotenuse = Math.sqrt((reflectionVector.x * reflectionVector.x) + (reflectionVector.y * reflectionVector.y));
	// I'm almost sure the negation of x-attribute has a good reason..
	var normalizedReflectionVector = {x: -reflectionVector.x/hypotenuse, y:reflectionVector.y/hypotenuse};
	var reflectPoint = function (n) {
	    var args = Array.prototype.slice.call(arguments);
	    var pt = args.pop();
	    if (pt instanceof iPath) {
		return iPath.prototype.reflect.apply(pt, args);
	    }


	    if (pt[iPath.cs] === iPath.polar) {
	       if (pt['A'] !== undefined) {
	       	  return utils.extend(true, pt, {A:2*Math.atan2(n.y, -1*n.x) - pt.A});
	       }

     // // again negate the x-attribute.
     //    /               \  |  /
     //   /                 \ | /            /   |  \
     //  / ) -alpha          \|/            / -a | a \ 
     // o--------             o         ___/_ _  | _ _\___
     //  \ ) alpha
     //   \ 
     //    \
	       return utils.extend(true, pt, {a:- pt.a});
	    }
	    var dot = function (v1,v2){
		return (v1.x*v2.y) + (v1.y*v2.x);
	    }
	    var d = dot(pt,n);
	    return {
		x:pt.x -2 * d * n.y
		    , y:pt.y -2 * d * n.x
		    }
	}
	var partialFn = reflectPoint.curry(normalizedReflectionVector);
	args.unshift(partialFn);
	return this.iterate.apply(this, args);
    }

    iPath.prototype.mirror=iPath.prototype.reflect;

    iPath.prototype.skew= function() {
	var skew = function (sk, ya) {
	    var args = Array.prototype.slice.call(arguments); //clone
	    var pt = args.pop();
	    if (pt instanceof iPath) {
		// if last 2 elements are of type iPath, it is a functional call, 
		// if only last element is of type iPath it is a destructive call.
		return iPath.prototype.skew.apply(pt, args);
	    }
	    return {x : (ya-pt.y)*sk + pt.x* (1 - ya * sk)
		    , y : pt.y};
	}
	var args = Array.prototype.slice.call(arguments)
	,partialFn = skew.curry(args.shift(), args.shift());
	args.unshift(partialFn);
	return this.iterate.apply(this, args);
    }

    iPath.prototype.scale = function() {
	var skale = function (sc) {
	    var args = Array.prototype.slice.call(arguments); //clone
	    var pt = args.pop();
	    if (pt instanceof iPath) {
		// if last 2 elements are of type iPath, it is a functional call, 
		// if only last element is of type iPath it is a destructive call.
		return iPath.prototype.scale.apply(pt, args);
	    }
            if (typeof sc === 'object' && (sc.x && sc.y)) {
	       return { x: sc.x * pt.x, y: sc.y * pt.y };
	    } else {
	       return {x : sc * pt.x, 
		       y : sc * pt.y};
            }
	}
	var args = Array.prototype.slice.call(arguments)
	,partialFn = skale.curry(args.shift());
	args.unshift(partialFn);
	return this.iterate.apply(this, args);
    }

iPath.prototype.rotate= function() {
    console.log('rotate 1');
	var rotatePoint = function(pt, angle) {
	    return {x : (pt.x * Math.cos(angle) - pt.y* Math.sin(angle))
			, y : (pt.x * Math.sin(angle) + pt.y* Math.cos(angle)) }
	};
	rotateElement = function (angle) {
	    var args = Array.prototype.slice.call(arguments); //clone
	    var pt = args.pop();
	    if (pt instanceof iPath) {
		// if last 2 elements are of type iPath, it is a functional call, 
		// if only last element is of type iPath it is a destructive call.
		return iPath.prototype.rotate.apply(pt, args);
	    }
	    if (pt[iPath.cs] === iPath.polar) {
	        if ('A' in pt) {
	            return utils.extend(true, pt, {A: pt.A ? pt.A + angle : angle});
		} else if (!this.previousPoint) {
	            return utils.extend(true, pt, {a: (pt.a ? pt.a + angle : angle)});
		} else 
                return pt;
	    } else {
		var result = rotatePoint(pt, angle);
		if (pt.prefix == 'a') {
		    result.a1 = pt.a1 + angle;
		    result.a2 = pt.a2 + angle;
		    var center = rotatePoint({x: pt.cx,y: pt.cy}, angle);
		    result.cx = center.x;
		    result.cy = center.y;
		}
		return result;
	    } 
	}
    var args = Array.prototype.slice.call(arguments)
    ,partialFn = rotateElement.curry(args.shift());
    args.unshift(partialFn);
	return this.iterate.apply(this, args);
    }

    // Concat concattenates to iPaths. by just adding the whole other iPath as one element to the targets'(this) path.
    // Concat is purely imperative (destructive)
    iPath.prototype.concat= function(other) {
        if (other === undefined) {
	    // return this;
	} else if (other instanceof iPath && other.path.length > 0) {
  	    this.path.push(other);
	} else if (!other instanceof iPath) {
	    throw "incompatable concat arguments";
	}
	return this;
    }

    iPath.prototype._getEndLocation = function() {
	var result = {x:0,y:0};
	for (var i=0;i<this.path.length;i++) {
	    if (this.path[i].type === this.type) {
		var subResult = this.path[i]._getEndLocation();
		result.x += subResult.x;
		result.y += subResult.y;
	    }
	    result.x += this.path[i].x | 0;
	    result.y += this.path[i].y | 0;
	}
	return result;
    }

    iPath.prototype._direct = function(element) {
	if (element instanceof iPath) {
	    return element._direct(element.path[element.path.length-1]);
	} else { 
	    return element.cp2 ? {x:element.x - element.cp2.x, y:element.y - element.cp2.y} :
	    element.cp1 ? {x:element.x - element.cp2.x, y:element.y - element.cp2.y} : 
	    {x:element.x, y:element.y};
	}
    };
// A continuation of the bezier curve (comparable with S)
    iPath.prototype.smooth= function(weight, cp2x, cp2y, x, y) {
	var element = this.path[this.path.length-1];
	if (!(element && (element instanceof iPath || typeof element.x !== 'undefined' || typeof element.y !== 'undefined'))) {
	    throw { name: "smooth is not allowed previous element was not a movement", level: "critical"} ;
	}
	var cp1 = this._direct(element);
	this.path.push({prefix: 'c', cp1: {x: cp1.x * weight, y: cp1.y * weight}, cp2: {x: cp2x, y: cp2y}, x: x,y :y});
	return this;
    }

    iPath.prototype.bezier= function(cp1x, cp1y, cp2x, cp2y, x, y) {
	var bezier = {};
	if ((arguments.length % 2 == 1 && arguments.length > 1) || arguments.length > 6) {
	    throw "illegal number of arguments " + (arguments.length) + " for bezier function";
	}
	if (arguments.length > 2 && typeof cp1x === 'object') {
	    throw "illegal set of arguments for bezier function";
	}
	if (arguments.length === 1 && typeof cp1x === 'object') {
	    switch (Object.keys(cp1x).length) { 
	    case 3: cp1x.prefix = 'q'; break; 
	    case 4: cp1x.prefix = 'c'; break; 
	    default: throw "illegal set of arguments for bezier";
	    }
	    bezier = cp1x;
	}
	if (arguments.length === 6 || arguments.length === 4) {
	    bezier.x = arguments[arguments.length-2];
	    bezier.y = arguments[arguments.length-1];
	    bezier.prefix = 'q';
	    bezier.cp1 = {};
	    bezier.cp1.x = cp1x;
	    bezier.cp1.y = cp1y;
	    bezier.cp2 = {};
	    if (arguments.length === 6) {
		bezier.prefix = 'c';
		bezier.cp2.x = cp2x;
		bezier.cp2.y = cp2y;
	    } 
	}
	return this.travel(bezier, bezier.prefix);
    }

    iPath.prototype.cartesian2Polar = function(pt) {
	return { r: Math.sqrt(pt.x * pt.x + pt.y *pt.y), a: Math.atan2(pt.y, pt.x)};
    }

	iPath.prototype.cartesian2Cartesian = function(elem, builder) {
	return elem;
    }
iPath.prototype.polar2Cartesian= function(elem, builder, leaveHeading) {
    if(elem[iPath.cs] === iPath.cartesian) return elem;
    if(typeof elem[iPath.alpha] === 'undefined'  && typeof elem[iPath.Alpha] === 'undefined'
       && typeof elem[iPath.radius] === 'undefined') return elem;
    var result = utils.extend(true, {}, elem);  
    var oldHeading = builder.heading;
    if (typeof result[iPath.alpha] === 'number') {
	builder.heading += result[iPath.alpha];
    } else if (typeof result[iPath.Alpha] === 'number') {
	builder.heading = result[iPath.Alpha];
    }
    //heading remains unchanged (and r is not undefined)
    result.x = Math.cos(builder.heading) * result[iPath.radius];
    result.y = Math.sin(builder.heading) * result[iPath.radius];
    if (leaveHeading) builder.heading = oldHeading;
    return result;
}


Bezier2Poly = function (thresh){
    this.vertices = [];
    // threshold = used for converting the bezier2poly, discussable whether it should be maintained here.
    this.threshold = thresh;
    this.recurs = 0;
};

Bezier2Poly.prototype.calculateAngleBetweenVectors = function(v1, v2, easy) {
    var n1 = new iPath().utilFunctions.normalize(v1);
    var n2 = new iPath().utilFunctions.normalize(v2);
    var signy = function(key, val) {
	return val.toFixed ? Number(val.toPrecision(4)) : val;
    };
    if (easy) {
	return (Math.abs(n1.x-n2.x) + Math.abs(n1.y-n2.y));  
    } else {
	return Math.acos((n1.x * n2.x) + (n1.y * n2.y));
    }
}
    
//     var h1 = Math.sqrt((v1.x * v1.x) + (v1.y * v1.y));
//     var h2 = Math.sqrt((v2.x * v2.x) + (v2.y * v2.y));
//     var v1Norm = {x: v1.x/h1, y:v1.y/h1};
//     var v1Norm = {x: v1.x/h1, y:v1.y/h1};
//     return Math.acos((v1Norm.x * v2Norm.y) + (v1Norm.y * v2Norm.x));
// }

Bezier2Poly.prototype.iPath = function(array,init) {
    var vertices = this.convert(array.slice(0),init),
        result = new iPath();
    vertices.forEach(function(elem) {
        result.line(elem.x, elem.y);
    });
    return result;
}
Bezier2Poly.intersect = function(l1,l2) {
    var x1 = l1[0].x, x2=l1[1].x+l1[0].x, x3=l2[0].x, x4=l2[1].x+l2[0].x;
    var y1 = l1[0].y, y2=l1[1].y+l1[0].y, y3=l2[0].y, y4=l2[1].y+l2[0].y;
    var nominator = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
    if (nominator === 0) {
	return false;
    }
    var result = {x: (x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)/nominator,
		  y: (x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)/nominator};
    return result;
};

Bezier2Poly.prototype.filletConvert = function(array, init) {
    return this.convert(array, init, function(result,a_rray) {
	var crosspoint = Bezier2Poly.intersect([{x:0,y:0},a_rray[0]],[a_rray[2],{x:a_rray[2].x-a_rray[1].x, y:a_rray[2].y-a_rray[1].y}]);
	if (crosspoint) {
	    crosspoint.fr = 0;
	    result.push(crosspoint);
    	    result.push({ x:a_rray[2].x-crosspoint.x, y:a_rray[2].y-crosspoint.y});
	}
    });
};

Bezier2Poly.prototype.convert = function(array, init, func) {
    func = typeof func !== 'undefined' ? func : function(result, a_rray) { result.push(a_rray[2]); };
    if (init) {
	this.vertices = [];
	this.recurs = 0;
    }
    if (!this.threshold) {
	return;
    }
    if (!init && (Math.abs(this.calculateAngleBetweenVectors(array[0], array[2], true)) < this.threshold 
		  && Math.abs(this.calculateAngleBetweenVectors({x:array[2].x-array[1].x, y:array[2].y-array[1].y}, array[2],true)) < this.threshold)) {
	// this.vertices.push(array[2]);
	func(this.vertices, array);
    } else {
	var split = this.splitBezier(array);
	this.convert(split.b1,false,func);
	this.convert(split.b2,false,func);
    }
    return this.vertices;
}
Bezier2Poly.prototype.interpolate = function (p0, p1, percent) {
    if (typeof percent === 'undefined') percent = 0.5;	
    return  {x: p0.x + (p1.x - p0.x) * percent
	     , y: p0.y + (p1.y - p0.y) * percent};
}

Bezier2Poly.prototype.normalize = function(v) {
    var hypotenuse = Math.sqrt((v.x * v.x) + (v.y * v.y));
    return {x: v.x/hypotenuse, y:v.y/hypotenuse};
}
// returns an object containing properties b1 & b2 each holding an array representing the either side of the split argument.
// be aware that the argument is destructively modified. Call splitBezier(array.slice(0)) if you need to keep the original array.
//
Bezier2Poly.prototype.splitBezier = function(array, perc) {
    array.unshift({x:0, y:0});
    var coll = [];
    while (array.length > 0) {
	for (var i = 0;i < array.length-1; i++) {
	    coll.unshift(array[i]);
	    array[i] = this.interpolate(array[i], array[i+1], perc);
	}
	coll.unshift(array.pop());
    }
    return {b1: [{x:coll[5].x, y:coll[5].y}, {x:coll[2].x, y:coll[2].y},{x:coll[0].x, y:coll[0].y}]
	    , b2: [{x:coll[1].x - coll[0].x,y:coll[1].y-coll[0].y}, {x:coll[3].x - coll[0].x,y:coll[3].y-coll[0].y}, {x:coll[6].x - coll[0].x,y:coll[6].y-coll[0].y}]};
}

function PathBuilder() {
    this.prevPrefix = "";
    this.location={x:0, y:0};
    this.significance = 3;
    this.path="";
    this.moveCache = [];
    this.heading=0.0;
    this.length=0;
}

PathBuilder.prototype.preProcess = function(iPath, element) { return true; };
PathBuilder.prototype.postProcess = function(iPath, element) { return true; };

PathBuilder.prototype.signify = function(number) {
    if (!isNumber(number)) {
	return number;
    } else {
	var result = number.toFixed(this.significance);
	return result.replace(/\.?0+$/, "").replace(/^-0$/,0);
    }
}

PathBuilder.prototype.move = function(pt, absolut) {
    pt = utils.extend(true,{x:0, y:0, absolute: absolut }, pt);
    this.moveCache.push(pt);
}

PathBuilder.prototype.ditchAllButLastAbsoluteAndEverythingAfter = function(array, ditchAbsolute) {
    var result = [];
    array.forEach(function(elem) { 
	    if (elem.absolute) {
		result = [];
	    }
	    if (! (ditchAbsolute && elem.absolute)) { result.push(elem); }
	}, this);
    return result;
}


// returns the movement object as {relative: {x: xrel, y:yrel}, absolute: {x: xabs, y:yabs}}
// cache for moves is emptied;
PathBuilder.prototype.prepareFlush = function (start) {
    var absolute, relative = {x:0, y:0}, relativeTouched=false, resetLocation = false;
    this.moveCache = this.ditchAllButLastAbsoluteAndEverythingAfter(this.moveCache, typeof start !== 'undefined');
    // startPt as argument for rendering overrides the embedded startPt, needs to reset the location.
    if (start) {
	absolute = utils.extend({x:0, y:0}, start || {});
	resetLocation = true
	this.location.x = absolute.x;
	this.location.y = absolute.y;
    }
    if (this.moveCache.length) {
	this.moveCache.forEach(function(pt) { 
		if (pt.absolute) {
		    resetLocation = true;
		    absolute = pt;
		    relative =  {x:0, y:0};
		} else {
		    relativeTouched = true;
		    relative.x += pt.x; 
		    relative.y += pt.y; 
		    if (resetLocation) {
			this.location.x += pt.x;
			this.location.y += pt.y;
		    }
		}}, this);
    }
    this.moveCache = [];
    return {absolute: absolute, relative: relativeTouched ? relative : undefined};
}


svgBuilder = function(snfc) { 
    PathBuilder.apply(this);
    // http://stackoverflow.com/q/8724427/288190
    if (snfc) { this.significance = snfc; }
};

svgBuilder.prototype = new PathBuilder();

svgBuilder.prototype._flush = function (start) {
	var moves = this.prepareFlush(start);
	var prefix='m', x=0,y=0;
	if (moves.relative) {
	    x = moves.relative.x;
	    y = moves.relative.y;
	}
	if (moves.absolute) {
	    prefix='M';
	    x += moves.absolute.x;
	    y += moves.absolute.y;
	}
	if (x || y) {
	    this.path += ' ' + prefix +' '+ this.signify(x) + ' ' + this.signify(y);
	    this.prevPrefix = "";
	}
}

svgBuilder.prototype.circle = function(r) {
    this._flush();
    this.path += " m " + r + " 0 a " + r + "  " + r + " 0 1 0 " + -2*r + " 0 a " + r + "  " + r + " 0 1 0 " + 2*r + " 0 m -" + r + " 0 ";
}

svgBuilder.prototype.lineMove = function(point) {
        var pt = utils.extend(true, {x:0, y:0,prefix: 'l'}, point);

	if (pt.prefix === 'm') {
	    this.move(pt, false);
	} else if (pt.prefix === 'M') {
	    this.move(pt, true);
	} else {
	    this._flush();
            if (this.lengthLimit && !point.length) {
               point.length = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
            }
            if (this.lengthLimit && this.length + point.length >= this.lengthLimit) {
                var perc = (this.lengthLimit - this.length) / point.length;
                pt.x *= perc;
                pt.y *= perc;
                this.finished = true;
            } else {
                this.length += point.length;
            }
	    this.path += (pt.prefix !== this.prevPrefix ? " " + pt.prefix : '') + " " + this.signify(pt.x) + " " + this.signify(pt.y);
	}
	this.prevPrefix = pt.prefix;
}
svgBuilder.prototype.arc = function(el) {
    this._flush();
    this.path += " a " + this.signify(el.r) + " " + this.signify(el.r) + " 0 " + (el.large_arc ? "1" : "0") + " " + (el.reverse ? 1 : 0) + " " + this.signify(el.x) + " " + this.signify(el.y) + " ";
    this.prevPrefix = el.prefix;
}

svgBuilder.prototype.bezier = function(pt) {
    this._flush();
    if (this.lengthLimit && !pt.length) {
       var vertices = new Bezier2Poly(iPath.bezierTolerance).iPath([ {x: pt.cp1.x, y: pt.cp1.y}, {x: pt.cp2.x, y: pt.cp2.y}, {x: pt.x, y: pt.y}]);
       pt.length = vertices.length();
    }
    if (this.lengthLimit && (this.length + pt.length >= this.lengthLimit)) {
       var perc = (this.lengthLimit - this.length) / pt.length;
       this.finished = true;
       this.path += " " + vertices.dPath(this.significance, perc);
       return;
    }
    this.length += pt.length;
    this.path += (this.prevPrefix !==  pt.prefix ? " " + pt.prefix :  "")
    + (pt.prefix === 'q' 
       ? " " + (pt.cp1.x ? this.signify(pt.cp1.x) : 0) + " " + (pt.cp1.y ? this.signify(pt.cp1.y) : 0) 
       : (pt.prefix === 'c' 
	  ? " " + (pt.cp1.x ? this.signify(pt.cp1.x) : 0) + " " + (pt.cp1.y ? this.signify(pt.cp1.y) : 0)
	  + " " + (pt.cp2.x ? this.signify(pt.cp2.x) : 0) + " " + (pt.cp2.y ? this.signify(pt.cp2.y) : 0) 
	  : ""))
    + " " + (pt.x ? this.signify(pt.x) : 0) + " " + (pt.y ? this.signify(pt.y) : 0);
    this.prevPrefix = pt.prefix;
}

lengthBuilder = function(tol) { 
    this.length = 0;
    PathBuilder.apply(this);
    this.tolerance = tol || 0.2;
};

lengthBuilder.prototype = new PathBuilder();

lengthBuilder.prototype.lineMove = function(pt) {
    if (pt.prefix === 'l') {
        this.length += Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    }
}

lengthBuilder.prototype.bezier = function(pt) {
    var b2p = new Bezier2Poly(this.tolerance);
    var array = [{x:pt.cp1.x || 0, y:pt.cp1.y || 0}, {x:pt.cp2.x || 0, y:pt.cp2.y ||0}, {x:pt.x || 0, y:pt.y || 0}];
    var vertices = b2p.iPath(array, true);
    this.length += vertices.length();
}

iPath.prototype.dPath= function(significance, perc) {
    var builder = new svgBuilder(significance);
    if (perc === '0' || perc === 0) {
        return '';
    } else if (perc) {
        if (!this.totalLength) {
	   this.totalLength = this.length();
        }
	builder.lengthLimit = perc * this.totalLength;
    }
    builder.finished = false;
    this.traverse(builder);
    this.heading = builder.heading;
    this.location = builder.location;
    builder.moveCache=[];
    return builder.path;
}

reverseBuilder = function(tol) { 
    resultPath = [];
    PathBuilder.apply(this);
};

reverseBuilder.prototype = new PathBuilder();

reverseBuilder.prototype.lineMove = function(pt) {
    if (pt.prefix === 'l') {
        this.length += Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    }
}

reverseBuilder.prototype.bezier = function(pt) {
     reverseControlPoint = function (endPoint, controlPoint) {
         var ep = utils.extend(true, {x:0, y:0}, endPoint);
         var cp = utils.extend(true, {x:0, y:0}, controlPoint);
         return { x: cp.x - ep.x, y: cp.y - ep.y };
     }
}

iPath.prototype.traverseReverse=function() {
    var builder = new ReverseBuilder();
}
iPath.prototype.length= function(tolerance) {
    var lb = new lengthBuilder(tolerance);
    this.traverse(lb);
    return lb.length;
}

Blobber = function(){
//    this.text="";
    // new Blob (replacing BlobBuilder)  can only be instantiated with array
    this.arrayText = [];
}
Blobber.prototype.prepend= function(txt){
    this.arrayText.unshift(txt);
}

Blobber.prototype.append= function(txt){

//    this.text += txt;
    this.arrayText.push(txt);
}
Blobber.prototype.isVirgin= function(){
    return (this.arrayText.length == 0);
}

// now for testing purposes since the BlobBuilder has been taken out.
Blobber.prototype.getText= function(){
    return this.arrayText.join("");
}



iPath.prototype.traverse = function(builder) {
    for (var i=0;i<this.path.length;i++) {
        if (builder.finished) {
	    return;
        }
	if (!builder.preProcess(this, this.path[i]) ) {
            continue;
	}
	var newHeading = builder.heading;
	if (this.path[i] instanceof iPath) {
	    this.path[i].traverse(builder);
	    continue;
	}
	var element = utils.extend({ x: 0, y: 0 }, this.path[i]);
	
	var converter = this.cartesian2Cartesian;
	if (element.prefix.indexOf('repeat') != -1) {
	    if (element.prefix === 'repeat') {
		this.path[i].prefix = 'repeating';
		for (var repeatWalker = 1;repeatWalker<element["nrof"];repeatWalker++) {
		    this.traverse(builder);
		}
		this.path[i].prefix = 'repeat';
	    } else {
		return;
	    }
	}
	if (element.prefix.indexOf('store') != -1) {
	    this.labels[element.label] = { location: utils.extend({}, builder.location), heading: utils.extend({},builder.heading) };
	    continue;
	}
	if (element.prefix.indexOf('line2Label') != -1) {
	    element.prefix=element.prf;
	    var pt = this.labels[element.label].location;
	    var dlt = element.delta;
	    element.x = pt.x - builder.location.x + dlt.x;
	    element.y = pt.y - builder.location.y + dlt.y;
	} 
	if (element.prefix.indexOf('circle') != -1) {
	    builder.circle(element.r);
	}
	if (element[iPath.cs] === iPath.polar) {
	    converter = this.polar2Cartesian;
	    element = converter.call(this,element, builder, ('cCqQ'.indexOf(element.prefix) != -1));
	}
	if ('mMlL'.indexOf(element.prefix) != -1) {
	    if (element.x || element.y) {
		builder.lineMove(element);
		//		result += (this.dPathData._prevPrefix !==  element.prefix ? " " + element.prefix :  "") + " " + signify(element.x, significance) + " " + signify(element.y, significance); 
		//		  result += (prevPrefix !==  element.prefix ? " " + element.prefix :  "") + " " + (element.x ? signify(element.x, significance) : 0) + " " + (element.y ? signify(element.y, significance) : 0); 
	    }
	} 
	if (element[iPath.cs] !== iPath.polar && (element.x || element.y)) { builder.heading = Math.atan2(element.y || 0, element.x || 0); }
	if (element.prefix === 'c' || element.prefix === 'q') {
	    if (element.cp1) { 
		element.cp1 = converter.call(this, element.cp1, builder);
		// 		  if (typeof element.cp1.a !== 'undefined') {
		// 		      newHeading = this.heading + element.cp1.a;
		// 		  } else if (element.cp1.x || element.cp1.y) { 
		// 		      newHeading = Math.atan2(element.cp1.y || 0, element.cp1.x || 0); 
		// 		  }
	    }
	    if (element.cp2) { 
		element.cp2 = converter.call(this, element.cp2, builder, true); 
		if (typeof element.cp2.a !== 'undefined') {
		    builder.heading += element.cp2.a + Math.PI;
		} else if (element.cp2.x || element.cp2.y) { 
		    builder.heading = Math.atan2(element.y || 0 - element.cp2.y || 0, element.x || 0 - element.cp2.x || 0) + Math.PI
		}
	    }
	    if (element[iPath.cs] === iPath.polar) {
		element.cp2.x = element.x + element.cp2.x;
		element.cp2.y = element.y + element.cp2.y;
	    }
	    builder.bezier(element);
	}
	if (element.prefix === 'a') {
	    builder.arc(element);
        }
	element.absolute =  "MLQCS".indexOf(element.prefix) != -1;
	builder.location = { x:(element.x || 0) + (element.absolute ? 0 : builder.location.x), y:(element.y || 0) + (element.absolute ? 0 : builder.location.y) };
	builder.postProcess(this, this.path[i]);
    }
    // empty moveCache
    // builder.moveCache = [];
}

 

			    iPath.prototype.controlLines= function(significance) {
				var signify = function(number, significance) {
				    if (!isNumber(number) || !significance) {
					return number;
				    } else {
					var result = number.toFixed(significance);
					return result.replace(/\.?0+$/, "").replace(/^-0$/,0);
				    }
				}
				var result = "";
				var prevPrefix = "";
				var direction=0.0;
				this.points=[];
				this.location = {x:0,y:0};
				var lngth = this.path.length;
				for (var i=0;i<lngth;i++) {
				    var newHeading = this.heading;
				    var element = utils.extend({ x: 0, y: 0 }, this.path[i]);
				    var converter = this.cartesian2Cartesian;
				    if (element.prefix.indexOf('repeat') != -1) {
					if (element.prefix === 'repeat') {
					    this.path[i].prefix = 'repeating';
					    for (var repeatWalker = 1;repeatWalker<element["nrof"];repeatWalker++) {
						result += this.dPath(significance);
					    }
					    this.path[i].prefix = 'repeat';
					} else {
					    return result;
					}
				    }
				    if (element[iPath.cs] === iPath.polar) {
					converter = this.polar2Cartesian;
					element = converter.call(this,element, ('cCqQ'.indexOf(element.prefix) != -1));
				    }
				    if ('mMlL'.indexOf(element.prefix) != -1) {
					if (element.x || element.y) {
					    result += "m " + signify(element.x, significance) + " " + signify(element.y, significance); 
					    //		  result += (prevPrefix !==  element.prefix ? " " + element.prefix :  "") + " " + (element.x ? signify(element.x, significance) : 0) + " " + (element.y ? signify(element.y, significance) : 0); 
					}
				    } 
				    if (element.x || element.y) { newHeading = Math.atan2(element.y || 0, element.x || 0); }
				    if (element.prefix === 'c' || element.prefix === 'q') {
					if (element.cp1) { element.cp1 = converter.call(this, element.cp1); newHeading = this.heading + element.cp1.a};
					if (element.cp2) { element.cp2 = converter.call(this, element.cp2); newHeading = this.heading + element.cp2.a};
					if (element[iPath.cs] === iPath.polar) {
					    element.cp2.x = element.x + element.cp2.x;
					    element.cp2.y = element.y + element.cp2.y;
					}
					result += "l " + (element.cp1.x ? signify(element.cp1.x, significance) : 0) + " " + (element.cp1.y ? signify(element.cp1.y, significance) : 0);
					result += "m " + (element.cp1.x ? signify(-1*element.cp1.x, significance) : 0) + " " + (element.cp1.y ? signify(-1*element.cp1.y, significance) : 0);
					this.points.push( { x:this.location.x +  (element.cp1.x ? signify(element.cp1.x, significance) : 0)
						    , y:this.location.y + (element.cp1.y ? signify(element.cp1.y, significance) : 0) });
					result += "m " + (element.x || 0) + " " + (element.y || 0);
					var cp2x, cp2y;
					if (element.prefix==='q') {
					    cp2x = element.cp1.x ? element.cp1.x : 0;
					    cp2y = element.cp1.y ? element.cp1.y : 0;
					} else {
					    cp2x = element.cp2.x ? element.cp2.x : 0;
					    cp2y = element.cp2.y ? element.cp2.y : 0;
					}
					var cp2dx = (element.x || 0) - cp2x;
					var cp2dy = (element.y || 0) - cp2y;
					result += "l " + signify(cp2dx, significance) + " " + signify(cp2dy, significance);
					result += "m " + signify(-1* cp2dx, significance) + " " + signify(-1*cp2dy, significance);
					this.points.push( { x:this.location.x + (element.x || 0) +  cp2dx 
						    , y:this.location.y + (element.y || 0) + cp2dy });
				    } 
				    this.heading = newHeading;
				    this.location = { x:this.location.x + (element.x || 0), y:this.location.y + (element.y || 0) };
				    prevPrefix = ('mM'.indexOf(element.prefix) != -1) ? '' : element.prefix; // this prevents "m x1 y1 x2 ys, SVG translates this into m x1 y1 l x2 y2
				}
				return result;
			    }

				iPath.prototype.controlPoints= function(startPt, radius) {
				    var result = "";
				    this.points.forEach(function (pt) {
					    result += '<circle cx="' + (startPt.x + pt.x) + '" cy="' + (startPt.y + pt.y) + '" r="' + radius + '" stroke="black" stroke-width="0.5" fill="green"/>';
					});
				    return result;
    
				};

/*
 * creates a pens edge with a given number of pens. All pens and space between pens are equidistanced, so its perfect for a joint.
 * distance: thickness of pen and space
 * depth: depth of a single Pen positive. Use mirror for negative values;
 * numberOfPens: number of pens at the edge (the total length of the edge is n + (n-1) * distance, n being the number of pens).
 * settings an optional struct containing:
 * settings.bitRadius: radius of routing bit (default 0)
 * settings.overshoot: the size of the rounding on top of a single pen. (default 0, comes on top the given penDepth)
 * settings.penSizeInPlankSize: indicates whether  the penDept is already with the plank (effectively removes first and last line of the first and last pen respectively)
 * settings.startWithEar: if true starts and ends with a routingEar on the pen. Defaults to false. if true Pen offset: bitRadius*Math.sqrt(2);
 * settings.spaceFirst: if true starts with a space with the length of distance, it affects the total edgelength: (2n+1) * distance. Defaults to false.
 * If startWithEar is true the space length is decreased with ear's x-projection.
 */

iPath.prototype.pensEdge= function(distance, depth, numberOfPens, options) {
    var _routerEar = function(bitRadius) {
	if (!bitRadius) {
	    return new iPath();
	} else {
	    return new iPath().line({x:bitRadius}).line({y:2 * bitRadius}).line({x:-bitRadius});
	}
    }

    var settings = utils.extend ({
	    startWithEar: false
	    , overshoot: 0
	    , bitRadius: 0
	    , spaceFirst: false
	    , penSizeInPlankSize: false
	}, options || {});
    var ear = _routerEar(settings.bitRadius);
    var edgeBitRadius = settings.bitRadius * Math.sqrt(2);
    for(var i=0;i<numberOfPens;i++) {
	if (i>0) {
	    this.concat(ear.rotate(5*Math.PI/4, ear))
		.line({x:distance-2*edgeBitRadius}).concat(ear.rotate(7*Math.PI/4, ear))
	}
	this.line({y:depth-((i==0 && !settings.startWithEar) ? 0 : edgeBitRadius)});
	if (settings.overshoot) {
	    this.bezier(0, settings.overshoot * 0.3, distance * 0.1, settings.overshoot, distance * 0.5, settings.overshoot)
		.bezier(distance * 0.4, 0, distance*0.5, settings.overshoot * -0.7, distance * 0.5, -1*settings.overshoot);
	} else {
	    this.line({x:distance});
	}
	this.line({ y:-1*depth + ((i==numberOfPens-1 && !settings.startWithEar) ? 0 : edgeBitRadius)});
    }
    if (settings.penSizeInPlankSize) {
	this.path.pop();// splice(resultArray.length-1,1);
	this.path.shift();//splice(0,1); //remove last and first pen lines
    } if (settings.startWithEar && settings.bitRadius) {
	this.path.unshift(ear.rotate(7*Math.PI/4, ear));
	this.concat(ear.rotate(5*Math.PI/4, ear));
    } if (settings.spaceFirst) {
	this.path.unshift({x:distance-(settings.startWithEar ? edgeBitRadius : 0)});
	this.path.push({x:distance-(settings.startWithEar ? edgeBitRadius : 0)});
    }
    return this;
};

/**
 * Produces an svg string for square pocket.
 * h being height, b being width, aantal: number. The pen is positioned (moved) over the x axis with b units (ready for the next hole).
 * Settings is optional and may contain: 
 * settings.height_correction (deprecated)
 * settings.width_coorection (deprecated) decreases the given height and width with its value the remaining panel is centered.
 * settings.bit_radius is a cnc parameter, as a circular bit wil leave some material uncut (which is not desireble within a square hole) this parameter extends the pocket with "ears" to make sure everything in the pocket is milled (alas there is some overshoot as well).
 */

iPath.prototype.squareHole= function(h, b, options) {
    console.log('sh 1');
    function routerEar(bitRadius) {
	if (!bitRadius) {
	    return new iPath();
	} else {
	    return new iPath().line(-bitRadius, 0).line(0,-2*bitRadius).line(bitRadius,0);
	}
    }
    var settings = utils.extend ({
	    widthCorrection: 0
	    , heightCorrection: 0
	    , bitRadius: 0 
	}, options || {});
    var result = new iPath();
    if (!settings.bitRadius) {
	result.line(b-settings.widthCorrection,0).line(0,h-settings.heightCorrection).line(settings.widthCorrection-b,0).line(0,settings.heightCorrection-h);
    } else {
	var ear = routerEar(settings.bitRadius);
	var edgeBitRadius = settings.bitRadius*Math.sqrt(2);
	var width  = b-settings.widthCorrection - 2 * edgeBitRadius;
	var height = h-settings.heightCorrection - 2 * edgeBitRadius;
	result.move(0, edgeBitRadius).concat(routerEar(settings.bitRadius).rotate(1/4*Math.PI))
	.line(width, 0).concat(routerEar(settings.bitRadius).rotate(3/4*Math.PI))
	.line(0,height).concat(routerEar(settings.bitRadius).rotate(5/4*Math.PI))
	.line(-width, 0).concat(routerEar(settings.bitRadius).rotate(7/4*Math.PI))
	.line(0,-height).move(0,-edgeBitRadius);
    }
    result.move(2*(b+settings.widthCorrection), 0);
    this.concat(result);
    console.log('sh end');
    return this;
}

iPath.prototype.setSettings = function(settings) {
    this.settings = settings;
    return this;
}


/*
   boxEdge providing pens on the edge of a sheet special for a simple box joint.
   x,y are the endpoints, if you need to have 2 sheets perpendicular you will most
   likely need to correct for insets (thickness of wood). start_correction & end_correction or just correction
   for symmetrical corrections can be provided in the edges. 
   if modify_end_point = true (defaults to false) is passed in as a setting, the end point is modified for 
   the corrections. Otherwise
   As (x, y) are both leading, the caller needs to assure to correct these values for the supplied corrections. 
   boxEdge manipulates existing iPath.
   option calc_pen_length indicates to return an object {nr: number of sides, length: lenght of one pen}
   fit_correction (default 0) shrinks only the positive (male) joints with assigned value, to allow for easier sliding.
   make_hole (default false) creates wholes of the negative (female) joints
*/
iPath.prototype.boxEdge = function(x, y, settings) {
   if (settings != undefined && typeof settings !== 'object') {
      alert('settings is not an object');
      throw new Error(" Settings is not an object");
   }
   var options = utils.extend ({ correction: 0, bit_radius: 0, modify_end_point: false, calc_pen_length: false
			     , reverse: false, fit_correction: 0, make_hole: false}, this.settings, settings || {});
   options = utils.extend({ start_correction: options.correction, end_correction: options.correction} , options);
    if (!options.preferred_pen_length) {
	throw new Error("preferred_pen_length nog defined within settings");
    }
    if (options.pens_height === undefined || options.bit_radius < 0) {
	throw new Error("pens_height not defined within settings or bit_radius < 0");
    }
   var calcPenLength = function (totalLength, preferredLength) {
       var nr = totalLength/preferredLength;
       var rNr = Math.round(nr);
       if (rNr % 2) {
          var result = {nr : rNr, lngth: totalLength/rNr};
          return result;
       } else {
          if (nr >= rNr) {
             var cNr = rNr + 1;
          } else {
             var cNr = rNr - 1;
          }
          return { nr : cNr, lngth: totalLength/cNr }
       }
    };

      // 
      //  below the low or south lines of the joints hence the center of the piece is above.
      //  Clockwise is defined as reverse, and negative as joints towards the center (female).
      //  o = milling bit.

      // A /\____/\      Reverse  Negative    startWithEar     earAngle (4)      earTurn(4)      baseTurn(2)      
      //   \o     /
      //  __|^   |__         0        1           0            -Math.PI/4       Math.PI/2 (4)     -Math.PI/2
      //  >  	  >
      // 	                 
      // B___/\    /\ __                
      //  >  o/    \   >                  
      //      |____|^        0        0           1            -Math.PI/4       Math.PI/2          -Math.PI/2
	 		                 
	 		                 
	 		                 
      // C ___/\    /\ __               
      //   <  o/    \   <                  
      //      ^|_____|       1        0           1            Math.PI/4        -Math.PI/2           MathPI/2
	 		                 
      // D  /\____/\	                 
      //    \     o/         1        1           0            Math.PI/4        -Math.PI/2           MathPI/2
      //   __|   ^|__        ___________________________________________________________________________________
      //   <         <        Onderdestreep     !N        (R?1:-1) x Math.PI/4   -2*earAngle         2 * earAngle
 
   var angle = Math.atan2(y,x);
   var steering = calcPenLength(Math.sqrt(x*x + y*y) + (options.modify_end_point ? 0 : options.start_correction + options.end_correction), options.preferred_pen_length);
    
   if (options.calc_pen_length) {
      options.calc_pen_length.nr = steering.nr;
      options.calc_pen_length.lngth = steering.lngth;
   }
    var startWithEar = options.pens_height >= 0;
    var createHole = !startWithEar && options.make_hole;
    var fitCorrection = startWithEar ? options.fit_correction : (createHole ? -1*options.fit_correction : 0);
    var earAngle = options.reverse ? Math.PI/4 : -Math.PI/4;
    options.startWithEar = startWithEar;
    var baseTurn = 2 * earAngle;
    if (options.bit_radius) {
        var ear = new iPath().turtleLine({a:earAngle, r:options.bit_radius});
            ear.turtleLine({a:-2*earAngle, r:2*options.bit_radius});
	    ear.turtleLine({a:-2*earAngle, r:options.bit_radius})
	    ear.turtleLine({a:earAngle, r:0 });
    } else {
        var ear = new iPath().turtleLine({a:-2*earAngle, r:0});
    }
    var bitCorrection = options.bit_radius * Math.sqrt(2);
    var netPenHeight = Math.abs(options.pens_height) 
	- (createHole ? 2 :1) * Math.abs(bitCorrection);

   options.start_correction += (startWithEar ? bitCorrection : 0) - fitCorrection;
   options.end_correction += (startWithEar ? bitCorrection : 0) - fitCorrection;
    if (!createHole) {
	this.turtleLine({A: angle, r: steering.lngth - options.start_correction  });
    } else  {
	this.turtleMove({A: angle - Math.PI/2, r:bitCorrection })
	    .turtleMove({a: Math.PI/2, r: steering.lngth - options.start_correction  });
    }


      // A /\_______/\     
      //   \o        /   |
      //  __|^      |    | Thickness wood
      //   / _______ \   |                 | bitCorrection
      //   \/       \/
     //
     //
   for (var i= (steering.nr-3)/2; i >= 0; i--) {
       if (startWithEar) {
           this.concat(ear);
	   this.turtleLine({a:0, r:netPenHeight});
	   this.turtleLine({a:baseTurn, r:0});
       } else {
	   this.turtleLine({a:baseTurn, r:netPenHeight});
	   this.concat(ear);
       }
       this.turtleLine({a: 0, r: steering.lngth - (startWithEar ? 0 : 2) * bitCorrection - 2 * fitCorrection });
       if (startWithEar) {
	   this.turtleLine({a:baseTurn, r:netPenHeight});
           this.concat(ear);
       } else {
	   this.concat(ear);
	   this.turtleLine({r:netPenHeight});
	   if (!createHole) {
	       this.turtleLine({a: baseTurn});
	   }
       }
       if (!createHole) {
	   this.turtleLine({r: steering.lngth-( i == 0 ? options.end_correction : (startWithEar ? 2 * (bitCorrection-fitCorrection) : 0)) });
       } else {
	   this.concat(ear);
	   this.turtleLine({r:steering.lngth - (startWithEar ? 0 : 2) * bitCorrection - 2 * fitCorrection });
	   this.concat(ear);
	   this.turtleMove({a: Math.PI/2, r:2* steering.lngth - ( i == 0 ? options.end_correction :0 )});
       }
   }
    if (createHole) {
	this.turtleMove({a:Math.PI/2, r:bitCorrection});
        this.turtleMove({a:Math.PI/2, r:2*fitCorrection});
    }
   return this;
};


function vector2Length(v) {
    return Math.sqrt(v.x * v.x + v.y*v.y);
}

// Let u and v be vectors of non-zero length.
// Let ||u|| and ||v|| be their respective lengths.
// Then ||u||v+||v||u is the angle bisector of u and v.
function bisectVectors(v1, v2) {
    lv1 = vector2Length(v1);
    lv2 = vector2Length(v2);
    return Math.atan2(lv2*v1.y + lv1*v2.y, lv2*v1.x + lv1*v2.x);
}

//Determines whether v2 is left (1), isRight (-1) or on (0) v1.
// via a crossProduct isLeft
// public bool isLeft(Point a, Point b, Point c){
//     return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x));
// in our case a is 0,0.

function crossProduct (v1, v2) {
     return ((v1.x)*(v2.y) - (v1.y)*(v2.x));
}

// Accumulates the x and y coordinates in an arry starting from start and ending at endIndex
// if endIndex is ommited the last element of the array is assumed.
// if startIndex or endIndex is less than zero startIndex or endIndex is array.length + startIndex.
// result = { x : sigma rij[i].x, y: sigma rij[i].y
// rij = [{x:0,y:0},{x:1,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4}]
//         ^                             ^         ^
// index   0  -5                        -2         4 - 1 
   
// accumulate(rij, 3) = { x:7, x:7}
// accumulate(rij,-3) = { x:9, y:9}
// accumulate(rij, 0, -2) = {x:6, y:6}
   accumulateElements = function (array, startIndex, endIndex) {
       if (startIndex < 0) {
          startIndex = array.length + startIndex;
       }
       if (endIndex == undefined) {
	   endIndex = array.length -1;
       }
       if (endIndex < 0) {
          endIndex = array.length + endIndex;
       }
       endIndex = endIndex || array.length - 1;
       result = {x:0, y:0};
       for (var i =startIndex;i <= endIndex;i++) {
          result.x += array[i].x;
          result.y += array[i].y;
       }
       return result;
   }


function extendPoint(v1) {
    var result = {};
    if (v1.x !== undefined && v1.y !== undefined && v1.a !== undefined && v1.r !== undefined) {
	// the point has been extended already return argument.
	if (v1.x == undefined && v1.y == undefined && (v1.a !== undefined || v1.r !== undefined)) {
	    utils.extend(result, {x : Math.cos(v1.a || 0) * (v1.r || 0), y : Math.sin(v1.a || 0) * (v1.r || 0)}, v1);
	} else if ((v1.x !== undefined || v1.y !== undefined) && v1.a == undefined && v1.r == undefined) {
	    utils.extend(result, {a : Math.atan2(v1.y || 0, v1.x || 0), r: utils.diag(v1)}, v1);
	}
    }
    return result;
}

//              lc
//  ______________
//           oo   \ intersection2Tangent(length)
//              oo \
//                 o\
//                  o\
//           c      o
// returns an object consisting of corrections to replace the 'join point' or 'intersection' with an arc
// arguments are 2 vector objects and the filletRadius.
// result is 2 adjusted vectors and the arc object {v1: {x:.. , y:.. }, v2: {x:.., y:..}, arc: {cx:.., cy:.., r:.., x:.., y:..}}
// cx and cy is the centerpoint of the arc.
function doCorner (v1,v2,filletRadius) {
    var middleAngle = bisectVectors({x:-v1.x, y:-v1.y}, {x:v2.x, y:v2.y});
    var vv1 = extendPoint(v1); //Math.atan2(v1.y, v1.x);
    var vv2 = extendPoint(v2); //Math.atan2(v2.y, v2.x);
    var lengthV1 = Math.sqrt((vv1.x * vv1.x) + (vv1.y * vv1.y));
    var lengthV2 = Math.sqrt((vv2.x * vv2.x) + (vv2.y * vv2.y));
    if (filletRadius < 0) {
	filletRadius = Math.abs(filletRadius) * Math.min(lengthV1,lengthV2);
    }
    var ma = Math.abs(vv1.a - vv2.a+Math.PI)/2;
    var i2c = Math.abs(filletRadius / Math.sin(ma));
    var i2t = Math.abs(filletRadius / Math.tan(ma));
    var result = {
        v1 : { x : Math.cos(vv1.a)*(lengthV1 - i2t), y : Math.sin(vv1.a)*(lengthV1 - i2t) }
	, v2 : { x : Math.cos(vv2.a)*(lengthV2 - i2t), y : Math.sin(vv2.a)*(lengthV2 - i2t) }
	, arc : {
	    dxfClockWise : crossProduct(vv1,vv2) > 0
            , r  : filletRadius
            , reverse : vv1.reverse != undefined ? vv1.reverse : ((vv1.x * vv2.y) - (vv1.y * vv2.x)) > 0
            , x  : i2t * (Math.cos(vv1.a) + Math.cos(vv2.a))
	    , y  :  i2t * (Math.sin(vv1.a) + Math.sin(vv2.a))
            , a1 : vv1.a
            , a2 : vv2.a
	    , cx : Math.cos(middleAngle) * i2c + Math.cos(vv1.a)*(i2t)
            , cy : Math.sin(vv1.a)*(i2t) + Math.sin(middleAngle) * i2c
	}
    };
    return result;
};

// Makes a corner large enough for given bitRadius
function clearCorner (v1,v2,br) {
    var poly = br < 0;
    var bitRadius = Math.abs(br);
    var middleAngle = bisectVectors({x:-v1.x, y:-v1.y}, {x:v2.x, y:v2.y});
    var vv1 = extendPoint(v1); //Math.atan2(v1.y, v1.x);
    var vv2 = extendPoint(v2); //Math.atan2(v2.y, v2.x);
    if (Math.abs(vv1.a - vv2.a) < utils.EPSILON) {
	console.log("@@@@smaller");
	return { x:vv1.x + vv2.x, y:vv1.y + vv2.y };
    }
    var ma = Math.abs(vv1.a - vv2.a+Math.PI)/2;
    var secant = Math.abs(2 * bitRadius * Math.cos(ma));
    var cx = secant * Math.cos(vv1.a) + Math.cos(middleAngle) * bitRadius;
    var cy = secant * Math.sin(vv1.a) + Math.sin(middleAngle) * bitRadius;
    
    var result = {
	v1 : { x : Math.cos(vv1.a)*(vv1.r - secant), y : Math.sin(vv1.a)*(vv1.r - secant) }
	, v2 : { x : Math.cos(vv2.a)*(vv2.r - secant), y : Math.sin(vv2.a)*(vv2.r - secant) }
	, arc : {
	    dxfClockWise : crossProduct(vv1,vv2) > 0
            , r  : bitRadius
            , reverse : vv1.reverse != undefined ? vv1.reverse : ((vv1.x * vv2.y) - (vv1.y * vv2.x)) > 0
            , x  : secant * (Math.cos(vv1.a) + Math.cos(vv2.a))
	    , y  : secant * (Math.sin(vv1.a) + Math.sin(vv2.a))
	    , cx : secant * Math.cos(vv1.a) + Math.cos(middleAngle) * bitRadius
            , cy : secant * Math.sin(vv1.a) + Math.sin(middleAngle) * bitRadius
	}
    }
    if (Math.abs(utils.hypotenuse(vv1, vv2) < utils.EPSILON)) {
	console.log("@@@@smaller");
	return { x:vv1.x + vv2.x, y:vv1.y + vv2.y };
    }

    if (poly) {
        //   (2) /\(3)_____
        //   (1) \ 
        //       |
        //       |
        //       |
        var endPoint = extendPoint({x:result.arc.x, y:result.arc.y});
        var centrPoint = extendPoint({x:result.arc.cx, y:result.arc.cy});
        var diffEndCentr = Math.abs(endPoint.a - centrPoint.a);
        var earLine = extendPoint({a:endPoint.a + (result.arc.dxfClockWise ? -1 : 1) * Math.PI/2
        			       , r:Math.sqrt(secant * secant - Math.pow(bitRadius * Math.cos(diffEndCentr),2))});
        
        result['poly'] = {
        	l1 : {                    //(1)
        	    x : earLine.x
        	    ,y : earLine.y }
        	, l2 : {                  //(2)
        	    x:result['arc'].x
        	    , y:result['arc'].y }
        	,l3 : {                   //(3)
        	    x : -earLine.x
        	    , y : -earLine.y}
        }
    }
    result['arc']['large_arc'] = false; //Math.abs(vv1.a-vv2.a).between(0.5 * Math.PI,1.5 * Math.PI);
    return result;
};


/*
returns a new array lines with the original lines, appended with original lines, reversed and mirrored in vector)
*/


function reflectPath(lines, vector) {
    var isArc = function(v) { return  v.br || v.fr; }
    var result = utils.extend(true, [], lines);
    var n = utils.normalize(vector)
    length = lines.length- (isArc(lines.peek()) ? 1 : 2);
    for (var x=length; x>=0; x--) {
	if (isArc(lines[x])) {
	    result.push(lines[x])
	} else {
	    var d = dot(lines[x],n);
	    result.push ({
		x:lines[x].x -2 * d * n.y
		, y:lines[x].y -2 * d * n.x
	    })
	}
    }
    return result;
}
	

	    
	    
	    /*
	      if br = negative, the t-bone fillet is a 3 line extension instead of an arc. (The bit radius remains the same.
	      fr is default filletradius.

	    */

	    function arcPath(lines, fr, heading) {
    var result = [{v2:lines[0]}];
    if (heading == undefined) {
	heading = 0;
    }
    for (var x=1; x<lines.length; x++) {
        if (lines[x].br) {
	    result[x] = clearCorner(result[x-1].v2, lines[x], lines[x].br);
	} else if (lines[x].fr || fr != undefined && lines[x].fr != 0) {
            result[x] = doCorner(result[x-1].v2, lines[x], lines[x].fr || fr);
	} else {
	    result[x] = {v1: result[x-1].v2, v2:lines[x]};
	}
    }
    var iResult = new iPath();
    for (var x=1; x<result.length; x++) {
        iResult.line(result[x].v1);
	if (result[x].poly) {
	    iResult
		.line(result[x].poly.l1.x,result[x].poly.l1.y)
		.line(result[x].poly.l2.x,result[x].poly.l2.y)
		.line(result[x].poly.l3.x,result[x].poly.l3.y);
	} else if (result[x].arc) {
	    iResult
		.arc(result[x].arc);
	}
    }
    iResult.line(result[result.length-1].v2);
    return iResult;
}

function duoArrow(length, angle, startPt) {
    var l = [{x:0,y:4},{x:-3,y:-4},{x:3,y:-4},{x:0,y:4},{x:length-6,y:0},{x:0,y:4},{x:3,y:-4},{x:-3,y:-4},{x:0,y:4}];
    for (i = 0;i<l.length;i++) {
	l[i] = {x: l[i].x * Math.cos(angle) - l[i].y * Math.sin(angle)
		, y: l[i].x * Math.sin(angle) + l[i].y * Math.cos(angle)};
    }
    result = "";
    for (i = 0;i<l.length;i++) {
	result += " l " + l[i].x + " " + l[i].y;
    }
    if (startPt == null) {
	return  "<path d=\"" + result + "\"/>";
    } else {
	return "<path d=\"M " + startPt.x + " " + startPt.y +  "  "  + result + "\"/><text x=\"" + (startPt.x + length/2*Math.cos(angle)) + "\" y=\"" + (startPt.y+length/2*Math.sin(angle)) + "\" font-size=\"27\" font-family=\"monospace\" "
	    + "stroke=\"green\" stroke-width=\"0.7\">" + (startPt.text == null ? length:startPt.text) + "</text>";
    }
}



    words = {};
words.a= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 20, 65, 30, -30).smooth(-0.7,0,60,5,60);
words.d= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 30, 87, 30, -80).smooth(-0.1,0,95,0,102).smooth(2,2,5,7,0);
words.g= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 20, 65, 30, -30).smooth(-0.7,0,110,-20,110).smooth(1.1,10,-50,20,-60)
    words.j= new iPath().bezier(10, -30, 20, -45, 15, -37).move(-2,-20).line(5,5).move(-3,15).bezier(0,20,10,90,-10,90).smooth(1.1,10,-50,20,-60)
    words.i= new iPath().bezier(10, -30, 20, -45, 15, -37).move(-2,-20).line(5,5).move(-3,15).bezier(7, -10, -12, 90, 7, 50);
words.e= new iPath().bezier(10, 0, 30, 5, 30, -30).smooth(0.15, -10, -35, -20, 20).smooth(0.6, 0, 35, 20, 20);
words.l= new iPath().bezier(12, 0, 33, 0, 30, -40).smooth(2.5, -10, -35, -20, 30).smooth(0.6, 0, 35, 20, 20);
words.b= new iPath().bezier(6, -4, 23, 0, 28, -40).smooth(2.5, -10, -41, -12, 30).smooth(0.7, 19, 23, 22, -4).smooth(1.4, -15, -2, 1, 0);

words.f= new iPath().bezier(6, -4, 23, 0, 28, -40).smooth(2.5, -10, -41, -12, 60).smooth(0.7, 19, 23, 9, -14).smooth(1.4, -15, -2, 5, 0);

words.h= new iPath().bezier(6, -10, 23, 0, 32, -50).smooth(2.5, -10, -41, -12, 70).smooth(-0.6, 27, -45, 22, -10).smooth(0.65,3,4,3,1);
words.k= new iPath().bezier(6, -10, 23, 0, 25, -50).smooth(2.5, -10, -41, -12, 70).smooth(-1.2, 45, 15, 4, -30).smooth(-0.4,0,40,25,25);;//.smooth(1,3,3,5,4);
//words.s= new iPath().bezier(60, -50, 39, -46, 38, -42).smooth(0.5, -8, -10, -3, 3).smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.s= new iPath().bezier(5, -7.5, 18, -25, 22,-30).smooth(2.7, -12, -10, 4, 3).smooth(2.2, 25, 50, -5, 45).move(27,-8);//.smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.S= new iPath().bezier(35, -7.5, 10, -90, 49,-80).smooth(-0.9, -35, 35, -12, 45).smooth(1.9, 5, 75, -30, 45).smooth(-0.5,35,5,44,0);//.smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.r= new iPath().bezier(2, 2, 12, -28, 18, -35).smooth(0.4, -20, 12, 35, -5).smooth(-0.4, -22, 60, -13, 60);
words.z= new iPath().bezier(2, -8, 12, 0, 18, -35).smooth(0.4, -23, 12, 31, -5).smooth(-0.4, -22, 40, -35, 60).smooth(-0.1, 5 ,-10, 23,-3).smooth(0.1, 0, 10, 10,-10);
words.p= new iPath().bezier(10, -30, 20, -30, 15, -40).smooth(-0.2, 2, 100, -5, 100).smooth(0.2, 0, -60, 8, -80).smooth(3.3, 35, 90, 0,20).smooth(-0.38,20,10,30,0);
//words.t= new iPath().bezier(10, -30, 20, -90, 15, -50).smooth(-0.2, -5, 60, -5, 70).smooth(-6, -15, -20, 0, -20);
words.t= new iPath().bezier(1, -1, 20, -15, 15, -50).move(-5,20).bezier(4,4,6,6,14,3).move(-9,-23).bezier(7, -10, -12, 105, 7, 65);
words.n= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-0.2, -5, 50, -5, 60).smooth(-4, 0, -60, 20, -60).smooth(0.7,3,60,5,60).smooth(0.2,0,0,5,-5);
words.u= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-0.2, -5, 60, 8, 60).smooth(0.3, 8, 0, 15, -60).smooth(-0.7,-5,70,3,54);
words.w= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-3.3, 10, 80, 10, 20).smooth(-0.7,10,65,10,-10).smooth(0.2,-5,5,1,10);

words.v= new iPath().bezier(10, -30, 12, -45, 12, -30).smooth(3, 15, 80, 15, 0).smooth(0.2,-5,5,1,15);

words.m= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-0.2, -5, 50, -5, 60).smooth(-4, 0, -60, 20, -60).smooth(0.7,3,60,5,60).smooth(-4, 0, -60, 20, -60).smooth(0.7,3,60,5,60).smooth(0.2,0,0,5,-5);
words.c= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-0.7, -30, -20, -30, 10).smooth(0.3, 12, 40, 24, 27);//.smooth(0.1, 8,-8, 9,-9);
words.o= new iPath().bezier(10, -20, 30, -75, 40, -20).bezier(-40, -75, -20, 110, 2, 10).smooth(0.3, -4, -7, 0, 0);
words["@"] = new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 20, 65, 30, -30).smooth(-0.7,0,62,5,60).smooth(4.0, 0, -80, -15, -80).smooth(2, -60, 90, 10, 90); 
words["."] = new iPath().move(2,15).bezier(5, 0, 5, 5, 0, 5).smooth(1, -5, -5, 0, -5).move(2,-15);
words[":"] = new iPath().move(2,15).bezier(5, 0, 5, 5, 0, 5).smooth(1, -5, -5, 0, -5).move(2,-30).bezier(5, 0, 5, 5, 0, 5).smooth(1, -5, -5, 0, -5).move(2,25)
    words["&"] = new iPath().move(20,20).bezier(-30, -30, -30, -60, -10, -60).smooth(0.2, 5, 5, -8, 28).smooth(1,-10,50,17,10);
words["/"] = new iPath().move(5,20).line(20,-60).move(5,-40);
words.loop = function(array,fn) {
    for (var i=0;i<array.length;i++) {
	if (fn.call(words, array[i], i) === false) break;}
}

words.form=function(w) {
    if (typeof w !== 'string') return ""
				   var result = new iPath();
    var element;
    var movement = {x:0,y:0};
    var direction;
    this.loop(w.split(' '), function(word, j) {
        this.loop(word.split(''), function(char, i) {
	    if (typeof words[char] === 'undefined') return true;
		    var character = utils.extend(true, new iPath(), words[char]);
		    if (i !== 0 && result.path.length > 0) {
		        element = result.path[result.path.length-1];
		        direction = result._direct(element);
			// height correction = movement.y
			character.path[0].cp1 = direction;
			character.path[0].cp2.y -= 1.1 * movement.y;
			character.path[0].y -= movement.y;
		    } else {
			character.path.shift;
		    }
		    result.concat(character);
    	            movement = result._getEndLocation();
		    return true;
		});
	    result.move(20,-1* movement.y);
	});
    return result; 
}



/*
   boxEdge providing pens on the edge of a sheet special for a simple box joint.
   x,y are the endpoints, if you need to have 2 sheets perpendicular you will most
   likely need to correct for insets (thickness of wood). start_correction & end_correction or just correction
   for symmetrical corrections can be provided in the edges. 
   if modify_end_point = true (defaults to false) is passed in as a setting, the end point is modified for 
   the corrections. Otherwise
   As (x, y) are both leading, the caller needs to assure to correct these values for the supplied corrections. 
   boxEdge manipulates existing iPath.
   option calc_pen_length indicates to return an object {nr: number of sides, length: lenght of one pen}
   fit_correction (default 0) shrinks only the positive (male) joints with assigned value, to allow for easier sliding.
   make_hole (default false) creates wholes of the negative (female) joints
*/
iPath.prototype.boxEdge = function(x, y, settings) {
   if (settings != undefined && typeof settings !== 'object') {
      alert('settings is not an object');
      throw new Error(" Settings is not an object");
   }
   var options = utils.extend ({ correction: 0, bit_radius: 0, modify_end_point: false, calc_pen_length: false
			     , reverse: false, fit_correction: 0, make_hole: false}, this.settings, settings || {});
   options = utils.extend({ start_correction: options.correction, end_correction: options.correction} , options);
    if (!options.preferred_pen_length) {
	throw new Error("preferred_pen_length nog defined within settings");
    }
    if (options.pens_height === undefined || options.bit_radius < 0) {
	throw new Error("pens_height not defined within settings or bit_radius < 0");
    }
   var calcPenLength = function (totalLength, preferredLength) {
       var nr = totalLength/preferredLength;
       var rNr = Math.round(nr);
       if (rNr % 2) {
          var result = {nr : rNr, lngth: totalLength/rNr};
          return result;
       } else {
          if (nr >= rNr) {
             var cNr = rNr + 1;
          } else {
             var cNr = rNr - 1;
          }
          return { nr : cNr, lngth: totalLength/cNr }
       }
    };

      // 
      //  below the low or south lines of the joints hence the center of the piece is above.
      //  Clockwise is defined as reverse, and negative as joints towards the center (female).
      //  o = milling bit.

      // A /\____/\      Reverse  Negative    startWithEar     earAngle (4)      earTurn(4)      baseTurn(2)      
      //   \o     /
      //  __|^   |__         0        1           0            -Math.PI/4       Math.PI/2 (4)     -Math.PI/2
      //  >  	  >
      // 	                 
      // B___/\    /\ __                
      //  >  o/    \   >                  
      //      |____|^        0        0           1            -Math.PI/4       Math.PI/2          -Math.PI/2
	 		                 
	 		                 
	 		                 
      // C ___/\    /\ __               
      //   <  o/    \   <                  
      //      ^|_____|       1        0           1            Math.PI/4        -Math.PI/2           MathPI/2
	 		                 
      // D  /\____/\	                 
      //    \     o/         1        1           0            Math.PI/4        -Math.PI/2           MathPI/2
      //   __|   ^|__        ___________________________________________________________________________________
      //   <         <        Onderdestreep     !N        (R?1:-1) x Math.PI/4   -2*earAngle         2 * earAngle
 
   var angle = Math.atan2(y,x);
   var steering = calcPenLength(Math.sqrt(x*x + y*y) + (options.modify_end_point ? 0 : options.start_correction + options.end_correction), options.preferred_pen_length);
    
   if (options.calc_pen_length) {
      options.calc_pen_length.nr = steering.nr;
      options.calc_pen_length.lngth = steering.lngth;
   }
    var startWithEar = options.pens_height >= 0;
    var createHole = !startWithEar && options.make_hole;
    var fitCorrection = startWithEar ? options.fit_correction : (createHole ? -1*options.fit_correction : 0);
    var earAngle = options.reverse ? Math.PI/4 : -Math.PI/4;
    options.startWithEar = startWithEar;
    var baseTurn = 2 * earAngle;
    if (options.bit_radius) {
        var ear = new iPath().turtleLine({a:earAngle, r:options.bit_radius});
            ear.turtleLine({a:-2*earAngle, r:2*options.bit_radius});
	    ear.turtleLine({a:-2*earAngle, r:options.bit_radius})
	    ear.turtleLine({a:earAngle, r:0 });
    } else {
        var ear = new iPath().turtleLine({a:-2*earAngle, r:0});
    }
    var bitCorrection = options.bit_radius * Math.sqrt(2);
    var netPenHeight = Math.abs(options.pens_height) 
	- (createHole ? 2 :1) * Math.abs(bitCorrection);

   options.start_correction += (startWithEar ? bitCorrection : 0) - fitCorrection;
   options.end_correction += (startWithEar ? bitCorrection : 0) - fitCorrection;
    if (!createHole) {
	this.turtleLine({A: angle, r: steering.lngth - options.start_correction  });
    } else  {
	this.turtleMove({A: angle - Math.PI/2, r:bitCorrection })
	    .turtleMove({a: Math.PI/2, r: steering.lngth - options.start_correction  });
    }


      // A /\_______/\     
      //   \o        /   |
      //  __|^      |    | Thickness wood
      //   / _______ \   |                 | bitCorrection
      //   \/       \/
     //
     //
   for (var i= (steering.nr-3)/2; i >= 0; i--) {
       if (startWithEar) {
           this.concat(ear);
	   this.turtleLine({a:0, r:netPenHeight});
	   this.turtleLine({a:baseTurn, r:0});
       } else {
	   this.turtleLine({a:baseTurn, r:netPenHeight});
	   this.concat(ear);
       }
       this.turtleLine({a: 0, r: steering.lngth - (startWithEar ? 0 : 2) * bitCorrection - 2 * fitCorrection });
       if (startWithEar) {
	   this.turtleLine({a:baseTurn, r:netPenHeight});
           this.concat(ear);
       } else {
	   this.concat(ear);
	   this.turtleLine({r:netPenHeight});
	   if (!createHole) {
	       this.turtleLine({a: baseTurn});
	   }
       }
       if (!createHole) {
	   this.turtleLine({r: steering.lngth-( i == 0 ? options.end_correction : (startWithEar ? 2 * (bitCorrection-fitCorrection) : 0)) });
       } else {
	   this.concat(ear);
	   this.turtleLine({r:steering.lngth - (startWithEar ? 0 : 2) * bitCorrection - 2 * fitCorrection });
	   this.concat(ear);
	   this.turtleMove({a: Math.PI/2, r:2* steering.lngth - ( i == 0 ? options.end_correction :0 )});
       }
   }
    if (createHole) {
	this.turtleMove({a:Math.PI/2, r:bitCorrection});
        this.turtleMove({a:Math.PI/2, r:2*fitCorrection});
    }
   return this;
};
