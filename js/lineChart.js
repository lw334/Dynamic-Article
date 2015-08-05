function draw_line_chart(school_name,similars){
var margin = {top: 20, right: 80, bottom: 30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;//%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.budget); });


var dropDown = d3.select("#lineFilter").append("select")
                  .attr("name", "school-list");

var svg = d3.select("body").select('#lineChart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("/data/yearlyBudget.csv", function(error, data) {
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
      .attr("class", "x axis")
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
      .attr("class", "y axis")
      .style("font-size", "12px")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Budget");

  var sch = svg.selectAll(".sch")
      .data(schools)
      .enter().append("g")
      .attr("class", "school");

  schools = schools.sort(function(a, b) { return d3.ascending(a["name"], b["name"]);})
  //console.log(schools)
  //options
  var options = dropDown.selectAll("option")
             .data([{"name":"All"}, {"name":"Your school and similar schools"}].concat(schools))
           .enter()
             .append("option");


  options.text(function (d) { return d["name"]; })
         .attr("value", function (d) { return d["name"]; });

//draw lines
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
          if (d.name == school_name){
            return "2px";
          }
          else if (similars.indexOf(d.name)!= -1){
          console.log("similar school found!")
          return "2px";
          }
      })
      .style("opacity", function(d) {         
          if (d.name == school_name){
            return "1";
          }
          else if (similars.indexOf(d.name)!= -1){
          console.log("similar school found!")
          return "1";
          }
      });


//prepare tooltips

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

//formating lines
  sch.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.budget) + ")"; })
      .attr("x", 3) 
      .attr("dy", ".35em");


  svg.selectAll(".line").on("mouseover", function(d) {
    
    console.log("mouseOVER!")
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(d["name"])
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
          selected = school_name;
          comparison = 1;
        }

        displayOthers = d3.event.target.checked ? "inline" : "none";
        display = d3.event.target.checked ? "none" : "inline";

        if(selected == 'All'){
          svg.selectAll(".line")
              .attr("display", display);
        }
        else {
          if (comparison == 1) {
            svg.selectAll(".line")
               .filter(function(d) { return (similars.indexOf(d["name"])!= -1);})
               .attr("display", "inline");
            svg.selectAll(".line")
               .filter(function(d) { return similars.indexOf(d["name"]) == -1;})
               .attr("display", "none");
            svg.selectAll(".line")
                .filter(function(d) {return selected == d["name"]; })
                .attr("display", "inline");
          } else {
          svg.selectAll(".line")
              .filter(function(d) { return selected != d["name"];})
              .attr("display", displayOthers);
              
          svg.selectAll(".line")
              .filter(function(d) {return selected == d["name"];})
              .attr("display", display);
          }
      }
    });
  });
}

