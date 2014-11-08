describe("iScriptDesign", function() {
  it ("test sketchstrech' stripControls", function() {
          var stretchSketch = StretchSketch.load({jsvg: '@{var:isd_depth, label:depth, defaultvalue:150, size:3, type:slider, max:300, min:20 step:1}'});
	  expect(stretchSketch.controls.length).toEqual(1);
	  expect($(".inputlabel", stretchSketch.controls[0].element).html()).toEqual("depth:");
	  expect($(".slider-control-value", stretchSketch.controls[0].element).html()).toEqual("150");
  });
});