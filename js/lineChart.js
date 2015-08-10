function draw_line_chart(school_name,similars,dataset){
var margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%Y"))
    .ticks(5)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left").ticks(6,"s");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.budget); });


var dropDown = d3.select("#lineFilter").append("select")
                  .attr("name", "school-list");

var svg = d3.select("body").select('#lineChart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("./js/data/yearlyBudget.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var schools = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, budget: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(schools, function(c) { return d3.min(c.values, function(v) { return v.budget; }); }),
    d3.max(schools, function(c) { return d3.max(c.values, function(v) { return v.budget; }); })
  ]);

  svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "12px")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y_axis")
      .style("font-size", "12px")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Budget (Million $)");

  var sch = svg.selectAll(".sch")
      .data(schools)
      .enter().append("g")
      .attr("class", "school");

  schools = schools.sort(function(a, b) { return d3.ascending(a["name"], b["name"]);})
  //console.log(schools)
  //options
  var options = dropDown.selectAll("option")
             .data([{"name":"Your school and similar schools"}].concat(schools))
             .enter()
             .append("option");

  options.text(function (d) { return d["name"]; })
         .attr("value", function (d) { return d["name"]; });

//draw default lines
  sch.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {         
          if (d.name == school_name){
            return "#c1272d";
          }
          else if (similars.indexOf(d.name)!= -1){
          console.log("similar school found!")
          return "#4879CE";
          }
      })
      .style("stroke-width", function(d) {         
        if ((d.name == school_name) || (similars.indexOf(d.name)!= -1)){
          return "3px";
        }
        else {
          return "1.5px";
        }
      })
      .style("opacity", function(d) {         
        if ((d.name == school_name) || (similars.indexOf(d.name)!= -1)){
          return "1";
        }
        else {
          return "0.1";
        }
      });

//  //put dots on the lines

// svg.selectAll(".line")
//     .data(schools)
//     .enter()
//     .append("circle")
//     .attr("cx", function(d, i) {return d.date})
//     .attr("cy", function(d, i){return d.value}) 
//     .attr("r", 2);
//     .attr("stroke", "black")

//prepare tooltips
var tooltip = d3.select("body").select("#lineChart").append("div")
    .attr("class", "tooltip");

//formating lines
  sch.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.budget) + ")"; })
      .attr("x", 3) 
      .attr("dy", ".35em");


  svg.selectAll(".line").on("mouseover", function(d) {
    
    console.log("mouseOVER!")
        d3.select(this).attr("stroke-width", "3px").style("stroke", "#c1272d").style("opacity","1").style("fill","none");
        tooltip.style("visibility","visible")
             .transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(d["name"])
             .style("left", (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
    })
  .on("mouseout", function(d) {
        d3.select(this).attr("stroke-width", "1.5px").style("stroke", "#59606A").style("opacity","0.1").style("fill","none");
        tooltip.transition()
             .duration(500)
             .style("opacity", 0);
    });

    dropDown.on("change", function() {
      var selected = d3.event.target.value;
      var comparison = 0;


      svg.selectAll(".line")
         .style("opacity", 0.1)
         .style("stroke", "#A6A6A6")
         .style("stroke-width", "1.5px")
         .style("fill","none");

      if (selected == 'Your school and similar schools'){
        selected = school_name;
        comparison = 1;
      }

      if (comparison == 1) {
        svg.selectAll(".line")
           .filter(function(d) { return (similars.indexOf(d["name"])!= -1); })
           .style("stroke", "#4879CE")
           .style("opacity", 1)
           .style("stroke-width", "3px");
        svg.selectAll(".line")
            .filter(function(d) {return selected == d["name"]; })
            .style("stroke", "#c1272d")
            .style("opacity", 1)
           .style("stroke-width", "3px");
      } else {
        var line_similar_schools;
        var line_school;
        for (var i = 0; i < dataset.length; i++) {
          if (dataset[i]["Unit Name"] == selected) {
            line_school = dataset[i];
            line_similar_schools = line_school["SimilarNames"]; 
            line_similar_schools = line_similar_schools.trim().split(",");
            for (var j = 0; j < line_similar_schools.length; j ++){
              line_similar_schools[j] = line_similar_schools[j].trim().replace("'","").replace("[","").replace("]","").replace("'","");
            }
          }
        }
        svg.selectAll(".line")
          .filter(function(d) {
            return (line_similar_schools.indexOf(d["name"]) != -1);
          })
          .transition()
          .style("stroke", "#4879CE")
          .style("opacity", 1)
          .style("stroke-width", "3px");
      svg.selectAll(".line")
          .filter(function(d) {return selected == d["name"];})
          .style("stroke", "#c1272d")
          .style("opacity", 1)
          .style("stroke-width", "3px");
    }    
  });
})
}

