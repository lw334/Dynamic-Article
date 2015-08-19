function draw_scatter_plot(school,similars,dataset, graphStep){

  var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = 900 - margin.left - margin.right,
        height = 700- margin.top - margin.bottom;

  var XScale = d3.scale.linear().domain([-60,40]).range([0,width]);
      xAxis = d3.svg.axis().scale(XScale).orient("bottom");

  var YScale = d3.scale.linear().domain([-200,250]).range([height,0]);
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
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + (height/2+ 35) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("% Change in Budget from FY15");

  //draw Y-axis
  svg.append("g")
      .attr("class", "y_axis")
      .attr("transform", "translate(" + (width - 320) + "," + "0" + ")")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Change in Enrollment");


  //draw grids
  svg.append("g")         
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis
      .ticks(20)
      .tickSize(-height, 0, 0)
      .tickFormat(""))

  svg.append("g")         
    .attr("class", "grid")
    .call(yAxis
        .ticks(20)
        .tickSize(-width, 0, 0)
        .tickFormat(""))


    //crudly drawing up legend
  svg.append("text")
     .attr("x", 5)
     .attr("y", height-410)
     .attr("class","legend")
     .text("Your School");
  svg.append("text")
     .attr("x", 5)
     .attr("y", height-380)
     .attr("class","legend")
     .text("Similar School");
  svg.append("text")
     .attr("x", 5)
     .attr("y", height-350)
     .attr("class","legend")
     .text("District School");
  svg.append("text")
     .attr("x",5)
     .attr("y", height-320)
     .attr("class","legend")
     .text("Charter School");
  svg.append('rect')
    .attr("x",115)
    .attr("y",height-360)
    .attr("width",10)
    .attr("height",10)
    .style("fill", "#C76062");
  svg.append('rect')
    .attr("x",115)
    .attr("y",height-330)
    .attr("width",10)
    .attr("height",10)
    .style("fill", "#48BB42");
  svg.append('circle')
    .attr("r", 10)
    .attr("cx", 120)
    .attr("cy", height-415)
    .style("stroke-width","2px")
    .style("fill", "none")
    .style("stroke", "#c1272d");
  svg.append('circle')
    .attr("r", 7)
    .attr("cx", 120)
    .attr("cy", height-385)
    .style("stroke-width","2px")
    .style("fill","none")
    .style("stroke", "#4879CE");
         
  // // add the tooltip area to the webpage
  var tooltip = d3.select("body").select("#scatterPlot").append("div")
      .attr("class", "tooltip");


  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
  };

  //drawing default dots
  svg.selectAll("circle")
     .data(scatterdata)
     .enter()
     .append("circle")
     .attr("cx",function(d){
        return XScale(+d["% Change from FY 15"]*100);
       })
     .attr("cy", function(d){
        return YScale(+d["Change in Enrollment"]);
       })
     .attr("r", function(d){
        if ((d["Unit Name"] == school["Unit Name"])) {
          return 10;
        }
        else if (similars.indexOf(d["Unit Name"])!= -1) {
          return 7;
        }
        else {
          return 4;
        }
      })
    .style("stroke-width",function(d){
       if ((d["Unit Name"] == school["Unit Name"])||(similars.indexOf(d["Unit Name"])!= -1)) {
        return "2";
      }
      else {
        return "0";
      }
    })
    .style("stroke",function(d){
      if (d["Unit Name"] == school["Unit Name"]) {
        return "#c1272d";
      }
      else if (similars.indexOf(d["Unit Name"])!= -1) {
        return "#4879CE";
      }
      else {
        return "#636363";
      }
    })
    .style("fill", function(d){
      if (d["Governance"] == "District"){
        return "#C76062";
      }
      else if (d["Governance"] == "Charter" || d["Governance"] == "Contract"){
       return "#48BB42";
      }
    })
    .transition(5000)
    .style("opacity", function(d){
        if ( (d["Unit Name"] == school["Unit Name"])||(similars.indexOf(d["Unit Name"])!= -1) ) {
          return 1;
        }
        else {
          return 0.3;
        }
    }); 

    // //tooltips behaviors
    svg.selectAll("circle")
    .data(scatterdata)
    .on("mouseover",function(){
      console.log("TO FRNT")
      var sel = d3.select(this);
      sel.moveToFront();
     })
    .on("mouseover", function(d) {
      console.log("TIP");
      tooltip.style("visibility","visible")
           .transition()
           .duration(200)
           .style("opacity", .9);
      tooltip.html(d["Unit Name"] + "(" + d["Change in Enrollment"]
      + ", " + d["% Change from FY 15"] + ")")
           .style("left", (d3.event.pageX + 5) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      tooltip.transition()
           .duration(500)
           .style("opacity", 0);
    });

  svg.append('rect')
     .attr("class","rect-graph")
     .attr("id","rect-step2")
     .attr("x",-400)
     .attr("y",375)
     .attr("width",1400)
     .attr("height",150)
     .attr("transform","rotate(330, 220, 80)")
     .style("color","gray");
     
  svg.append('rect')
     .attr("class","rect-graph")
     .attr("id","rect-step3")
     .attr("x",40)
     .attr("y",360)
     .attr("width",800)
     .attr("height",250)
     .style("color","gray");

   svg.append('rect')
    .attr("class","rect-graph")
    .attr("id","rect-step4")
    .attr("x",180)
    .attr("y",10)
    .attr("width",300)
    .attr("height",600)
    .style("color","gray");

}

