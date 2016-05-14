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

DxfBuilder = function(blobber, snfc) {
    PathBuilder.apply(this);
    if (snfc) { this.significance = snfc; }
    this.blobBuilder = blobber;
    this.virgin = true;
    this.layers={};
    this.extra_elements = [];
}

DxfBuilder.prototype = new PathBuilder();

DxfBuilder.prototype.isVirgin = function(experienced) {
    if(experienced) {
	var result = this.virgin;
	this.virgin = false;
	return result;
    }
    return(this.virgin);
}

DxfBuilder.prototype.incorporateOptions = function(options) {
    this.startPoint = options.startPoint ? utils.extend({x:0, y:0}, options.startPoint) : undefined;
    this.layers[options.layer.name ] = options.layer;
    this.focusLayer = options.layer.name;
    this.focusColor = options.color;
    this.bezierPoly = new Bezier2Poly(options.bezier_tolerance);
}

DxfBuilder.prototype._flush = function () {
    var moves = this.prepareFlush(this.isVirgin() ? this.startPoint : undefined);
    var x=this.location.x, y=this.location.y;
    if (moves.relative || moves.absolute || this.isVirgin()) {
	if (moves.absolute) {
	    // the location knows where you are.
	    // x += moves.relative.x;
	    // y += moves.relative.y;
	}
	if (moves.relative) {
	    // the location knows where you are.
	    // x += moves.relative.x;
	    // y += moves.relative.y;
	}
	this.blobBuilder.append((this.isVirgin(true) ? "" : "\n  0\n*SEQRET*") + "\n  0\nPOLYLINE\n  6\nSOLID\n 62" 
				+ "\n" + (this.focusColor || "256") 
				+ "\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer) 
				+ "\n 66\n1\n 10\n0.0\n 20\n0.0\n 30\n0.0\n 70\n0"  // todo: last 70 maybe adjusted to reflect closed polygon lines.
				+ "\n  0\nVERTEX\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer) 
				+ "\n 10\n" + this.signify(x) 
				+ "\n 20\n" + this.signify(y) + "\n 30\n0");
    }
}

DxfBuilder.prototype.lineMove = function(pt) {
	pt = utils.extend(true, {x:0, y:0,prefix: 'l'}, pt);
	if (pt.prefix === 'm') {
	    this.move(pt, false);
	} else if (pt.prefix === 'M') {
	    this.move(pt, true);
	} else {
	    this._flush();
	    this.blobBuilder.append("\n  0\nVERTEX\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer) 
				    + "\n 10\n" + this.signify(this.location.x + pt.x) + "\n 20\n" + this.signify(this.location.y + pt.y) + "\n 30\n0");
	}
}
// 280, 20 -> 20, 280 (280-20 > 180 && 20 < 180)
//

DxfBuilder.prototype.arc = function(arc) {
    this._flush();
    if (!arc.cx === undefined || !arc.cy === undefined) {
	throw "center x & center y need to be specified in cx, cy"; 
    }
    this.arcElement = function(arc) {
	var a = mod(Math.atan2(-arc.cy, -arc.cx) / 2 / Math.PI * 360, 360);
        var b = mod(Math.atan2(arc.y-arc.cy, arc.x-arc.cx) / 2 / Math.PI * 360,360);
	// clockWise: orientation is from large numbers to small numbers.
	var orientation = a-b > 0 ? arc.dxfClockWise : !arc.dxfClockWise;
	var angles = [orientation ? Math.max(a,b) : Math.min(a,b), orientation ? Math.min(a,b) : Math.max(a,b)];
	return "\n  0\nARC\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer)
	    + "\n 10\n" + this.signify(this.location.x + arc.cx)+ "\n 20\n" 
	    + this.signify(this.location.y + arc.cy) +"\n 30\n0.0\n 40\n" + this.signify(arc.r) + "\n 50\n" + this.signify(angles[arc.large_arc ? 1 : 0]) 
            + "\n 51\n" + this.signify(angles[arc.large_arc ? 0 : 1]);
    }
    this.extra_elements.push(this.arcElement(arc));
    this.move(arc, false);
}

DxfBuilder.prototype.circle = function(r) {
    this._flush();
    this.extra_elements.push("\n  0\nCIRCLE\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer) 
				    + "\n 10\n" + this.signify(this.location.x)+ "\n 20\n" 
			    + this.signify(this.location.y) +"\n 30\n0.0\n 40\n" + r);
}

DxfBuilder.prototype.bezier = function(pt) {
    this._flush();
    var pb = new PathBuilder(4);
    var bezier = utils.extend(true,{x:0, y:0, cp1:{x:0, y:0}}, pt);
    // Make from a quadratic a cubic bezier curve.
    if (! bezier.cp2 ) {
	bezier.cp2 = {x: bezier.cp1.x, y:bezier.cp2.y};
    } else {
	bezier.cp2 = utils.extend(true, {x:0, y:0}, bezier.cp2);
    }
    var vertices = this.bezierPoly.convert([{x:bezier.cp1.x, y:bezier.cp1.y}, {x:bezier.cp2.x, y:bezier.cp2.y}, {x:bezier.x, y:bezier.y}], true);
    var tempLocation = {}; 
    tempLocation.x = this.location.x;
    tempLocation.y = this.location.y;
    vertices.forEach(function(elem){
	    tempLocation.x += elem.x;
	    tempLocation.y += elem.y;
	    this.blobBuilder.append("\n  0\nVERTEX\n  8\n" + (!this.focusLayer || this.focusLayer === 'default' ? "0" : this.focusLayer) 
				    + "\n 10\n" + this.signify(tempLocation.x) + "\n 20\n" + this.signify(tempLocation.y) + "\n 30\n0");
	}, this);
}

