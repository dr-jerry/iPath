$(function(){
    $("ul.dropdown li").hover(function(){
        $(this).addClass("hover");
        var a = $('ul:first',this);
        $('ul:first',this).css('visibility', 'visible');

    }, function(){

        $(this).removeClass("hover");
        $('ul:first',this).css('visibility', 'hidden');

    });

    $("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");

});