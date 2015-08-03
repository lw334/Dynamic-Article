function draw_pie_chart(school_name) {
var width = 480,
    height = 250,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d[school_name]; });

var svg = d3.select("body").select("#pie").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("PieChart.csv", function(error, data) {

  data.forEach(function(d) {
    d[school_name] = +d[school_name];
    //console.log(d[school_name]);
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
        //console.log(d.value)
        if (d.value != 0) {
          return color(d.data["2015Expenditures"]); 
        }
      })
      .transition().delay(function(d, i) { return i * 1000; }).duration(1000)
      .attrTween('d', function(d) {
         var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t);
            return arc(d);
          }
        });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-family", "sans-serif")
      .style("font-size", "10px") 
      .text(function(d) { 
        if (d.value != 0) {
          return d.data["2015Expenditures"]; 
        }
      });
});
}
