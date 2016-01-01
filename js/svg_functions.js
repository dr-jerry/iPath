// returns a string version of the passed array.
// the array is multidimensional with {x, y} pairs.
// a subarray with length 1 is rendered as a line
// a subarray with a length of 3 is rendered as a curve.
// if the first element of a subarray has a c attribute, it continues the previous curve smoothly.
// the value of the c attribute denotes the length of the tangent. 1 denotes an equal size to the previous tangent.


function array2String(wieberArray, angle) {
    if (!wieberArray && typeof wieberArray != 'object' && wieberArray.length == 0) {
	return "";
    }
   var result = "";
    for (var i=0;i<wieberArray.length;i++) {
	var x = 0.0;
        var y = 0.0;
	if (wieberArray[i].length > 0) {
	    result += (wieberArray[i].length == 1 ? (wieberArray[i][0].prefix ? wieberArray[i][0].prefix : "l ") :"c ");
	    for (var j=0;j<wieberArray[i].length;j++) {
		if (typeof wieberArray[i][j].c == "number") {
		    var dx = wieberArray[i-1][wieberArray[i-1].length-1].x - wieberArray[i-1][wieberArray[i-1].length-2].x;
		    var dy = wieberArray[i-1][wieberArray[i-1].length-1].y - wieberArray[i-1][wieberArray[i-1].length-2].y;
		    var x = wieberArray[i][j].c * dx;
		    var y = wieberArray[i][j].c * dy;
		} else {
		    var x = wieberArray[i][j].x;
		    var y = wieberArray[i][j].y;
		}
		if (angle == null) {
		    result += x + " " + y + " ";
		}  else {
		    result += (x * Math.cos(angle) - y * Math.sin(angle)) + " " + (x * Math.sin(angle) + y * Math.cos(angle)) + " ";
		}
	    }
	}
    }
    return result;
}

/**
 * returns the array with all points angle radians rotated
 *
 */
function rotate(wieberArray, angle) {
    if (typeof wieberArray == 'undefined') { return undefined; }
    var result = [];
    for (var i = 0; i<wieberArray.length;i++) {
	result[i] = [];
	for (var j=0; j<wieberArray[i].length;j++) {
	    if (wieberArray[i][j].x || wieberArray[i][j].y) {
		result [i][j] = {};
		result [i][j].x = (wieberArray[i][j].x * Math.cos(angle) - wieberArray[i][j].y* Math.sin(angle));
		result [i][j].y = (wieberArray[i][j].x * Math.sin(angle) + wieberArray[i][j].y* Math.cos(angle));
	    }
	}
    }
    return result;
}

// reverses an svg array so that it can be used for symmetrical uses.
// accepts a 2 dimensional array with line and cubic bzr curves.
// returns the array in reversed order. (c's are ditched).
function reverse(wieberArray) {
    var i=0;
    var j=0;
    try {
	var last = wieberArray.length-1;
	var result = [];
	for (i=last;i>=0;i--) {
	    result[last-i]=[];
	    var subLast = wieberArray[i].length-1;
	    var lastPt = wieberArray[i][subLast];
	    for (j=subLast;j>=1;j--) {
		if (typeof wieberArray[i][j-1].c == "number") {
		    var dx = wieberArray[i-1][wieberArray[i-1].length-1].x - wieberArray[i-1][wieberArray[i-1].length-2].x;
		    var dy = wieberArray[i-1][wieberArray[i-1].length-1].y - wieberArray[i-1][wieberArray[i-1].length-2].y;
		    result[last-i][subLast-j] = {x: lastPt.x-wieberArray[i][j-1].c * dx, y: wieberArray[i][j-1].c * dy-lastPt.y};
		} else {

		    // For a reversed order switch the lastPt.x and wieberArray[i][j-1] subtraction
		    result[last-i][subLast-j] = {x:(lastPt.x-wieberArray[i][j-1].x), y:(wieberArray[i][j-1].y - lastPt.y)};
		}
	    }
	    result[last-i][subLast] = {x:lastPt.x, y:0-lastPt.y};
	}
	return result;
    } catch (error) {
	console.log(error + " i: " + i + JSON.stringify(wieberArray[i][j]));
	alert(error);
    }
}

