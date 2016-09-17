/*
 * Copyright 2015 Jeroen Dijkmeijer.
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

var ml=50;fr1=7;fr2=10;bl=20;width=30;

characters = {
    P : [{x:0,y:ml},{fr:fr1},{x:bl,y:20}]
};


    words = {};
words.a= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 20, 65, 30, -30).smooth(-0.7,0,60,5,60);
words.d= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 30, 87, 30, -80).smooth(-0.1,0,95,0,102).smooth(2,2,5,7,0);
words.g= new iPath().bezier(10, -20, 30, -55, 40, -20).smooth(-1.1, -30, -20, -30, 10).smooth(0.8, 20, 65, 30, -30).smooth(-0.7,0,110,-20,110).smooth(1.1,10,-50,20,-60)
    words.j= new iPath().bezier(10, -30, 20, -45, 15, -37).move(-2,-20).line(5,5).move(-3,15).bezier(0,20,10,90,-10,90).smooth(1.1,10,-50,20,-60)
    words.i= new iPath().bezier(10, -30, 20, -45, 15, -37).move(-2,-20).line(5,5).move(-3,15).bezier(7, -10, -2, 50, 7, 55);
words.e= new iPath().bezier(10, 0, 30, 5, 30, -30).smooth(0.15, -10, -35, -20, 20).smooth(0.6, 0, 35, 20, 20);
words.l= new iPath().bezier(12, 0, 33, 0, 30, -40).smooth(3.5, -20, 55, -7, 59);
words.b= new iPath().bezier(6, -4, 23, 0, 28, -40).smooth(2.5, -10, -41, -12, 30).smooth(0.7, 19, 23, 22, -4).smooth(1.4, -15, -2, 1, 0);

words.f= new iPath().bezier(6, -4, 23, 0, 28, -40).smooth(2.5, -10, -41, -12, 60).smooth(0.7, 19, 23, 9, -14).smooth(1.4, -15, -2, 5, 0);

words.h= new iPath().bezier(6, -10, 23, 0, 32, -50).smooth(2.5, -10, -41, -12, 70).smooth(-0.6, 27, -45, 22, -10).smooth(0.65,3,4,3,1);
words.P = new iPath().bezier(2, 12, 5, 0, 5, -100).move(-5,10).bezier(60,-10, 80,10,-3,40).move(10,58)

words.k= new iPath().bezier(6, -10, 23, 0, 25, -50).smooth(2.5, -10, -41, -12, 70).smooth(-1.2, 45, 15, 4, -30).smooth(-0.4,0,40,25,25);;//.smooth(1,3,3,5,4);
//words.s= new iPath().bezier(60, -50, 39, -46, 38, -42).smooth(0.5, -8, -10, -3, 3).smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.s= new iPath().bezier(5, -7.5, 18, -25, 22,-30).smooth(2.7, -12, -10, 4, 3).smooth(2.2, 25, 50, -5, 45).move(27,-8);//.smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.S= new iPath().bezier(35, -7.5, 10, -90, 49,-80).smooth(-0.9, -35, 35, -12, 45).smooth(1.9, 5, 75, -30, 45).smooth(-0.5,35,5,44,0);//.smooth(0.2, -8, -10, -3, 3).smooth(2, 30, 77, -23, 47).smooth(-0.5, 32, 12, 37, 3);
words.r= new iPath().bezier(2, 2, 12, -28, 18, -35).smooth(0.4, -20, 12, 35, -5).smooth(-0.4, -22, 60, -13, 60);
words.z= new iPath().bezier(2, -8, 12, 0, 18, -35).smooth(0.4, -23, 12, 31, -5).smooth(-0.4, -22, 40, -35, 60).smooth(-0.1, 5 ,-10, 23,-3).smooth(0.1, 0, 10, 10,-10);
words.p= new iPath().bezier(10, -30, 20, -30, 15, -40).smooth(-0.2, 2, 100, -5, 100).smooth(0.2, 0, -60, 8, -80).smooth(3.3, 35, 90, 0,20).smooth(-0.38,20,10,30,0);
//words.t= new iPath().bezier(10, -30, 20, -90, 15, -50).smooth(-0.2, -5, 60, -5, 70).smooth(-6, -15, -20, 0, -20);
words.t= new iPath().bezier(1, -1, 20, -15, 15, -50).move(-5,20).bezier(4,4,6,6,14,3).move(-9,-23).bezier(7, -10, -12, 105, 7, 65)
//words.t= new iPath().bezier(1, -1, 20, -15, 15, -50).move(-5,20).bezier(4,4,6,6,14,3).move(-9,-23).bezier(70, -100, -12, 105, 7, 65);
words.n= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-0.2, -5, 50, -5, 60).smooth(-4, 0, -60, 20, -60).smooth(0.7,3,60,5,60).smooth(0.2,0,0,5,-5);
words.u= new iPath().bezier(10, -30, 12, -20, 15, -40).smooth(-0.2, -5, 60, 8, 60).smooth(0.3, 8, 0, 15, -60).smooth(-1.2,2,60,3,60);
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
