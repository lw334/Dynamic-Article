$(function getStep(){
	var graphStep;
	$("#steps").click(function(event) {
	    graphStep = $(event.target).text();
	    $('.text-blocks-scatter p').removeClass('active-explanation');
		$("#rect-step2").attr("class", "rect-graph");
		$("#rect-step3").attr("class", "rect-graph");
		$("#rect-step4").attr("class", "rect-graph");

	    var currentExp = "#"+"explanation"+graphStep;
	    $(currentExp).addClass("active-explanation");

	    var currentRect = "#"+"rect-step"+graphStep;
	    $(currentRect).attr("class", "active-graph");
	});
});