/**
 * returns a copy of the array with all elements cloned and mirrored around x or y axis.
 * default will mirror around x-axis.
 * mirror(list, 'x') will return the same array with all .y components of the coordinates multiplied with -1.
 */
mirror = function mrr(wieberArray, axis) {
    try {
        if (typeof axis == 'undefined') axis = 'x';
        var result = [];
        for (var i=0;i<wieberArray.length;i++) {
            result[i] = [];
            for (var j=0;j<wieberArray[i].length;j++) {
		result [i][j] = utils.extend(true, {}, wieberArray[i][j]);
        	if (axis == 'x' && result[i][j].y) {
        	    result [i][j].y *= -1;
    		} else if (axis == 'y' && result[i][j].x) {
    		    result [i][j].x *= -1;
    		}
    	    }
	}
    } catch (x) {
	alert("ERROR occurred", x);
	console.log(x);
    }
    return result;
}

function symmetry(wieberArray, angle) {
    return array2String(wieberArray, angle) +  array2String(reverse(wieberArray), angle);
}


//makes a bump with a length of v and height of h under an angle of angle.
//returns a string
function bump(h, v, angle){
    var angle=angle/180 * Math.PI;
    var sh = Math.sin(angle)*h;cv = Math.cos(angle)*v;
    var ch = Math.cos(angle)*h;sv = Math.sin(angle)*v;
    return  " c " + cv.toFixed(2) + " " + sv.toFixed(2) + " " + -1*sh.toFixed(2)
	+ " " + ch.toFixed(2) + " " + (cv-sh).toFixed(2) + " " + (ch+sv).toFixed(2);
}


// returns the array for the curve to be branced;
function branch (wieberArray, indexCurve, percent) {
    if (wieberArray[indexCurve].length <= 2) {
	alert("error in branch passed in curve is not bezier");
	return [];
    } else {
	if (typeof wieberArray[indexCurve][0].c == "number") {
	    dx = wieberArray[indexCurve-1][wieberArray[indexCurve-1].length-1].x
		- wieberArray[indexCurve-1][wieberArray[indexCurve-1].length-2].x
	    dy = wieberArray[indexCurve-1][wieberArray[indexCurve-1].length-1].y
		- wieberArray[indexCurve-1][wieberArray[indexCurve-1].length-2].y
	    wieberArray[indexCurve][0]  = { x: wieberArray[indexCurve][0].c * dx
					    , y : wieberArray[indexCurve][0].c * dy };
	}
	castelArray = casteljau(1-percent, [{x:0,y:0}].concat(wieberArray[indexCurve]));
	return [castelArray[5], castelArray[0], castelArray[1]];
    }
}

function interpolate (percent, p0, p1) {
    return  {x: p0.x + (p1.x - p0.x) * percent
	     , y: p0.y + (p1.y - p0.y) * percent};
};


