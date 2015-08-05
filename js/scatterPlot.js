function draw_scatter_plot(school,similars,dataset){
  var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  var XScale = d3.scale.linear().domain([1,4020]).range([0,width]);
      xAxis = d3.svg.axis().scale(XScale).orient("bottom");

  var YScale = d3.scale.linear().domain([-1039726,1299933]).range([height,0]);
      yAxis = d3.svg.axis().scale(YScale).orient("left");
  

  var dropDown = d3.select("#scatterFilter").append("select")
                    .attr("name", "school-list");

  var svg = d3.select("body").select("#scatterPlot")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var scatterdata = dataset.sort(function(a, b) { return d3.ascending(a["Unit Name"], b["Unit Name"]);});
 
  //draw X-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("enrollment");

  //draw Y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Change in Per Pupil Enrollment");

  //options
  var options = dropDown.selectAll("option")
             .data([{"Unit Name":"All"}, {"Unit Name":"Your school and similar schools"}].concat(scatterdata))
           .enter()
             .append("option");

  options.text(function (d) { return d["Unit Name"]; })
         .attr("value", function (d) { return d["Unit Name"]; });

         
  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip");

  //drawing dots
  svg.selectAll("circle")
     .data(scatterdata)
     .enter()
     .append("circle")
     .attr("id", function(d) { return d["Unit Name"]; 
      })
     .attr("cx",function(d){
        return XScale(+d["FY 16 Projected Enrollment"]);
       })
     .attr("cy", function(d){
        return YScale(+d["Change in Per Pupil Enrollment Funding"]);
       })

     .attr("r", 2.5)
     .style("fill", function(d){
          if (d["Unit Name"] == school["Unit Name"]){
            console.log("school found!");
            return "#c1272d";
          }
          else if (similars.indexOf(d["Unit Name"])!= -1){
            console.log("similar school found!");
            return "#4879CE";
            }
        })
      //tooltips behaviors
      .on("mouseover", function(d) {
        console.log("TIP")
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d["Unit Name"] + "<br/> (" + "Enrollment: "+ d["FY 16 Projected Enrollment"]
            + ", " + "Change in funding: " + d["Change in Per Pupil Enrollment Funding"] + ")")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

  dropDown.on("change", function() {
      var selected = d3.event.target.value;
      var comparison = 0;

      if (selected == 'Your school and similar schools'){
        selected = school["Unit Name"];
        comparison = 1;
      }

      svg.selectAll("circle")
         .style("opacity", 0.9)
         .attr("r", 2);

      displayOthers = d3.event.target.checked ? "inline" : "none";
      display = d3.event.target.checked ? "none" : "inline";
      console.log(display)
      console.log(displayOthers)

      if(selected == 'All'){
        svg.selectAll("circle")
            .attr("display", display);
      }
      else {
        if (comparison == 1) {
          svg.selectAll("circle")
             .filter(function(d) { return (similars.indexOf(d["Unit Name"])!= -1);})
             .transition()
             .attr("r", 5)
             .style("opacity", 1)
             .attr("display", "inline");
          svg.selectAll("circle")
             .filter(function(d) { return similars.indexOf(d["Unit Name"]) == -1;})
             //.attr("display", "none")
             .attr("display", "inline")
             .transition()
             .style("opacity", 0.2);
          svg.selectAll("circle")
              .filter(function(d) {return selected == d["Unit Name"]; })
              .attr("r", 5)
              .style("opacity", 1)
              .attr("display", "inline");
        } else {
          svg.selectAll("circle")
            .filter(function(d) { return selected != d["Unit Name"];})
            .attr("display", display);
        svg.selectAll("circle")
            .filter(function(d) { return selected == d["Unit Name"];})
            .attr("display", display);
        }
      }
  });
}
//});
