var COMMODITIES_t = "I want my children to study with updated instructional materials including new books and softwares, and stay in air conditioned classrooms on summer days. [commodities]";
var CONTRACT_t = "I want the school to deliver necessary services such as nursing and counseling to my children and professional training to the teachers and staff so I know my children are taken good care of. [contracts]";
var EQUIPMENT_t = "I want the school to have well maintained buildings and equipment such as computers to enhance my child’s learning. [equipment]";
var SALARY_t = "I want my children to receive individual attention from teachers and staff so they can benefit from personalized advices and be better prepared for colleges. [salaries]";
var BENEFITS_t = "I want my children to study with teachers who have access to social welfare benefits and are likely to remain in school and understand my children well over the years. [benefits]";
var TRANSPORTATION_t = "I want to make sure that my children arrive at school and return home safely. [transportation]";
var CONTINGENCY_t =  "I want the school to have the resources to solve emergencies that might occur. [contingencies]";


 var l = [CONTRACT_t, COMMODITIES_t, CONTINGENCY_t, EQUIPMENT_t, SALARY_t, BENEFITS_t, TRANSPORTATION_t]
 var ranks = ["1","2","3","4","5","6","7"]

   d3.select("body").select(".ranking").selectAll("li")
     .data(ranks)
     .enter()
     .append("li")
     .attr("class", "rankings")
     .attr("id", function(d) {return d-1;})
     .text(function(d) {return d;})

    d3.select("body").select(".priority").selectAll("li")
     .data(l)
     .enter()
     .append("li")
     .attr("class", "sortable")
     .attr("draggable", "true")
     .text(function(d){return d;});

  function updateRankings(){
     var counter = 0;
     $(".sortable").each(function(index){
        $(this).attr('id', counter);
        $(this).children(".number").html(counter+1);
        counter++;
     });
  }

  $(function(){
    $( ".priority" ).sortable({
      update: function(event){
        updateRankings();
      }
    });
    $( ".priority" ).disableSelection()
  });

  $("#rank").click(function(){
    var choice = ($(".sortable")[0]).innerHTML;
    if (choice == SALARY_t) {
      document.getElementById("understanding").innerHTML = "If money equals priority, it seems that you have a pretty good sense of how the budget of your kid school is spent.";
    }
    else{
      document.getElementById("understanding").innerHTML = "If money equals priority, it seems that the budget of your children’s school is being spent with a different mindset.";
    }
    $(".priority").hide(1500);
    $(".ranking").hide(1500);
    $("#direction").hide(1500);
    $('#rank').hide();

  });
