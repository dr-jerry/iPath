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
if (!Math.hypot) {
    Math.hypot = function(x,y) {return Math.sqrt(x*x+y*y); }
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
      , isArc : function(v) { return  v.br || v.fr; }
      , isLine : function(v) { return v.x || v.y || v.a || v.r; }
      , dot : function (v1,v2){
	  return (v1.x*v2.y) + (v1.y*v2.x)
      }
      , EPSILON : parseFloat("1e-10")
      , hypotenuse : _hypotenuse
      , diag : _hypotenuse
      , normalize: function(v) {
	  var d = _hypotenuse(v);
	  v = _extend({x:0, y:0}, v);
	  return {x:v.y/d, y:v.x/d}
      }
  }
}();

Function.prototype.curry = function() {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function() {
	return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};


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
iPath.finishLines = [];
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
addMethod(iPath.prototype, 'fillet', function(r) {
    return this.travel(opts, 'fil');
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
    this.lineCache = [];
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

iPath.prototype.dPath= function(start, significance, perc) {
    if (typeof start !== "object") {
	if (significance !== undefined) {
	    perc = significance;
	}
	significance = start;
	start = null;
    }
    console.log(JSON.stringify([start, significance, perc]));
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
    return (start ? "M " + start.x + " " + start.y + " " : "") + builder.path;
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

	  iPath.prototype.nextAkin = function(i) {
	      var result;
	      if (i === -1) {
		  result = this.path[this.path.length-1];
	      }
	      if (i === this.path.length) {
		  result = this.path[0];
	      }
	      if (i>-1 && i < this.path.length) {
		  result = this.path[i];
	      }
	      console.log("result is " + result);
	      if (result && result.prefix === 'l') {
		  return result;
	      }
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



iPath.prototype.setSettings = function(settings) {
    this.settings = settings;
    return this;
}



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
	return v1;	// the point has been extended already return argument.
    } else 
	if (v1.x == undefined && v1.y == undefined && (v1.a !== undefined || v1.r !== undefined)) {
	    utils.extend(result, {x : Math.cos(v1.a || 0) * (v1.r || 0), y : Math.sin(v1.a || 0) * (v1.r || 0)}, v1);
	} else if ((v1.x !== undefined || v1.y !== undefined) && v1.a == undefined && v1.r == undefined) {
	    utils.extend(result, {a : Math.atan2(v1.y || 0, v1.x || 0), r: utils.diag(v1)}, v1);
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
function doCorner (v1,v2,filletRadius, segments) {
    console.log("segments is " + segments);
    if (filletRadius === 0) return {v1: v1, v2: v2};
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
	, v2 : { x : Math.cos(vv2.a)*(lengthV2 - i2t), y : Math.sin(vv2.a)*(lengthV2 - i2t) }};
    if (!segments) {
	result.arc = {
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
    } else {
	result.poly = [{
            x  : i2t * (Math.cos(vv1.a) + Math.cos(vv2.a))
	    , y  :  i2t * (Math.sin(vv1.a) + Math.sin(vv2.a))
	}];
    }

    return result;
};

// Makes a corner large enough for given bitRadius
function clearCorner (v1,v2,br) {
    if (br == 0) return {v1: v1, v2: v2}
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
        
        result['poly'] = [{
        	    x : earLine.x
        	    ,y : earLine.y }
        	, {                  //(2)
        	    x:result['arc'].x
        	    , y:result['arc'].y }
        	, {                   //(3)
        	    x : -earLine.x
        	    , y : -earLine.y}
			 ];
    }
    result['arc']['large_arc'] = false; //Math.abs(vv1.a-vv2.a).between(0.5 * Math.PI,1.5 * Math.PI);
    return result;
};


/*
returns a new array lines with the original lines, appended with original lines, reversed and mirrored in vector)
*/


function reflectPath(lines, vector) {
    var result = utils.extend(true, [], lines);
    var n = utils.normalize(vector)
    var length = lines.length- (utils.isArc(lines.peek()) ? 2 : 1);
    for (var x=length; x>=0; x--) {
	if(lines[x].br || lines[x].fr) {
	    result.push(lines[x])
	} else {
	    var d = utils.dot(lines[x],n);
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

function arcPath(lines, filletRadius) {
    var fillet = (filletRadius !== undefined ? {fr: filletRadius} : {fr:false});
    var result = [];
    var count = 0;
    var last = false;
    for (var x=0; x<lines.length; x++) {
	var subResult = undefined;
	var extraCount = 0;
	last = (x == lines.length-1);
        if (lines[x].br) {
	    if (!last) {
		subResult = clearCorner(result[count-1].v, lines[x+1], lines[x].br);
	    } else {
		subResult = clearCorner(result[count-1].v, result[0].v, lines[x].br);
	    }
	} else if (lines[x].fr) {
	    if (!last) {
		subResult = doCorner(result[count-1].v, lines[x+1], lines[x].fr, lines[x].lines);
	    } else {
		subResult = doCorner(result[count-1].v, result[0].v, lines[x].fr, lines[x].lines);
	    }
	} else if (fillet.fr && x>0 && utils.isLine(lines[x]) && utils.isLine(lines[x-1])) {
	    subResult = doCorner(result[count-1].v, lines[x], fillet.fr);
	    // if you want the last item to be a fillet you have to specify it manually
	    // :-(
	    extraCount = 1;
	}
	if (subResult) {
	    result[count-1].v = subResult.v1;
	    if (!last) {
		result[count+1] = {v: subResult.v2};
	    } else if (last && utils.isArc(lines[lines.length-1])) { // it is close..
		result[0].v = subResult.v2;
	    }
	    if (subResult.arc) {
		result[count] = {arc: subResult.arc}
	    }
	    if (subResult.poly) {
		result[count] = {poly: subResult.poly}
	    }
	} else {
	    if (result[count] === undefined  && utils.isLine(lines[x])) {
		result[count] = {v: lines[x]}
		
	    } else if (!utils.isLine(lines[x])) extraCount = -1;
	}
	count = count + 1 + extraCount;
    }
    var iResult = new iPath();
    for (var x=0; x<=result.length-1; x++) {
        if (result[x].v !== undefined) {
	    iResult.line(result[x].v);
	} else 	if (result[x].poly) {
	    for (var i =0; i<result[x].poly.length; i++) {
		iResult.line(result[x].poly[i].x,result[x].poly[i].y);
	    }
	} else if (result[x].arc) {
	    iResult
		.arc(result[x].arc);
	}
    }
    return iResult;
}
