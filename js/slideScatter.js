$(function getStep(){
	var graphStep;
	$("#steps").click(function(event) {
	    graphStep = $(event.target).text();
	    //set current step
	    $('#steps li').removeClass('active-step');
	    var currentStep = "#" + "step" + graphStep;
	    $(currentStep).addClass("active-step");
	    //reset the classes for d3 generated objects
		$("#graph-step2").attr("class", "graph-exp");
		$("#graph-step3").attr("class", "graph-exp");
		$("#graph-step4").attr("class", "graph-exp");
		//set explanation
	    $('.text-blocks-scatter p').removeClass('active-explanation');
	    var currentExp = "#" + "explanation" + graphStep;
	    $(currentExp).addClass("active-explanation");
	    //set graphs
	    var currentGraph = "#" + "graph-step" + graphStep;
	    console.log($(currentGraph))
	    $(currentGraph).attr("class", "active-graph");
	});
});
