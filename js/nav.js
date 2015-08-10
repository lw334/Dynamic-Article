$(function(){
    var sections = {},
        _height  = $(window).height(),
        i        = 0;

    $('.section').each(function(){
        sections[this.name] = $(this).offset().top;
    });
    // Track navbar initial location
    var navbarPos = $("#main-nav").offset().top;

    $(document).scroll(function(){
        var $this = $(this),
            pos   = $this.scrollTop();
        if (pos >= navbarPos) {
          $("#main-nav").addClass("sticky");
        } else if (pos < navbarPos){
          $("#main-nav").removeClass("sticky");
        }
        for(i in sections){
            if(sections[i] > pos && sections[i] < pos + _height){
                $('a').removeClass('active');
                $('#nav_' + i).addClass('active');
            }
        }
    });
});