function casteljau(percent, array, startPoint) {
    if (array.length < 2) {
	alert("error");
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
    return casteljau(percent, subresult, startPoint).concat(subresult);
}

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
 * If startsWithEar is true the space length is decreased with ear's x-projection.
 */
pensEdge = function pensedge(distance, depth, numberOfPens, settings) {
    if (typeof settings == 'undefined') {
	settings = {};
    }
    if (settings.startWithEar == undefined) {
	settings.startWithEar = false;
    }
    if (!settings.overshoot) {
	settings.overshoot = 0;
    }
    if (!settings.bitRadius) {
	settings.bitRadius = 0;
    }
    if (settings.spaceFirst == undefined) {
	settings.spaceFirst = false;
    }
    if (settings.penSizeInPlankSize == undefined) {
	settings.penSizeInPlankSize = false;
    }
    var ear = routerEar(settings.bitRadius);
    var edgeBitRadius = settings.bitRadius * Math.sqrt(2);
    var resultArray = [];
    for(var i=0;i<numberOfPens;i++) {
	if (i>0) {
	    resultArray = resultArray.concat(rotate(ear,Math.PI/4));
	    resultArray.push([{x:distance-2*edgeBitRadius,y:0}]);
		resultArray = resultArray.concat(rotate(ear,3*Math.PI/4));
	}
	resultArray.push([{x:0,y:depth-((i==0 && !settings.startWithEar) ? 0 : edgeBitRadius)}]);
	if (settings.overshoot) {
	    resultArray = resultArray.concat([[{x:0, y:settings.overshoot * 0.5}, {x:distance * 0.2,y:settings.overshoot}, {x:distance * 0.5, y:settings.overshoot}]
					      ,[{x:distance * 0.3,y:0}, {x:distance*0.5, y:settings.overshoot * -0.5}, {x:distance * 0.5, y:-1*settings.overshoot}]]);
	} else {
	    resultArray.push([{x:distance, y:0}]);
	}
	resultArray.push([{x:0,y:-1*depth + ((i==numberOfPens-1 && !settings.startWithEar) ? 0 : edgeBitRadius)}]);
    }
    if (settings.penSizeInPlankSize) {
	resultArray.pop();// splice(resultArray.length-1,1);
	resultArray.shift();//splice(0,1); //remove last and first pen lines
    } if (settings.startWithEar) {
	resultArray = rotate(ear,3*Math.PI/4).concat(resultArray).concat(rotate(ear, Math.PI/4));
    } if (settings.spaceFirst) {
	resultArray.unshift([{x:distance-(settings.startWithEar ? edgeBitRadius : 0),y:0}]);
	resultArray.push([{x:distance-(settings.startWithEar ? edgeBitRadius : 0),y:0}]);
    }
    return resultArray;
};

/**
 * deprecated use pensedge.
 */
pennenrand = function pennenrand(alpha, pendiepte, plankdikte, startWithPen,aantalPennen, settings) {
    dhx = pendiepte * Math.cos(alpha);
    dhy = pendiepte * Math.sin(alpha);
    pendikte = Math.abs(plankdikte/(2*aantalPennen- (startWithPen ? 1 :-1))/Math.cos(alpha));
    correction = (settings && settings['correction']) || 0;
    dpx_pen = (pendikte + correction) * Math.sin(alpha);
    dpy_pen = -1 * (pendikte + correction) * Math.cos(alpha);
    ycorrection = correction * Math.cos(alpha);
    dpx_gat = (pendikte - correction) * Math.sin(alpha);
    dpy_gat = -1 * (pendikte - correction) * Math.cos(alpha);
    result_array =  startWithPen ?  [] : [[{x:dpx_gat,y:dpy_gat}]];
    pen_overshoot = (settings && settings['overshoot']) || 0;
    duvelradius = (settings && settings['duvelradius']) || 0;
    if (pen_overshoot > 0) {
        dhxovershoot = (pendiepte > 0 ? 1 : -1) * pen_overshoot * Math.cos(alpha);
        dhyovershoot = (pendiepte > 0 ? 1 : -1) * pen_overshoot * Math.sin(alpha);
        for (var i=0;i<aantalPennen;i++) {
    	    if (i > 0) {
		result_array.push([{x:dpx_gat, y:dpy_gat}]);
	    }
    	    result_array = result_array.concat([[{x:dhx, y:dhy}],[{x:dhxovershoot*0.5,y:dhyovershoot*0.5},{x:dhxovershoot+dpx_pen*0.20,y:dhyovershoot+dpy_pen*0.20},{x: dpx_pen/2+dhxovershoot,y: dpy_pen/2+dhyovershoot}],[{x: dpx_pen*0.3,y: dpy_pen*0.3},{x: dpx_pen/2-dhxovershoot*0.5,y: dpy_pen/2-dhyovershoot*0.5},{x: dpx_pen/2-dhxovershoot,y: dpy_pen/2-dhyovershoot}],[{x:-1*dhx, y:-1*dhy}]]);
        }
    } else {
        for (i=0;i<aantalPennen;i++) {
	    if (i > 0) {
		result_array = result_array.concat([[{x:dpx_gat, y:dpy_gat}]]);
	    }
            result_array = result_array.concat([[{x:dhx,y:dhy}],[{x:dpx_pen, y:dpy_pen}],[{x:-1*dhx, y:-1*dhy}]]);
        }
    }
    if (startWithPen) {
	if (settings && settings.pensize_in_planksize) {
	    result_array.splice(0,1);
	    result_array.splice(result_array.length-1, 1);
	}
    } else {
	result_array = result_array.concat([[{x:dpx_gat, y:dpy_gat}]]);
    }
    return result_array;
};


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


//
// * calculates the angle of triangle where the "adjacent" is l1 + the projection of l2 on to the adjacent
// * that is l1 + l2*cos(angle)
// * @param h the size of the opposite
// * @param l1 part of the adjacent
// * @param l2 part of the hypothenuse, the projection of l2 on the adjacent, connected with l1 forms the complete adjacent.
// * @return the angle in radians
// */
function calculate_angle2(h,l1,l2) {
    var step = Math.PI/20;
    var ondergrens = 0;
    var bovengrens = Math.PI/2;
    var fit = 0;
    var best = 1000;
    var i = ondergrens;
    for (j = 0;j<10;j++) {
	for (i=ondergrens;i<=bovengrens;i += step) {
	    var uitkomst = h / (l1 + l2*Math.cos(i)) - Math.tan(i);
	    if (Math.abs(uitkomst) < Math.abs(best)) {
		best = Math.abs(uitkomst);
		fit = i;
	    }
	}
	ondergrens = fit-step;bovengrens=fit+step;
	step /= 10;
    }
    return i;
}

function direction(pt) {
    return { angle: Math.atan(pt.y/pt.x), length: Math.sqrt(pt.x * pt.x +  pt.y * pt.y) };
}

function edge(array, thickness) {
    var result = [];
    var rounding = 1;
    var previousDirection = null;
    for (i=0;i<array.length;i++) {
	if (i == 0) {
	    var previousDirection = direction(array[i][0]);
	    result.push([{prefix: " m ", x: Math.cos(previousDirection.angle + Math.PI/2) * thickness
			  , y: Math.sin(previousDirection.angle + Math.PI/2) * thickness}]
			,[{x: Math.cos(previousDirection.angle + Math.PI) * thickness * rounding
			   , y: Math.sin(previousDirection.angle + Math.PI) * thickness * rounding }
			  , { x: Math.cos (previousDirection.angle - Math.PI/2) * thickness * 2  + Math.cos(previousDirection.angle + Math.PI) * thickness * rounding
			      , y: Math.sin(previousDirection.angle - Math.PI/2) * thickness * 2 + Math.sin(previousDirection.angle + Math.PI) * thickness * rounding }
			  , {x: Math.cos(previousDirection.angle - Math.PI/2) * thickness * 2
			     , y: Math.sin(previousDirection.angle - Math.PI/2) * thickness * 2 }
			 ]);
	}
	result = result.concat([[array[i][0]]]);
	if (i != array.length-1 ) {
	    var nextPt = array[i+1][0];
	    var deltaAngle = direction(array[i][0]).angle - direction(nextPt).angle;
	    alert(deltaAngle / Math.PI * 180);
	}
    }
    return result;
}

function thicken(array, thickness) {
    returnArray = [];
    for (i=array.length-1;i>=0;i--) {
	returnArray = returnArray.concat([[{x:-1 * array[i][0].x, y:-1 * array[i][0].y}]]);
    }
    return array2String(edge(array, thickness), 0) + " " + array2String(edge(returnArray,thickness),0);
}


function foot_boomerang(hoek, factor, lengte_diag, breedte, pendikte, houtdikte, stand_dikte, settings) {
    if (settings && settings.variant == 1) {
	ronding = 200;
	ronding2 = 20;
        outlinefactor = 0.5;
        result = [[{x: Math.sin(hoek) * lengte_diag * factor, y:-1 * Math.cos(hoek) * lengte_diag * factor }]
		  ,  [{x:ronding * Math.sin(hoek), y: -1 * ronding * Math.cos(hoek)}
		      , {x:breedte - 2 * factor * Math.sin(hoek) * lengte_diag - ronding  * Math.sin(hoek) + (stand_dikte-houtdikte) * Math.cos(hoek)
			 ,y: -1 * ronding * Math.cos(hoek)}
		      , {x:breedte - 2 * factor * Math.sin(hoek) * lengte_diag + (stand_dikte-houtdikte) * Math.cos(hoek) ,y: 0}]
		  , [{x:Math.sin(hoek) * lengte_diag * factor, y: Math.cos(hoek) * lengte_diag * factor }]
		  , [{x:ronding2 * Math.sin(hoek), y: ronding2 * Math.cos(hoek)}
       		     , {x:-1 * stand_dikte * Math.cos(hoek) + ronding2 * Math.sin(hoek)
			, y:  stand_dikte * Math.sin(hoek) + ronding2 * Math.cos(hoek)}

		     , {x:-1 * stand_dikte * Math.cos(hoek), y:  stand_dikte * Math.sin(hoek)}]
		  , [{x: -1 * Math.sin(hoek) * lengte_diag * factor, y: -1 * Math.cos(hoek) * lengte_diag * factor }]
		  , [{x:ronding * outlinefactor * -1 * Math.sin(hoek), y: -1 * ronding * outlinefactor * Math.cos(hoek)}
		     , { x:2* Math.cos(hoek) * stand_dikte -(breedte - 2 * 0.2 * Math.sin(hoek) * lengte_diag + (stand_dikte-houtdikte) * Math.cos(hoek)) + ronding * outlinefactor * Math.sin(hoek), y:ronding * outlinefactor * -1 * Math.cos(hoek)}
		     , {x: 2* Math.cos(hoek) * stand_dikte -(breedte - 2 * 0.2 * Math.sin(hoek) * lengte_diag + (stand_dikte-houtdikte) * Math.cos(hoek))
			,y: 0}]
		  , [{x: -1 * Math.sin(hoek) * lengte_diag * factor, y: Math.cos(hoek) * lengte_diag * factor }]
		  , [{x:-1* ronding2 * Math.sin(hoek), y: ronding2 * Math.cos(hoek)}
       		     , {x:-1 * stand_dikte * Math.cos(hoek) + ronding2 * Math.sin(hoek)
			, y:  -1 * stand_dikte * Math.sin(hoek) + ronding2 * Math.cos(hoek)}
		     , {x:-1 * stand_dikte * Math.cos(hoek), y: -1*  stand_dikte * Math.sin(hoek)}]
		 ];

	return array2String(result) + " m " + Math.cos(hoek) * (stand_dikte - houtdikte)/2 + " " + Math.sin(hoek) * (stand_dikte - houtdikte)/2
	    + " " + balk(-1*hoek, pendikte, houtdikte) + " m " + (2*pendikte) * Math.sin(hoek) + " " + (-2*pendikte) * Math.cos(hoek)
	    + " " + balk(-1*hoek, pendikte, houtdikte) + " m " + (2*pendikte) * Math.sin(hoek) + " " + (-2*pendikte) * Math.cos(hoek)
	    + " " + balk(-1*hoek, pendikte, houtdikte)
	    + " m " + ((-4*pendikte) * Math.sin(hoek) + breedte + Math.cos(hoek) * -1 * houtdikte) + " "
	    + ((4*pendikte) * Math.cos(hoek) + Math.sin(hoek) * houtdikte)
	    + " " + balk(hoek, pendikte, houtdikte) + " m " + (- 2*pendikte) * Math.sin(hoek) + " " + (-2*pendikte) * Math.cos(hoek)
	    + " " + balk(hoek, pendikte, houtdikte) + " m " + (- 2*pendikte) * Math.sin(hoek) + " " + (-2*pendikte) * Math.cos(hoek)
	    + " " + balk(hoek, pendikte, houtdikte);

    } else { return ""; }
}

function routerEar(bitRadius) {
    if (!bitRadius) {
	return [];
    } else {
	return [[{x:-1 * bitRadius, y:0}],[{x:0, y:-2 * bitRadius}], [{x:bitRadius, y:0}]];
    }
}

/**
 * Produces an svg string for square pocket.
 * h being height, b being width, aantal: number. The pen is positioned (moved) over the x axis with b units (ready for the next hole).
 * Settings is optional and may contain: 
 * settings.height_correction (deprecated)
 * settings.width_coorection (deprecated) decreases the given height and width with its value the remaining panel is centered.
 * settings.bit_radius is a cnc parameter, as a circular bit wil leave some material uncut (which is not desireble within a square hole) this parameter extends the pocket with "ears" to make sure everything in the pocket is milled (alas there is some overshoot as well).
 */
squareHole = function gat(h, b, settings) {
    if (typeof settings == 'undefined') {
	settings = {widthCorrection: 0, heightCorrection:0, bitRadius:0};
    }
    settings.widthCorrection = (settings.widthCorrection ? settings.widthCorrection : 0);
    settings.heightCorrection = (settings.heightCorrection ? settings.heightCorrection : 0);
    var result = "";
    if (!settings.bitRadius) {
	    result =  " l " + (b-settings.widthCorrection) + " 0 l 0 " + (h-settings.heightCorrection) + " l " + -1*(b-settings.widthCorrection) + " 0 l 0 " + -1*(h-settings.heightCorrection);
	} else {
	    var edgeBitRadius = settings.bitRadius*Math.sqrt(2);
	    var ear = routerEar(settings.bitRadius);
	    var width  = b-settings.widthCorrection - 2 * edgeBitRadius;
	    var height = h-settings.heightCorrection - 2 * edgeBitRadius;
	    result += " m 0 " + edgeBitRadius + " " + array2String(ear, Math.PI/4)
		+ " l" + width + " 0 " + array2String(ear, 3* Math.PI/4)
		+ " l0 " + height  + " " + array2String(ear, 5* Math.PI/4)
		+ " l" + (-1 * width)  + " 0 " + array2String(ear, 7* Math.PI/4)
    		+ " l0 " + -1 * height + " m 0 " + -1 * edgeBitRadius
	    ;

	}
    result += " m " + 2*(b+settings.widthCorrection) + " 0 ";
    return result;
};

/*
 * settings is optional and may contain an heightCorrection, an widthCorrection and display. If display is false or 0 nothing will be rendered.
 */
squareHoles = function gats(h, b, aantal, settings) {
    var result = "";
    if (settings && typeof settings.display != 'undefined' && !settings.display) {
	return result;
    }
    if (typeof settings == 'undefined') {
	settings = {};
    }
    if (settings) {
	settings.heightCorrection = (settings.heightCorrection ? settings.heightCorrection : 0);
	settings.widthCorrection = (settings.widthCorrection ? settings.widthCorrection : 0);
    }
    for (var i=0;i<aantal;i++) {
        result += squareHole(h,b, settings);
    }
    return result;
};