DxfBuilder.prototype.getHeader = function(layers,secret, uom) {
    var result = "  0\nSECTION\n  2\nHEADER\n  9\n$ACADVER\n  1\nAC1009\n  9\n$EXTMIN\n 10\n0.0\n 20\n0.0\n 30\n0.0\n  9\n$EXTMAX\n 10\n100.0\n 20\n100.0\n 30\n0.0\n  9\n$INSBASE\n 10\n0.0\n 20\n0.0\n 30\n0.0\n  9\n$INSUNITS\n 70\n*UNITSOFMEASUREMENT*\n0\nENDSEC\n  0\nSECTION\n  2\nTABLES\n  0\nTABLE\n  2\nLTYPE\n 70\n19\n  0\nENDTAB\n  0\nTABLE\n  2\nLAYER\n 70\n6\n  0\nLAYER\n  2\nDIMENSIONS\n 70\n0\n 62\n1\n  6\nCONTINUOUS\n  0\nLAYER\n  2\nTABLECONTENT\n 70\n0\n 62\n1\n  6\nCONTINUOUS\n  0\nLAYER\n  2\njeroen\n 70\n0\n 62\n5\n  6\nCONTINUOUS*LAYERS*\n  0\nLAYER\n  2\nTABLEBACKGROUND\n 70\n0\n 62\n1\n  6\nCONTINUOUS\n  0\nLAYER\n  2\nTABLEGRID\n 70\n0\n 62\n1\n  6\nCONTINUOUS\n  0\nLAYER\n  2\nVIEWPORTS\n 70\n0\n 62\n7\n  6\nCONTINUOUS\n  0\nENDTAB\n  0\nTABLE\n  2\nSTYLE\n 70\n12\n  0\nENDTAB\n  0\nTABLE\n  2\nVIEW\n 70\n0\n  0\nENDTAB\n  0\nTABLE\n  2\nAPPID\n 70\n1\n  0\nAPPID\n  2\nDXFWRITE\n 70\n0\n  0\nENDTAB\n  0\nTABLE\n  2\nVPORT\n 70\n0\n  0\nENDTAB\n  0\nTABLE\n  2\nUCS\n 70\n0\n  0\nENDTAB\n  0\nENDSEC\n  0\nSECTION\n  2\nBLOCKS\n  0\nENDSEC\n  0\nSECTION\n  2\nENTITIES\n  0\nVIEWPORT\n  8\nVIEWPORTS\n 67\n1\n 10\n0.0\n 20\n0.0\n 30\n0.0\n 40\n1.0\n 41\n1.0\n 68\n1\n 69\n1\n1001\nACAD\n1000\nMVIEW\n1002\n{\n1070\n16\n1010\n0.0\n1020\n0.0\n1030\n0.0\n1010\n0.0\n1020\n0.0\n1030\n0.0\n1040\n0.0\n1040\n1.0\n1040\n0.0\n1040\n0.0\n1040\n50.0\n1040\n0.0\n1040\n0.0\n1070\n0\n1070\n100\n1070\n1\n1070\n3\n1070\n0\n1070\n0\n1070\n0\n1070\n0\n1040\n0.0\n1040\n0.0\n1040\n0.0\n1040\n0.1\n1040\n0.1\n1040\n0.1\n1040\n0.1\n1070\n0\n1002\n{\n1002\n}\n1002\n}";
    var layertext = "";
    Object.keys(layers).forEach(function(layer) { layertext += "\n  0\nLAYER\n  2\n" + layer + "\n 70\n0\n 62\n" + (this.layers[layer]["layer_color"] || "7") +" \n  6\nCONTINUOUS" }, this);
    result = result.replace(/\*LAYERS\*/g, layertext);
    uom = uom || 'mm';
    var uom2DXF = { 'unitless': '0'
		, 'inches':'1'
		, 'feet':'2', 'miles':'3'
		, 'millimeters':'4', 'mm':'4'
		, 'centimeters':'5', 'cm':'5'
		, 'meters':'6', 'm':'6'
		, 'kilometers':'7', 'km':'7'
		, 'microinches':'8', 'mils':'9', 'yards':'10', 'angstroms':'11', 'nanometers':'12'};
    var dxfUom =  uom2DXF[uom.toLowerCase()];
    result = result.replace(/\*UNITSOFMEASUREMENT\*/g, uom2DXF[uom.toLowerCase()]);
    return result;
}

DxfBuilder.prototype.getBlob = function(secret, uom) {
    //bb = new window.BlobBuilder(); // window.BlobBuilder is set in index.html
    this.blobBuilder.prepend(this.getHeader(this.layers, secret, uom));
    this.blobBuilder.append("\n  0\nENDSEC\n  0\nEOF");
    for (var i=0;i<this.blobBuilder.arrayText.length;i++) {
	this.blobBuilder.arrayText[i] = this.blobBuilder.arrayText[i].replace(/\*SEQRET\*/g, secret);
    }
//    bb.append(this.blobBuilder.text.replace(/\*SEQRET\*/g, secret));
    return new Blob(this.blobBuilder.arrayText, {type: 'text/plain'});
}


iPath.prototype.dxf = function(dxfBuilder, options) {
    options = utils.extend(true, {layer: {name: 'default', layer_color: "7" }, bezier_tolerance: 0.12}, options || {});
    dxfBuilder.incorporateOptions(options);
    dxfBuilder.virgin = true;
    this.traverse(dxfBuilder);
    dxfBuilder.blobBuilder.append("\n  0\n*SEQRET*");
    dxfBuilder.extra_elements.forEach(function (element) {
	dxfBuilder.blobBuilder.append(element);
    });
    dxfBuilder.extra_elements = [];
    dxfBuilder.moveCache = [];
    return dxfBuilder;
}
