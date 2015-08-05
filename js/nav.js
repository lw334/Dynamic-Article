
$(function(){
    var sections = {},
        _height  = $(window).height(),
        i        = 0;
    
    // Grab positions of our sections 
    $('.section').each(function(){
        sections[this.name] = $(this).offset().top;
    });

    $(document).scroll(function(){
        var $this = $(this),
            pos   = $this.scrollTop();

         if ($(this).scrollTop() == 0) {
            $("#floating-nav-content").slideUp(400);
        } else {
            $("#floating-nav-content").slideDown(600);
        }
            
        for(i in sections){
            if(sections[i] > pos && sections[i] < pos + _height){
                $('a').removeClass('active');
                $('#nav_' + i).addClass('active');
            }  
        }
    });
});
