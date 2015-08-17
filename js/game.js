$ = jQuery;
$(document).ready(function(){
  function updateRankings(){
   var counter = 0;
   $(".sortable").each(function(index){
      $(this).attr('id', counter);
      $(this).children(".number").html(counter+1);
      counter++;
   });
  }
  $(".priority").sortable({
    forceHelperSize: true,
    placeholder: "card-placeholder",
    forcePlaceholderSize: true,
    update: function(event){
      updateRankings();
    }
  });
  // disables text selection w/in elements for easier dragging
  $(".priority").disableSelection();

  $("#rank").click(function(){
    var choice = ($(".sortable")[0]).innerHTML;
    if (choice == SALARY_t) {
      document.getElementById("understanding").innerHTML = "If money equals priority, it seems that you have a pretty good sense of how the budget of your kid school is spent.";
    }
    else{
      document.getElementById("understanding").innerHTML = "If money equals priority, it seems that the budget of your children’s school is being spent with a different mindset.";
    }
    $(".priority").hide(1000);
    $(".ranking").hide(1000);
    $(".direction").hide(1000);
    $('#rank').hide();
  });

  updateRankings();
});
