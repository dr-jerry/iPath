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

var uts = {trim : function (a) {
    return a.trim()}}

describe("iPath", function() {
  var _iPath;
  //jasmineFix removes trailing spaces and replace remaining spaces with dots. 
  // This prevents multiple space differences to be lost in html display.
  var jasmineFix = function(str) {
      return uts.trim(str).replace(/ /g, '.').replace(/\n/g,'\\n');
  }
  // signify function to be called in a json string.
  var signy = function(key, val) {
      return val.toFixed ? Number(val.toFixed(3)) : val;
//      return val.toFixed ? Number(val.toPrecision(4)) : val;
  };
  

  beforeEach(function() {
	  _iPath = new iPath();
  });
    it ("tests the arcPath with default filletradius", function() {
	var ttt = {supporter_length : 240, band_thk: 18, angle: Math.PI/12, band_width: 50, thk: 12};
	ttt.t2 = arcPath([{x:-40,y:0},{fr:88},{x:-ttt.supporter_length+60+ttt.band_thk/Math.cos(ttt.angle)+1,y:-20},{x:0,y:-15}],10);
	expect(ttt.t2.dPath(3)).toEqual("..");
	ttt.supporter= new iPath()//arcPath([{x:0,y:-15},{x:ttt.supporter_length-40,y:-20},{ fr:60},{x:60,y:0}, {x:-20,y:70},{fr:5}, {x:-20,y:0}], 8)
	    .line(-1000,0)
	    .concat(arcPath([{x:-40,y:0},{fr:88},{x:-ttt.supporter_length+60+ttt.band_thk/Math.cos(ttt.angle)+1,y:-20},{x:0,y:-15}], 7)).move(-10,35-Math.cos(ttt.angle)*ttt.band_width+ttt.thk+5)
	    .boxEdge(180,0,{make_hole: true, pens_height: -ttt.thk, preferred_pen_length: 20, bit_radius: ttt.bit_radius, calc_pen_length: ttt.info, fit_correction: ttt.fc });
	ttt.t2 = arcPath([{x:-40,y:0},{fr:88},{x:-ttt.supporter_length+60+ttt.band_thk/Math.cos(ttt.angle)+1,y:-20},{x:0,y:-15}],10);
	;

	expect(jasmineFix(ttt.supporter.dPath(3))).toEqual("l.-1000.0.-34.534.0.a.88.88.0.0.1.-10.891.-0.676..l.-154.941.-19.324.0.-15.m.10.3.704.l.0.-12.20.0.0.12.-20.0.m.40.0.l.0.-12.20.0.0.12.-20.0.m.40.0.l.0.-12.20.0.0.12.-20.0.m.40.0.l.0.-12.20.0.0.12.-20.0");
	expect(jasmineFix(ttt.t2.dPath(3))).toEqual("-34.534.0.a.88.88.0.0.1.-10.891.-0.676..l.-154.941.-19.324.a.10.10.0.-15");
    });
    it("tests arcPath with specific r = 0, and global r > 0", function() {
	var crn = arcPath([{x:80,y:0},{x:0,y:-80},{fr:0},{x:-160,y:-60}],10);
	expect(jasmineFix(crn.dPath(3))).toEqual('l.70.0.a.10.10.0.0.0.10.-10..l.0.-70.-160.-60');
    });
      it ("should display a proper curve(5)", function() {
	  _iPath.bezier({x: 50, y: 50, cp1: {x: 50}, cp2:{y:50}});
	  expect(_iPath.dPath({x:50, y: 50})).toEqual("M 50 50  c 50 0 0 50 50 50");
      });

    it ("test gear error", function() {
	gear = {n: 3, r: 150, h: 20, arcrad: 0};
	gear.ribbon = gear.r * Math.sin(Math.PI/gear.n) * 2 ;
	gear.toothAngle = Math.atan(2* gear.h, gear.ribbon);
	gear.toothSide = gear.ribbon / (2*Math.cos(gear.toothAngle));
	gear.iPath = new iPath().turtleLine({a: (2*Math.PI / gear.n) - gear.toothAngle, r: gear.toothSide})
	    .turtleLine({a: 2*gear.toothAngle, r: gear.toothSide}).turtleLine({a:-gear.toothAngle})
	    .repeat(gear.n);
	gear.l = gear.iPath.dPath(7).substring(3).split(/ +/).map(Number);
	gear.l2 = [];
	for (var i = 0;i < gear.l.length;i += 2) {
	    console.log("i is " + i);
	    gear.l2.push ({x:gear.l[i], y:gear.l[i+1]});
	    gear.l2.push({fr:gear.arcrad});
	}
	gear.l3= arcPath(gear.l2);
	console.log("l3 is " + JSON.stringify(gear.l3));
	console.log("l3 is " + gear.l3.dPath());
	expect (jasmineFix(arcPath(gear.l2).dPath(3))).toEqual('l.4435.048.2710.576.-4564.952.-2485.576.-4564.952.2485.576.4435.048.-2710.576.129.904.-5196.152.129.904.5196.152');
    });
     it ("tests a very simple arcPath", function() {
	var t1 = [{x:100,y:100},{fr:5},{x:100,y:-100},{x:20,y:30}];
//	arcPath(t1);
	expect (jasmineFix(arcPath(t1).dPath(3))).toEqual('l.96.464.96.464.a.5.5.0.0.0.7.071.0..l.96.464.-96.464.20.30');
    });
     it ("tests a very simple arcPath with poly", function() {
	 var t1 = [{x:100,y:100},{fr:5, lines:1},{x:100,y:-100},{x:20,y:30}];
//	arcPath(t1);
	 expect (jasmineFix(arcPath(t1).dPath(3))).toEqual('l.96.464.96.464.7.071.0.96.464.-96.464.20.30');
    });
    it ("tests a very simple poly overcut", function() {
	var crn2 = arcPath([{x:80,y:0},{br:-5},{x:0,y:80},{x:-80,y:-80}]);
	console.log("test");
	expect(jasmineFix(crn2.dPath(3))).toEqual("l.72.929.0.3.536.-3.536.7.071.7.071.-3.536.3.536.0.72.929.-80.-80");
    });

    it ("tests the reflectPath", function() {
	var tc = { gutter : 3, boneLength: 5, width: 24, length: 52};
	var p1 = [{x:3, y:0}, {x:3, y:3}, {x:0, y:3}, {x:6-tc.gutter, y:2}, {x:0, y: tc.boneLength-8}, {x:(tc.width-tc.gutter)/2, y:0}, {x:0, y:-tc.length}];
	var pr = reflectPath(p1,{x:1,y:1});
	expect (jasmineFix(arcPath(pr).dPath(3))).toEqual("l.3.0.3.3.0.3.3.2.0.-3.10.5.0.0.-52.52.0.0.-10.5.3.0.-2.-3.-3.0.-3.-3.0.-3");
    });
    it ("tests the extendPoint", function(){
	expect (JSON.stringify(extendPoint({x:30,y:30}))).toEqual('{"a":0.7853981633974483,"r":42.42640687119285,"x":30,"y":30}');
    });
    it ("test the nextAkin fcy", function() {
	var pth = new iPath().line(10,0).line(20,20).line(30,30);
	expect (JSON.stringify(pth.nextAkin(-1))).toEqual('{"x":30,"y":30,"prefix":"l"}');
    });
    if ("tests the void fillet", function() {
	var pth = new iPath().line(10,0).fillet(4).line(0,20);
	expect (JSON.stringify(pth.dPath(3))).toEqual("l 10 0 0 20");
    });
  it("tests a polar rotate", function() {
      var ear = new iPath().turtleLine({a:0, r:30}).turtleLine({a:Math.PI/2, r:30}).turtleLine({a:Math.PI/2,r:30});
      expect(jasmineFix(ear.dPath(3))).toEqual("l.30.0.0.30.-30.0");
  });
  it("tests new functionality return and analyze the calc_pen_length", function() {
      var debug = {};
      new iPath().boxEdge(160,0,{preferred_pen_length: 20, pens_height: 10, calc_pen_length : debug});
      expect(debug.nr + ", " + signy(1,debug.lngth)).toEqual("9, 17.778");
  });
    it("tests the dxf functionality for turtleLines", function() {
	var tst = new iPath().turtleLine({a:0, r:65.4}).turtleLine({a:Math.PI/2, r:12.3/2})
	.turtleLine({a:-Math.PI/2, r:5.4})
	.turtleLine({a:Math.PI, r:5.4})
	.turtleLine({a:-Math.PI/2,r:12.3/2})
        .turtleLine({a:Math.PI/2,r:65.4}).turtleLine({a:-Math.PI/2}).repeat(4);
	var dxfBuilder = new DxfBuilder(new Blobber(), 3);
	tst.dxf(dxfBuilder, {layer: {name:'one', layer_color: 6}, startPoint: {x:50,y:50}});
	expect(1).toEqual(1);
	

});

  it("tests boxEdge", function() {
      expect("10:" + jasmineFix(new iPath().setSettings({pens_height:-4, make_hole:true, bit_radius: 0.1}).boxEdge( 20, 0, {preferred_pen_length:4}).dPath(3)))
	  .toEqual('10:m.4.-0.141.l.0.-3.717.-0.071.-0.071.0.141.-0.141.0.071.0.071.3.717.0.0.071.-0.071.0.141.0.141.-0.071.0.071.0.3.717.0.071.0.071.-0.141.0.141.-0.071.-0.071.-3.717.0.-0.071.0.071.-0.141.-0.141.0.071.-0.071.m.8.0.l.0.-3.717.-0.071.-0.071.0.141.-0.141.0.071.0.071.3.717.0.0.071.-0.071.0.141.0.141.-0.071.0.071.0.3.717.0.071.0.071.-0.141.0.141.-0.071.-0.071.-3.717.0.-0.071.0.071.-0.141.-0.141.0.071.-0.071');
      expect("9:" + jasmineFix(new iPath().setSettings({fit_correction:1}).boxEdge( 20, 0, {preferred_pen_length:4, pens_height: 4}).dPath(3)))
	  .toEqual('9:l.5.0.0.4.2.0.0.-4.6.0.0.4.2.0.0.-4.5.0');
      expect("1,"+ jasmineFix(new iPath().setSettings({preferred_pen_length:4, pens_height: -4, fit_correction: 1})
			.boxEdge( 0, 20).dPath(3))).toEqual('1,l.0.4.4.0.0.4.-4.0.0.4.4.0.0.4.-4.0.0.4');
      expect("2:" + jasmineFix(new iPath().setSettings({modify_end_point: true}).boxEdge( 20, 0, {preferred_pen_length:4, pens_height: -4}).dPath(3)))
	  .toEqual('2:l.4.0.0.-4.4.0.0.4.4.0.0.-4.4.0.0.4.4.0');
      expect("3:" + jasmineFix(new iPath().setSettings({modify_end_point: true, correction: 3}).boxEdge( 20, 0, {preferred_pen_length:4, pens_height: -4}).dPath(3)))
	  .toEqual('3:l.1.0.0.-4.4.0.0.4.4.0.0.-4.4.0.0.4.1.0');
      expect("4:" + jasmineFix(new iPath().setSettings({modify_end_point: false, correction: 3, reverse: true}).boxEdge( 20, 0, {preferred_pen_length:4, pens_height: -4}).dPath(3)))
	  .toEqual("4:l.0.714.0.0.4.3.714.0.0.-4.3.714.0.0.4.3.714.0.0.-4.3.714.0.0.4.3.714.0.0.-4.0.714.0");
      expect("5:" + jasmineFix(new iPath().boxEdge(50,0,{bit_radius: 0.3, preferred_pen_length:12, pens_height:4}).dPath(3)))
	  .toEqual("5:l.9.576.0.0.212.-0.212.0.424.0.424.-0.212.0.212.0.3.576.10.0.0.-3.576.-0.212.-0.212.0.424.-0.424.0.212.0.212.9.151.0.0.212.-0.212.0.424.0.424.-0.212.0.212.0.3.576.10.0.0.-3.576.-0.212.-0.212.0.424.-0.424.0.212.0.212.9.576.0");
      expect("6:" + jasmineFix(new iPath().boxEdge(-50,0,{bit_radius: 0.3, preferred_pen_length:12, pens_height:4}).dPath(3)))
	  .toEqual("6:l.-9.576.0.-0.212.0.212.-0.424.-0.424.0.212.-0.212.0.-3.576.-10.0.0.3.576.0.212.0.212.-0.424.0.424.-0.212.-0.212.-9.151.0.-0.212.0.212.-0.424.-0.424.0.212.-0.212.0.-3.576.-10.0.0.3.576.0.212.0.212.-0.424.0.424.-0.212.-0.212.-9.576.0");
      expect("7:" + jasmineFix(new iPath().boxEdge(0,50,{bit_radius: 0.3, preferred_pen_length:12, pens_height:4, reverse:true}).dPath(3)))
	  .toEqual("7:l.0.9.576.-0.212.0.212.0.424.0.424.0.212.-0.212.3.576.0.0.10.-3.576.0.-0.212.-0.212.-0.424.0.424.0.212.0.212.0.9.151.-0.212.0.212.0.424.0.424.0.212.-0.212.3.576.0.0.10.-3.576.0.-0.212.-0.212.-0.424.0.424.0.212.0.212.0.9.576");

  });
  it ("tests the emptied moveCache after a call to dPath() or dxf()", function() {
     var pth = new iPath().line(20,40).move(20,40);
     var dxfBuilder = new DxfBuilder(new Blobber(), 3);
     pth.dxf(dxfBuilder,{layer: {name: 'ladeHouder', layer_color: 6}, startPoint: {x:200,y:200}});
     expect(dxfBuilder.moveCache.length).toEqual(0);
  });
  it ("[Not yet implemented] tests the combined concation of concat, reverse and reflect", function() {
     var b1 = new iPath().bezier(-2,0,-2,0,-2,4).bezier(-7,0,-7,7,2,7).concatReflect({x:1});
     var b2 = new iPath().bezier(-2,0,-2,0,-2,4).bezier(-7,0,-7,7,2,7);
     expect(b1.dPath(3)).toEqual(b2.concat(new iPath().reverse(b2).reflect({x:1}).dPath(3)))
  });
  it ("[Not yet implemented] tests reflection of turtleLines", function() {
      expect("1:" +jasmineFix( new iPath().turtleLine({a: Math.PI/2, r: 50}).turtleLine({a: -Math.PI/4, r: 30}).reflect({x:1}).dPath(3))).toEqual("1:l.0.-50.21.213.-21.213");
      expect("2:" +jasmineFix( new iPath().turtleLine({A: Math.PI/4, r: 20}).reflect({x:1}).dPath(3))).toEqual('2:l.14.142.-14.142');
      expect("3:" +jasmineFix( new iPath().boxEdge(18,0,{preferred_pen_length:6, pens_height:3}).reflect({x:1}).reflect({x:1}).dPath(3))).toEqual("3:" + jasmineFix(new iPath().boxEdge(18,0,{preferred_pen_length:6, pens_height:3}).dPath(3)));
      expect("4:" +jasmineFix( new iPath().turtleLine({a: Math.PI/6, r: 50}).turtleLine({a: Math.PI/3, r: 30}).reflect({x:1}).dPath(3))).toEqual("4:l.43.301.-25.0.-30");
  });
  
  it ("test a problematic split", function() {
	  var b = new Bezier2Poly(0.5);
      	  var array = [{"x":-3.3,"y":0},{"x":-5.5,"y":-9},{"x":-5.5,"y":-18}];
	  expect(JSON.stringify(b.convert(array.slice(0), true), signy)).toEqual('[{"x":-1.184,"y":-0.404},{"x":-1.068,"y":-1.143},{"x":-1.736,"y":-4.078},{"x":-1.512,"y":-12.375}]');
      });
  
  it ("tests the negative length with a turtleLine", function() {
      expect(new iPath().turtleLine({a:Math.PI/2, r:-5}).turtleLine({a:-Math.PI/2, r:5}).dPath(3).trim()).toEqual('l 0 -5 5 0');
      var tst = new iPath().turtleLine({a:Math.PI/2, r:-5});
      tst.dPath(3);
      expect(tst.heading.toPrecision(4)).toEqual('1.571');
  });

  it ("[Not yet implemented (with arcs)] tests the length function", function() {
    var b = new iPath().line(30,40).line(40,0).line(0,20);
    expect(b.length()).toEqual(110);
    var lb = new lengthBuilder(0.2);
    var bezier = {cp1: {x: 10, y:0}, cp2: {x: 20, y:30}, x: 50, y: 60};
    var pb = new PathBuilder(3);
    lb.bezier(bezier);
    var l = lb.length;
    console.log('starting');
    expect(pb.signify(l)).toEqual('78.834');
    b = new iPath().line(20,0).bezier(bezier);
    expect(b.length()).toEqual(l+20);
    b = new iPath().line(20,0).line(0,40).move(20,0).line(20,0);
    expect(b.length()).toEqual(80);
    b = new iPath().bezier(20,0,0,20,20,20).bezier(20,0,0,-20,20,-20);
    expect(b.dPath(3,0.01).trim()).toEqual('l 0.668 0.045');
    b = words.form('to');
    expect(pb.signify(b.length())).toEqual('432.763');
    expect(jasmineFix(b.skew(0.1, 0).dPath(3, 0.39).trim())).toEqual('c.13.-30.29.-90.20.-50.1.8.-8.-11.60.-12.70..l.1.145.-17.35');
});
  it ("tests the grow functionality", function() {
    var b = new iPath().line(30,40).line(30,0).line(0,20);
    expect(b.dPath(3,0.5).trim()).toEqual('l 30 40');
    var b = new iPath().line(30,40).line(30,0).line(0,20);
    expect(b.dPath(3, 0.2).trim()).toEqual('l 12 16');
    expect(b.dPath(3, 0.4).trim()).toEqual('l 24 32');
    expect(b.dPath(3, 0.85).trim()).toEqual('l 30 40 30 0 0 5');
});
  
  it ("test a splitbezier", function() {
	  var b = new Bezier2Poly(0.5);
      	  var array = [{x:20, y:0}, {x:0,y:20}, {x:20, y:20}];
	  expect(JSON.stringify(b.splitBezier(array.slice(0), 0.5), signy)).toEqual('{"b1":[{"x":10,"y":0},{"x":10,"y":5},{"x":10,"y":10}],"b2":[{"x":0,"y":5},{"x":0,"y":10},{"x":10,"y":10}]}');
	  expect(JSON.stringify(b.splitBezier(array.slice(0), 0.1), signy)).toEqual('{"b1":[{"x":2,"y":0},{"x":3.6,"y":0.2},{"x":4.88,"y":0.56}],"b2":[{"x":11.52,"y":3.24},{"x":-2.88,"y":19.44},{"x":15.12,"y":19.44}]}');
	  expect(JSON.stringify(b.splitBezier(array.slice(0), 0.9), signy)).toEqual('{"b1":[{"x":18,"y":0},{"x":3.6,"y":16.2},{"x":15.12,"y":19.44}],"b2":[{"x":1.28,"y":0.36},{"x":2.88,"y":0.56},{"x":4.88,"y":0.56}]}');
      });

  it ("test angle difference", function() {
	  var b = new Bezier2Poly(0.5),pb = new PathBuilder(3);
	  expect(b.calculateAngleBetweenVectors({x:1,y:1}, {x:3,y:3})).toEqual(0);
	  expect(pb.signify(b.calculateAngleBetweenVectors({x:1,y:1}, {x:-1,y:-1}))).toEqual('3.142');
	  expect(pb.signify(b.calculateAngleBetweenVectors({x:1,y:0}, {x:0,y:-1}))).toEqual('1.571');
      });
  it ("tests a convert bezier",function () {
      var b = new Bezier2Poly(0.5),pb = new PathBuilder(3);
      	  var array = [{x:20, y:0}, {x:0,y:20}, {x:20, y:20}];
	  expect(JSON.stringify(b.convert(array.slice(0)), signy)).toEqual('[{"x":5.781,"y":0.859},{"x":2.969,"y":2.266},{"x":1.094,"y":3.203},{"x":0.156,"y":3.672},{"x":0.156,"y":3.672},{"x":1.094,"y":3.203},{"x":2.969,"y":2.266},{"x":5.781,"y":0.859}]');
	  var nrOfVertices = b.vertices.length;
	  b.convert(array.slice(0));
	  expect(2*nrOfVertices).toEqual(b.vertices.length);
	  b.convert(array.slice(0),true);
	  expect(nrOfVertices).toEqual(b.vertices.length);
          expect(b.iPath(array.slice(0)).dPath(3).trim()).toEqual('l 5.781 0.859 2.969 2.266 1.094 3.203 0.156 3.672 0.156 3.672 1.094 3.203 2.969 2.266 5.781 0.859 5.781 0.859 2.969 2.266 1.094 3.203 0.156 3.672 0.156 3.672 1.094 3.203 2.969 2.266 5.781 0.859');
      }); 
  it ("tests a bezier in dxf",function () {
      var b = new Bezier2Poly(0.5),pb = new PathBuilder(3);
      	  var array = [{x:20, y:0}, {x:0,y:20}, {x:20, y:20}];
	  expect(JSON.stringify(b.convert(array), signy)).toEqual('[{"x":5.781,"y":0.859},{"x":2.969,"y":2.266},{"x":1.094,"y":3.203},{"x":0.156,"y":3.672},{"x":0.156,"y":3.672},{"x":1.094,"y":3.203},{"x":2.969,"y":2.266},{"x":5.781,"y":0.859}]');
      });
  it ("tests a pensedge in dxf",function () {
	  var pe = new iPath().pensEdge(55/5,15,3,{overshoot: 18, penSizeInPlankSize: false}).reflect({y:1});
	  dxfBuilder = new DxfBuilder(new Blobber(), 3);
	  pe.dxf(dxfBuilder, { bezier_tolerance: 0.5 });
	  expect(JSON.stringify(dxfBuilder.location, signy)).toEqual('{"x":-55,"y":0}');
      });

    it ("tests pensedge", function() {
	    expect(jasmineFix(new iPath().pensEdge(1,2,2,{bitRadius: 0.1}).dPath(3))).toEqual("l.0.2.1.0.0.-1.859.-0.071.-0.071.0.141.-0.141.0.071.0.071.0.717.0.0.071.-0.071.0.141.0.141.-0.071.0.071.0.1.859.1.0.0.-2"); 
	    expect(jasmineFix(new iPath().pensEdge(1,2,1).dPath(3))).toEqual("l.0.2.1.0.0.-2"); 
	    expect(jasmineFix(new iPath().pensEdge(1,2,1,{bitRadius: 0.1}).dPath(3))).toEqual("l.0.2.1.0.0.-2"); 
	    expect(jasmineFix(new iPath().pensEdge(1,2,1,{bitRadius: 0.1, startWithEar: true}).dPath(3))).toEqual("l.0.071.-0.071.0.141.0.141.-0.071.0.071.0.1.859.1.0.0.-1.859.-0.071.-0.071.0.141.-0.141.0.071.0.071"); 
	});
  it ("tests dxf move in path", function() {
	  var bez = new iPath().move(20,0).line(20,0).bezier(10,0,0,10,20,20).line(17,5);
	  dxfBuilder = new DxfBuilder(new Blobber(), 3);
	  bez.dxf(dxfBuilder);
	  expect(JSON.stringify(dxfBuilder.location, signy)).toEqual('{"x":77,"y":25}');
      });
      
    it ("tests square hole with a startPoint", function() {
	  var sh = new iPath().squareHole(50,90,{bitRadius: 12});
	  dxfBuilder = new DxfBuilder(new Blobber(), 3);
	  sh.dxf(dxfBuilder,{layer: {name: 'ellen', layer_color: 1}, startPoint: {x:100, y:100}});
	  expect(dxfBuilder.signify(dxfBuilder.location.x) + "," + dxfBuilder.signify(dxfBuilder.location.y)).toEqual('280,100');
	  expect(jasmineFix(dxfBuilder.blobBuilder.getText())).toEqual("0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n100\\n.20\\n116.971\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n91.515\\n.20\\n108.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n108.485\\n.20\\n91.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n116.971\\n.20\\n100\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n173.029\\n.20\\n100\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n181.515\\n.20\\n91.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n198.485\\n.20\\n108.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n190\\n.20\\n116.971\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n190\\n.20\\n133.029\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n198.485\\n.20\\n141.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n181.515\\n.20\\n158.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n173.029\\n.20\\n150\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n116.971\\n.20\\n150\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n108.485\\n.20\\n158.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n91.515\\n.20\\n141.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n100\\n.20\\n133.029\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n100\\n.20\\n116.971\\n.30\\n0\\n..0\\n*SEQRET*");
      });
    it ("tests square hole without a startPoint", function() {
	  var sh = new iPath().squareHole(50,90,{bitRadius: 12});
	  dxfBuilder = new DxfBuilder(new Blobber(), 3);
	  sh.dxf(dxfBuilder,{layer: {name: 'ellen', layer_color: 1}});
	  expect(dxfBuilder.signify(dxfBuilder.location.x) + "," + dxfBuilder.signify(dxfBuilder.location.y)).toEqual('180,0');
	  expect(jasmineFix(dxfBuilder.blobBuilder.getText())).toEqual("0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n16.971\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n-8.485\\n.20\\n8.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n8.485\\n.20\\n-8.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n16.971\\n.20\\n0\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n73.029\\n.20\\n0\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n81.515\\n.20\\n-8.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n98.485\\n.20\\n8.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n90\\n.20\\n16.971\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n90\\n.20\\n33.029\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n98.485\\n.20\\n41.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n81.515\\n.20\\n58.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n73.029\\n.20\\n50\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n16.971\\n.20\\n50\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n8.485\\n.20\\n58.485\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n-8.485\\n.20\\n41.515\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n33.029\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n16.971\\n.30\\n0\\n..0\\n*SEQRET*");
      });

  it ("tests moves", function() {
	  var movePath = new iPath().move(20,20).move(30,30).Move(30,30).move(20,0).line(20,0);
	  expect(jasmineFix(movePath.dPath(3))).toEqual("M.50.30.l.20.0");
	  movePath = new iPath().Move(30,0).move(40,0).move(20,20).move(30,30).Move(30,30).move(20,0).line(20,0);
	  expect(jasmineFix(movePath.dPath(3))).toEqual("M.50.30.l.20.0");
	  movePath = new iPath().Move(30,0).move(40,0).move(20,20).move(30,30).Move(30,30).move(20,0).line(20,0).move(20,0).line(30,0);
	  expect(jasmineFix(movePath.dPath(3))).toEqual("M.50.30.l.20.0.m.20.0.l.30.0");
  });
  it ("tests a repeat 1", function() {
	  _iPath = new iPath().turtleLine({a: Math.PI/2, r:200}).repeat(4);
	  expect(jasmineFix(_iPath.dPath(3))).toEqual("l.0.200.-200.0.0.-200.200.0");
	  expect(jasmineFix(_iPath.dPath(3))).toEqual("l.0.200.-200.0.0.-200.200.0");
	  var linePath = new iPath().line(0,10).move(5,-10).repeat(2).move(32,0).concat(new iPath().line(0,13).move(7,0).repeat(2));
	  expect(jasmineFix(linePath.dPath(3))).toEqual("l.0.10.m.5.-10.l.0.10.m.37.-10.l.0.13.m.7.0.l.0.13");
  });
  it ("make sure that absolute in svgBuilder's movecache is false", function () {
     var b = new svgBuilder(3);
     // http://stackoverflow.com/q/8724427/288190
     b.moveCache.absolute=true;
     var b2 = new svgBuilder(3);
     expect(b2.moveCache.absolute).toBeFalsy();
  });
  it ("should Move the pencil to 200, 200(0.5)", function() {
	  var newPath = new iPath().Move({x:200,y:200}).move({x:420}).line(30,40);
	  expect(uts.trim(newPath.dPath())).toEqual("M 620 200 l 30 40");
      });
  it ("should not interfere with other iPath's instances(1)", function() {
	  var newPath = new iPath().move({x:20,y:20}).move({x:420}).line(70,0);
	  expect(jasmineFix(newPath.dPath())).toEqual("m.440.20.l.70.0");
	  expect(_iPath.dPath()).toEqual("");
	  var movePath = new iPath().line(9,0).line(0,9).line(-9,0).line(0,-9).move(20,0).move(30,0).line(9,0);
	  expect(jasmineFix(movePath.dPath(3))).toEqual("l.9.0.0.9.-9.0.0.-9.m.50.0.l.9.0");
  });
  it ("should convert removed x y inputs to 0(2)"), function() {
	  _iPath.move({x:20}).move({y:20});
	  expect(jasmineFix(_iPath.dPath())).toEqual("m.20.0.m.0.20");
	  //	  expect(_iPath.dPath()).toEqual(" m 20 0 m 0 20");
  }
  it ("should accept accept x and y as separate arguments(3)", function() {
	  _iPath.move(20, 30).line(30, 0);
	  expect(_iPath.dPath()).toEqual(" m 20 30 l 30 0");
  });
  it ("should throw an exception if bezier is called with 3 arguments(4)", function() {
      expect(function() {
	      _iPath.bezier(20, 30, 20);
      }).toThrow("illegal number of arguments 3 for bezier function");
    });
  it ("should check whether the Object.keys() functionality is available(6)", function () {
	  _iPath.bezier({x: 50, y: 50, cp1: {x: 50}, cp2:{y:50}});
	  // at this point the prefix has been added.
	  expect(Object.keys(_iPath.path[0]).length).toEqual(5);
      });
  it ("should again display a proper c curve separate arguments(7)", function() {
	  _iPath.bezier(50, 0, 0, 50, 50, 50);
	  expect(_iPath.dPath()).toEqual(" c 50 0 0 50 50 50");
      });
  it ("should display a proper cubic curve separate arguments(8)", function() {
	  _iPath.bezier(50, 0, 50, 50);
	  expect(_iPath.dPath()).toEqual(" q 50 0 50 50");
      });
  it ("should concatenate 2 iPath's(9)", function() {
	  _iPath.bezier(50, 0, 0, 50, 50, 50);
	  var _jPath = new iPath().move({x: 20, y: 200}).line(3,4);
	  expect(jasmineFix(_iPath.concat(_jPath).dPath())).toEqual("c.50.0.0.50.50.50.m.20.200.l.3.4");
      });
  it ("should (destructively) reverse an iPath (move and bezier)(10)", function() {
	  _iPath.move(20,-40).bezier(50, 0, 0, 50, 50, 50).reverse();
	  expect(jasmineFix(_iPath.dPath())).toEqual("c.-50.0.0.-50.-50.-50");
      });
  it ("test the reverse of a bezier", function() {
	  _iPath.bezier({cp1:{x:-50}, cp2:{y:-50}, x:-50, y:-50});
	  _iPath.concat(_iPath.reverse(_iPath));
	  expect(jasmineFix(_iPath.dPath())).toEqual("c.-50.0.0.-50.-50.-50.50.0.0.50.50.50");
      });
  it ("should (clone) reverse an iPath (move and bezier)(11)", function() {
	  _iPath.move(20,-40).bezier(50, 0, 0, 50, 50, 50);
	  expect(jasmineFix(_iPath.reverse(_iPath).dPath())).toEqual("c.-50.0.0.-50.-50.-50");
	  expect(jasmineFix(_iPath.dPath())).toEqual("m.20.-40.c.50.0.0.50.50.50");
      });

  it ("should rotate an iPath with x or y zero (11A)", function() {
	  _iPath.line({x:10}).line({y:10});
	  expect(_iPath.rotate(Math.PI/4).dPath(3)).toEqual(" l 7.071 7.071 -7.071 7.071");
      });

  it ("should rotate an iPath (12)", function() {
	  _iPath.move(2,2).line(2,-2);
	  expect(_iPath.rotate(Math.PI/2).dPath(3)).toEqual(" m -2 2 l 2 2");
	  expect(_iPath.rotate(Math.PI/2).dPath(3)).toEqual(" m -2 -2 l -2 2");
	  expect(_iPath.rotate(Math.PI/2).dPath(3)).toEqual(" m 2 -2 l -2 -2");
	  expect(_iPath.rotate(Math.PI/2).dPath(3)).toEqual(" m 2 2 l 2 -2");
      });
  it ("should clone rotate an iPath (13)", function() {
	  _iPath.move(2,2).line(2,-2);
          //
	  //   \  /    
	  //    \/ 


	  expect("1:" + uts.trim(_iPath.rotate(Math.PI/2, _iPath).dPath(3))).toEqual("1:m -2 2 l 2 2");
	  expect("2:" + uts.trim(_iPath.dPath(3))).toEqual("2:m 2 2 l 2 -2");	
	  expect("3:" + uts.trim(_iPath.rotate(Math.PI, _iPath).dPath(3))).toEqual("3:m -2 -2 l -2 2");
	  expect("4:" + uts.trim(_iPath.dPath(3))).toEqual("4:m 2 2 l 2 -2");
	  expect("5:" + uts.trim(_iPath.rotate(3*Math.PI/2, _iPath).dPath(3))).toEqual("5:m 2 -2 l -2 -2");
	  expect("6:" + uts.trim(_iPath.dPath(3))).toEqual("6:m 2 2 l 2 -2");
	  expect("7:" + uts.trim(_iPath.rotate(2*Math.PI, _iPath).dPath(3))).toEqual("7:m 2 2 l 2 -2");
	  expect("8:" + uts.trim(_iPath.dPath(3))).toEqual("8:m 2 2 l 2 -2");
	  expect("9:" + uts.trim(_iPath.rotate(1.5 * Math.PI/2, _iPath).dPath(3))).toEqual("9:m -2.828 0 l 0 2.828");

	  
	  expect("10:" + uts.trim(_iPath.dPath(3))).toEqual("10:m 2 2 l 2 -2");
	  var arrow = new iPath().line(100,0).line(0,-10).line(40,12);
    	  arrow.concat (arrow.reverse(arrow).reflect({x:1}));
	  expect("11:" + uts.trim(arrow.rotate(Math.PI).dPath(3))).toEqual("11:l -100 0 0 10 -40 -12 40 -12 0 10 100 0");
      });
  it ("tests for combined cartesian and polar lining", function() {
     var wieber = new iPath().line(2,2).line(2,-2).turtleLine({a : Math.PI/4, r :	2});
     expect("1:" + jasmineFix(wieber.dPath(3))).toEqual("1:l.2.2.2.-2.2.0");
     var be = new iPath().setSettings({pens_height:-4}).boxEdge( 20, 0, {preferred_pen_length:7}).line(0,40);
     expect("2:" + jasmineFix(be.rotate(Math.PI/4).dPath(3))).toEqual("2:l.4.714.4.714.2.828.-2.828.4.714.4.714.-2.828.2.828.4.714.4.714.-28.284.28.284");
  });
  it ("should make a symmetrical function", function() {
       expect(symmetry([[{x:30,y:20},{x:20,y:30},{x:40,y:30}]],0))
	  .toEqual("c 30 20 20 30 40 30 c 20 0 10 -10 40 -30 ");
      });

  it ("should mirror or reflect an iPath (14)", function() {
	  _iPath.move(2,2).line(2,-2);
  	  expect(_iPath.reflect({x:1,y:0}).dPath(3)).toEqual(" m 2 -2 l 2 2");
  	  expect(_iPath.reflect({x:1,y:0}).dPath(3)).toEqual(" m 2 2 l 2 -2");
  	  expect(_iPath.reflect({x:1,y:1}).dPath(3)).toEqual(" m 2 2 l -2 2");
  	  expect(_iPath.reflect({x:1,y:1}).dPath(3)).toEqual(" m 2 2 l 2 -2");
      });
  it ("should not complain", function() {
	  expect(_iPath.line({x:200}).bezier(-50, 200, 50, 0, 0, 200).dPath(3)).toEqual(" l 200 0 c -50 200 50 0 0 200");
      });
  it ("should display a proper spline box", function() {
	  expect(_iPath.line({x:200}).bezier(50, 200, -50, 0, 0, 200).concat(_iPath.reverse(_iPath).reflect({x:1})).dPath(3)).toEqual(" l 200 0 c 50 200 -50 0 0 200 -50 200 50 0 0 200 l -200 0");
      });
  it ("should reverse a spline and line", function() {
	  expect(_iPath.line({x:200}).bezier(50, 200, -50, 0, 0, 200).reverse().dPath(3)).toEqual(" c -50 -200 50 0 0 -200 l -200 0");
      });
  it ("should test a reverse of a concattenation", function() {
	  var trt = new iPath().line(20,30).bezier(20, 30, 180, 40,80,80).concat(new iPath().line(60,60));
	  expect(uts.trim(new iPath().reverse(trt).dPath(4))).toEqual("l -60 -60 c 100 -40 -60 -50 -80 -80 l -20 -30");
	  expect(uts.trim(trt.dPath(4))).toEqual("l 20 30 c 20 30 180 40 80 80 l 60 60");
	  trt.reverse();
	  expect(uts.trim(trt.dPath(4))).toEqual("l -60 -60 c 100 -40 -60 -50 -80 -80 l -20 -30");
      });

  it ("converts a polar element to a cartesian element",function() {
      var elen = {};
      var bldr = new svgBuilder(3);
      elen[iPath.cs] = iPath.polar;
      elen[iPath.Alpha] = Math.PI/2;
      elen[iPath.radius] = 40;
      result = _iPath.polar2Cartesian(elen,bldr);
      expect(result.x.toFixed(3)).toEqual(0.000.toFixed(3));
      expect(result.y).toEqual(40);
  });
  it ("tests a turtle bezier", function() {
      _iPath = new iPath().Move(400, 500).line(200, 0).turtleBezier({ a: 0, r: 200, cp1: { a:Math.PI/6, r:300 }, cp2: {a:-1*Math.PI/3, r:300} });
      expect(uts.trim(_iPath.dPath(3))).toEqual("M 400 500 l 200 0 c 259.808 150 459.808 -150 200 0");
  });

  
  it ("tests a turtle line",function() {
      _iPath.line(20, 0).turtleLine({a: Math.PI/4, r: 20});
      expect(uts.trim(_iPath.dPath(3))).toEqual("l 20 0 14.142 14.142");
      _iPath = (new iPath()).line(20, 0).turtleLine({a: Math.PI/4, r: 20}).line(20, 0).turtleLine({a: Math.PI/4, r: 20});
      expect(uts.trim(_iPath.dPath(3))).toEqual("l 20 0 14.142 14.142 20 0 14.142 14.142");
  });

  it ("tests a turtle move", function() {
      _iPath = (new iPath()).line(20, 0).turtleMove({a: Math.PI/4, r: 20}).line(20, 0).turtleMove({a: Math.PI/4, r: 20});
      expect(uts.trim(_iPath.dPath(3))).toEqual("l 20 0 m 14.142 14.142 l 20 0");
  });
  it ("tests a skew", function() {
	  _iPath = new iPath().line(500,60).line(500,-60);
	  expect(uts.trim(_iPath.skew(0.5, 0).dPath(3))).toEqual("l 470 60 530 -60");
  });
  it ("tests a turtle bezier", function() {
      _iPath = new iPath().Move(400, 500).line(200, 0).turtleBezier({ a: 0, r: 200, cp1: { a:Math.PI/6, r:300 }, cp2: {a:-1*Math.PI/3, r:300} });
      expect(uts.trim(_iPath.dPath(3))).toEqual("M 400 500 l 200 0 c 259.808 150 459.808 -150 200 0");
  });
  it ("tests the pensedge reflect", function() {
	  expect(jasmineFix(new iPath().pensEdge(87/5,18.6,2,{overshoot: 18, penSizeInPlankSize: false}).reflect({y:1}).dPath(3)))
	      .toEqual('l.0.18.6.c.0.5.4.-1.74.18.-8.7.18.-6.96.0.-8.7.-12.6.-8.7.-18.l.0.-18.6.-17.4.0.0.18.6.c.0.5.4.-1.74.18.-8.7.18.-6.96.0.-8.7.-12.6.-8.7.-18.l.0.-18.6');
      });
  it ("test concat reverse reflect", function() {
	  crr = new iPath().line(90,20).concat(new iPath().line(12,12).line(0,37).line(-12,12)).line(-90,10);
	  rr = new iPath().line(90,20).line(12,12).line(0,37).line(-12,12).line(-90,10);
	  rr.concat(new iPath().reverse(new iPath().reflect({y:1}, rr)));
	  crr.concat(new iPath().reverse(new iPath().reflect({y:1}, crr)));
	  expect(crr.dPath(3)).toEqual(rr.dPath(3));
      });

  it ("tests for a self reflect", function() {
      var heart = new iPath().bezier(0, -50, -150, -200, 0, -120);
      expect(uts.trim(heart.reflect({y:1}).dPath(3))).toEqual("c 0 -50 150 -200 0 -120");
  });
  if ("tests for a turtle bezier and line", function() {
	  var bezier = new iPath().line(0,-200).turtleBezier({a:0, r:200, cp1:{a:-Math.PI/6,r:80}, cp2: {a:Math.PI/6,r:80}});
  });
    it ("tests a squarehole", function() {
	expect(uts.trim(squareHole(10,5)).replace(/(?!^) l/g, '').indexOf(uts.trim(new iPath().squareHole(10,5).dPath(3)))).toBeGreaterThan(-1);
	// Should be in a separate test for StretchSketch
//	try {
//	    expect(uts.trim(StretchSketch.load({jsvg: '#{squareHole(10,5, {bitRadius: 5\\})}'}).evalJSVG()).replace(/l/, 'b').replace(/ l/g, '').replace(/b/, 'l')
		   
//		   .indexOf(uts.trim(new iPath().squareHole(10,5, {bitRadius: 5}).dPath(3)))).toBeGreaterThan(-1);
//	} catch (e) {
//	    console.log('second ' + e);
//	}
  });

  it ("rectBezier", function() {
	  expect(uts.trim(new iPath().rectBezier({x: 50, y:80}).dPath(3))).toEqual("c 0 80 0 80 25 80 25 0 25 0 25 -80");
	  expect(uts.trim(new iPath().rectBezier({x: 50, y:80}, {xFact : 0.5, yFact:2}).dPath(3))).toEqual("c 0 160 12.5 80 25 80 12.5 0 25 80 25 -80");
	  expect(uts.trim(new iPath().rectBezier({x: 50, y:80}, {xFact : 0.5, yFact:2}).dPath(3))).toEqual("c 0 160 12.5 80 25 80 12.5 0 25 80 25 -80");
	  expect(uts.trim(new iPath().rectBezier({x: 50, y:80}, {xFact : 0.5, yFact:2, angle: Math.PI/3}).dPath(3))).toEqual("c -138.564 80 -63.032 50.825 -56.782 61.651 6.25 10.825 -56.782 61.651 81.782 -18.349");
  });
  it ("tests the dxf functionality", function() {
	  var polygon = {};
	  polygon.n = 3;
	  polygon.r = 150;
	  polygon.iPath = new iPath().turtleLine({a: Math.PI*2 / polygon.n, r: polygon.r * Math.sin(Math.PI/polygon.n) * 2 }).repeat(polygon.n);
	  dxfBuilder = new DxfBuilder(new Blobber(), 3);
	  //console.log("start with turtle");
	  polygon.iPath.dxf(dxfBuilder,{layer: {name: 'jeroen', layer_color: 5}, startPoint:{x: 20, y:30}});
	  //console.log("prefixturtle ");
	  expect(jasmineFix(dxfBuilder.blobBuilder.getText())).toEqual("0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\njeroen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\njeroen\\n.10\\n20\\n.20\\n30\\n.30\\n0\\n..0\\nVERTEX\\n..8\\njeroen\\n.10\\n-109.904\\n.20\\n255\\n.30\\n0\\n..0\\nVERTEX\\n..8\\njeroen\\n.10\\n-239.808\\n.20\\n30\\n.30\\n0\\n..0\\nVERTEX\\n..8\\njeroen\\n.10\\n20\\n.20\\n30\\n.30\\n0\\n..0\\n*SEQRET*");
      });
  it ("tests the dxf Functionality with moves, layers and startPints", function() {
	  //console.log("prefix squar ");
	  var p2 = new iPath().Move(20,30).line(50,0).line(0,50).line(-50,0).line(0,-50);
	  var p3 = new iPath().line(50,0).line(0,50).line(-50,0).line(0,-50);
	  dxfBuilder2 = new DxfBuilder(new Blobber(), 3);
	  dxfBuilder3 = new DxfBuilder(new Blobber(), 3);
	  p2.dxf(dxfBuilder2, {layer: {name: 'ellen', layer_color: 1}});
	  p3.dxf(dxfBuilder3, {layer: {name: 'ellen', layer_color: 1}, startPoint: {x: 20, y:30}});
	  expect(jasmineFix(dxfBuilder2.blobBuilder.getText())).toEqual(jasmineFix(dxfBuilder3.blobBuilder.getText()));
      });
    it ("tests doCorner, arcaCorner II", function() {
        var v = {x:100, y:0};
        var u = {x:0,y:100};
        var doc = doCorner(v,u,10);
        expect(doc.v1.x).toEqual(90); 
	expect(doc.v1.y.toFixed(8)).toEqual(0.00000000.toFixed(8));
	expect(doc.v2.x.toFixed(8)).toEqual(0.00000000.toFixed(8));
        expect(doc.v2.y).toEqual(90);
        expect(doc.arc.cx).not.toBeNull();
        expect("cx" + doc.arc.cx.toFixed(3)).toEqual("cx0.000");
        expect("cy" + doc.arc.cy.toFixed(3)).toEqual("cy10.000");
        expect("x" + doc.arc.x.toFixed(3)).toEqual("x10.000");
        expect("y" + doc.arc.y.toFixed(3)).toEqual("y10.000");
    });
  it ("tests doCorner, with first leg not 0", function() {
          var v = {x:50, y:50};
          var u = {x:-50,y:50};
          var doc = doCorner(v,u,10*Math.sqrt(2));
          expect("v1.x" + doc.v1.x.toFixed(0)).toEqual("v1.x40"); 
          expect("v1.y" + doc.v1.y.toFixed(0)).toEqual("v1.y40");
          expect("v2.x" + doc.v2.x.toFixed(0)).toEqual("v2.x-40"); 
          expect("v2.y" + doc.v2.y.toFixed(0)).toEqual("v2.y40");
          expect(doc.arc.cx).not.toBeNull();
          expect("cx" + doc.arc.cx.toFixed(3)).toEqual("cx-10.000");
          expect("cy" + doc.arc.cy.toFixed(3)).toEqual("cy10.000");
          expect("x" + doc.arc.x.toFixed(3)).toEqual("x0.000");
          expect("y" + doc.arc.y.toFixed(3)).toEqual("y20.000");
          });
    it("tests freecorner, clearing a corner with milling bit", function() {
	expect(JSON.stringify(clearCorner({x:40,y:40}, {x:40,y:-40}, 2), signy/*function(key,val) {return val.toFixed ? Number(val.toFixed(3)) : val;}*/ )).toEqual('{"v1":{"x":38,"y":38},"v2":{"x":38,"y":-38},"arc":{"dxfClockWise":false,"r":2,"reverse":false,"x":4,"y":0,"cx":2,"cy":0,"large_arc":false}}');
	expect(jasmineFix(new iPath().arc(clearCorner({x:40,y:40}, {x:40,y:-40}, 2).arc).dPath(3))).toEqual('a.2.2.0.0.0.4.0');
    });
    it("tests clearcorner, clearing a from 3 o'clock till 6 o'clock", function() {
	expect(JSON.stringify(clearCorner({x:-40,y:0}, {x:0,y:40}, 2*Math.sqrt(2)), signy)).toEqual('{"v1":{"x":-36,"y":0},"v2":{"x":0,"y":36},"arc":{"dxfClockWise":false,"r":2.828,"reverse":false,"x":-4,"y":4,"cx":-2,"cy":2,"large_arc":false}}');
    });
    it("tests clearcorner, clearing a from 3 o'clock till 7 o'clock (svg)", function() {
	expect(JSON.stringify(clearCorner({x:-40,y:0}, {x:10,y:40}, 2), signy)).toEqual('{"v1":{"x":-36.847,"y":0},"v2":{"x":9.235,"y":36.941},"arc":{"dxfClockWise":false,"r":2,"reverse":false,"x":-2.388,"y":3.059,"cx":-1.576,"cy":1.231,"large_arc":false}}');
    });
    it("tests clearcorner with 180 degrees", function() {
	expect('{"x":9,"y":9}').toEqual(JSON.stringify(clearCorner({x:5,y:5},{x:4,y:4},2)));
    });
    it("tests arcPath with different radii and rotation in svg and dxf", function() {
	var crn = arcPath([{x:80,y:0},{fr:20},{x:0,y:-80},{fr:2*20},{x:-160,y:-60},{fr:20/2},{x:0,y:140},{fr:20*0.1},{x:80,y:0}]).rotate(Math.PI/4);
	expect('l.42.426.42.426.a.20.20.0.0.0.28.284.0..l.22.825.-22.825.a.40.40.0.0.0.8.13.-44.836..l.-53.269.-117.192.a.10.10.0.0.0.-16.175.-2.933..l.-87.377.87.377.a.2.2.0.0.0.0.2.828..l.55.154.55.154').toEqual(jasmineFix(crn.dPath(3)));
	var dxfBuilder = new DxfBuilder(new Blobber(), 3);
	crn.dxf(dxfBuilder,  {layer: {name: 'ellen', layer_color: 1}});	
	expect(jasmineFix(jasmineFix(dxfBuilder.blobBuilder.getText().replace(/-/g,'_')))).toEqual('0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n0\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n42.426\\n.20\\n42.426\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n70.711\\n.20\\n42.426\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n93.536\\n.20\\n19.601\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n101.666\\n.20\\n_25.235\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n48.398\\n.20\\n_142.427\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n32.223\\n.20\\n_145.36\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n_55.154\\n.20\\n_57.983\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n_55.154\\n.20\\n_55.154\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n0\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nARC\\n..8\\nellen\\n.10\\n56.569\\n.20\\n28.284\\n.30\\n0.0\\n.40\\n20\\n.50\\n45\\n.51\\n135\\n..0\\nARC\\n..8\\nellen\\n.10\\n65.252\\n.20\\n_8.683\\n.30\\n0.0\\n.40\\n40\\n.50\\n335.556\\n.51\\n45\\n..0\\nARC\\n..8\\nellen\\n.10\\n39.294\\n.20\\n_138.289\\n.30\\n0.0\\n.40\\n10\\n.50\\n225\\n.51\\n335.556\\n..0\\nARC\\n..8\\nellen\\n.10\\n_53.74\\n.20\\n_56.569\\n.30\\n0.0\\n.40\\n2\\n.50\\n135\\n.51\\n225');
	});
  it ("tests an arcPath with a bitRadius", function() {
      var par = arcPath([{x:-10,y:20},{br:4},{x:70,y:0},{br:4},{x:20,y:-40},{br:4},{x:-70,y:0},{br:4},{x:-10,y:20}]);
      expect(jasmineFix(par.dPath(3))).toEqual('l.-6.957.13.913.a.4.4.0.0.0.3.762.6.087..l.58.989.0.a.4.4.0.0.0.6.087.-3.762..l.15.076.-30.151.a.4.4.0.0.0.-3.762.-6.087..l.-58.989.0.a.4.4.0.0.0.-6.087.3.762..l.-8.119.16.238');
      var dxfBuilder = new DxfBuilder(new Blobber(), 3);
      par.dxf(dxfBuilder,  {layer: {name: 'ellen', layer_color: 1}});	
      expect(jasmineFix(jasmineFix(dxfBuilder.blobBuilder.getText().replace(/-/g,'_')))).toEqual('0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n0\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n_6.957\\n.20\\n13.913\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n_3.195\\n.20\\n20\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n55.794\\n.20\\n20\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n61.881\\n.20\\n16.238\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n76.957\\n.20\\n_13.913\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n73.195\\n.20\\n_20\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n14.206\\n.20\\n_20\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n8.119\\n.20\\n_16.238\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n0\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nARC\\n..8\\nellen\\n.10\\n_6.597\\n.20\\n17.897\\n.30\\n0.0\\n.40\\n4\\n.50\\n31.717\\n.51\\n264.848\\n..0\\nARC\\n..8\\nellen\\n.10\\n57.897\\n.20\\n16.597\\n.30\\n0.0\\n.40\\n4\\n.50\\n354.848\\n.51\\n121.717\\n..0\\nARC\\n..8\\nellen\\n.10\\n76.597\\n.20\\n_17.897\\n.30\\n0.0\\n.40\\n4\\n.50\\n211.717\\n.51\\n84.848\\n..0\\nARC\\n..8\\nellen\\n.10\\n12.103\\n.20\\n_16.597\\n.30\\n0.0\\n.40\\n4\\n.50\\n174.848\\n.51\\n301.717');
      

   });

    it ("tests the clear corner with a polyline in contrast to the arc", function() {
	var crn = arcPath([{x:80,y:0},{br:-20},{x:0,y:-80},{br:-2*20},{x:-160,y:-60},{br:-20/2},{x:0,y:140},{br:-20*0.1},{x:80,y:0}]);
	expect(jasmineFix(crn.dPath(3))).toEqual("l.51.716.0.14.142.14.142.28.284.-28.284.-14.142.-14.142.0.-6.148.21.333.-14.784.-42.666.-61.567.-21.333.14.784.-101.942.-38.228.-7.696.-11.105.-15.392.10.667.7.696.11.105.0.120.733.-1.414.1.414.2.828.2.828.1.414.-1.414.77.172.0");

    });
  it ("tests the doCorner, used for arcs in svg and dxf", function() {
          var v1 = {x : 100, y:0 };v2 = {x:0, y:100};r=10
          var res = doCorner(v1,v2,10);
          expect(JSON.stringify(res, function(key, val) {
	      return val.toFixed ? Number(val.toFixed(3)) : val;})).toEqual('{"v1":{"x":90,"y":0},"v2":{"x":0,"y":90},"arc":{"dxfClockWise":true,"r":10,"reverse":true,"x":10,"y":10,"a1":0,"a2":1.571,"cx":0,"cy":10}}');
          dxfBuilder = new DxfBuilder(new Blobber(), 3);
          var twolines = new iPath().line(res.v1.x,res.v1.y)
               .arc(res['arc']['x'], res['arc']['y'], {r:r,reverse:1, cx: res['arc']['cx'], cy: res['arc']['cy']})
               .line(res.v2.x, res.v2.y);
          twolines.dxf(dxfBuilder, {layer: {name: 'ellen', layer_color: 1}});
          expect(jasmineFix(dxfBuilder.blobBuilder.getText())).toEqual('0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n0\\n.20\\n0\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n90\\n.20\\n0\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nPOLYLINE\\n..6\\nSOLID\\n.62\\n256\\n..8\\nellen\\n.66\\n1\\n.10\\n0.0\\n.20\\n0.0\\n.30\\n0.0\\n.70\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n100\\n.20\\n10\\n.30\\n0\\n..0\\nVERTEX\\n..8\\nellen\\n.10\\n100\\n.20\\n100\\n.30\\n0\\n..0\\n*SEQRET*\\n..0\\nARC\\n..8\\nellen\\n.10\\n90\\n.20\\n10\\n.30\\n0.0\\n.40\\n10\\n.50\\n0\\n.51\\n270');

      });
    it ("tests the accumulate elements", function() {
	var rij = [{x:1,y:1},{x:10,y:10},{x:100,y:100},{x:1000,y:1000},{x:10000,y:10000}];
	expect(jasmineFix(JSON.stringify(accumulateElements(rij, 3)))).toEqual('{"x":11000,"y":11000}');
	expect(jasmineFix(JSON.stringify(accumulateElements(rij, -3)))).toEqual('{"x":11100,"y":11100}');
	expect(jasmineFix(JSON.stringify(accumulateElements(rij, 0,-1)))).toEqual('{"x":11111,"y":11111}');
	expect(jasmineFix(JSON.stringify(accumulateElements(rij, -1)))).toEqual('{"x":10000,"y":10000}');

    });
//   it ("it tests a turtle bezier",function() {
// 	  _iPath = (new iPath()).line(20, 0).turtleBezier({ a: Math.PI/4, r: 20, cp1: { a:-1*Math.PI/4, r:30 }, cp2: {a:0, r:30}})
// 	      expect(uts.trim(_iPath.dPath(3))).toEqual("l 20 0 c 21 -21 42 0 21 21");
//   });
});
