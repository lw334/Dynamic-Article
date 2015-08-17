$ = jQuery;
$(document).ready(function(){
  function updateRankings(){
    console.log("updateRankings");
   var counter = 0;
   $(".priority li").each(function(index){
     console.log(this);
      $(this).attr('id', counter);
      var card = $(this).children(".card");
      $(card).children(".number").html(counter+1);
      counter++;
   });
  }
  $(".priority").sortable({
    forceHelperSize: true,
    placeholder: "card-placeholder",
    forcePlaceholderSize: true,
    update: function(event){
      updateRankings();
      console.log("updated");
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
