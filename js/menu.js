/*
Simple JQuery menu.
HTML structure to use:

Notes:
//   1. $('li', this).prepend('<div class="image_container"></div>');
*/
jQuery.fn.initDrop = function() {
    readFile = function rf(file) {
	var reader = new FileReader();
	reader.onload = function(evt) {
	    stretchSketch = StretchSketch.load({jsvg: evt.target.result, controlPanel: $('#draggable'), edit: true});
	}
	reader.readAsText(file);
    }

    return this.each(function () {
			 $(this).bind("dragover", function () {$(this).addClass('focus');$(".drop_container").addClass('focus'); return false;});
			 $(this).bind("dragleave",function () {  $(this).removeClass('focus');$(".drop_container").removeClass('focus'); return false;});
			 $(this).bind("drop",function(e) {
				       $(".focus").removeClass("focus");
				       $(".drop_container").addClass('focus');
					  e.preventDefault();
					  readFile(e.originalEvent.dataTransfer.files[0]);
				      });
			 $('.afile', $(this)).bind("change", function (evt) {
						      readFile(evt.target.files[0]);
						   });
			 $('#other-upload', $(this)).prepend('<div class="image_container drop_container"></div>');
//			 $(this).prepend('<div class="image_container empty"></div>');
		     });
};

jQuery.fn.initMenu = function() {
    return this.each(function() {
        $('li', this).each(function(){
            var contents = $(this).contents();
        	if (contents.length >= 1)  {
        		if (contents[0].nodeType == 3) {
        			//plain text (ie title above submenu).
                	contents[0].data = $.trim(contents[0].data);
        			contents.eq(0).wrap('<span class="menu_node"/>');
        		} else { // its text wrapped inside another element (anchor)
        			contents.eq(0).wrap('<span class="menu_text"/>');
        		}
        	}
        }).contents();
    	$('li', $(this)).prepend('<div class="image_container isd_closed"></div>').addClass('isd_indent');
        $('a:not(.extern)', this).each(function() {
        	var contents = $(this).contents();
        	var href = $(this).attr('href');
        	var id = $(this).attr('id');
        	var li = $(this).parent();
        	var showGraph = $(this).hasClass('show_graph');
        	li.click(function(e) {
		        timers.stop();
        		$('.focus').removeClass('focus');
        		$(e.currentTarget).parent().addClass('focus');
        		$(e.currentTarget).prev().addClass('focus');
        		if (id.match(/\.j?svg$/)) {
                            stretchSketch = StretchSketch.load({url: id, controlPanel: $('#draggable'), edit: true});
        		} else if (id.match(/\.html?$/)) {
        	            processText(id.replace(/\.html?$/, ''), showGraph);
        		} else {
        		    eval(id);
        		}
        	}).text(contents);
        	$('div.image_container', $(li.parent())).removeClass('isd_closed').addClass('isd_leaf');
        	$(contents).unwrap();

        });
        $('.menu_text', this).hover(function(e) {
        	$('>.image_container', $(this).parent()).toggleClass('isd_hover_node');
        });
        $('.menu_node', this).click(function(e) {
        	$('>.image_container', $(this).parent()).toggleClass('isd_open').toggleClass('isd_closed');
        	$('>li',$('ul:first', $(this).parent())).toggleClass('active').toggleClass('inactive');
    	}).hover(function(e) {
    		$('>.image_container', $(this).parent()).toggleClass('isd_hover_node');
    	});

    });
};
