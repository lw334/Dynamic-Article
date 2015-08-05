
$(function(){
    var sections = {},
        _height  = $(window).height(),
        i        = 0;
    
    $('.section').each(function(){
        sections[this.name] = $(this).offset().top;
    });

    $(document).scroll(function(){
        var $this = $(this),
            pos   = $this.scrollTop();

         if (pos == 0) {
            $("#main-nav").slideUp(400);
        } else {
            $("#main-nav").slideDown(700);
        }
            
        for(i in sections){
            if(sections[i] > pos && sections[i] < pos + _height){
                $('a').removeClass('active');
                $('#nav_' + i).addClass('active');
            }  
        }
    });
});
