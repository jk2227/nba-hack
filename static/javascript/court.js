//function allows us to draw the court
//arguments: svg -- the svg object for us to append the court to
function drawCourt(svg) {
  //basket
  svg.append("circle")
    .attr("cx", xScale(0))
    .attr("cy", yScale(0))
    .attr("r", (xScale(7.5) - xScale(0)))
    .attr("fill", "none")
    .attr("stroke", "#b30000")
    .attr("stroke-width",2);

  //backboard
  svg.append("line")
    .attr("x1", xScale(-30))
    .attr("y1", yScale(-7.5))
    .attr("x2", xScale(-30) + (xScale(60) - xScale(0)))
    .attr("y2", yScale(-7.5))
    .style("stroke-width",4)
    .style("stroke", "rgb(0, 0, 0)");

  //the paint...
  //outer box
  svg.append("rect")
    .attr("x", xScale(-80))
    .attr("y",yScale(-47.5+190))
    .attr("width",xScale(160) - xScale(0))
    .attr("height",yScale(0) - yScale(190))
    .attr("fill", "none")
    .style("stroke-width",3)
    .style("stroke", "white");

  //inner box
  svg.append("rect")
    .attr("x", xScale(-60))
    .attr("y", yScale(-47.5+190))
    .attr("width", xScale(120) - xScale(0))
    .attr("height", yScale(0) - yScale(190))
    .attr("fill", "none")
    .style("stroke-width",3)
    .style("stroke", "white");

  //3 point line; left corner
  svg.append("line")
    .attr("x1", xScale(-220))
    .attr("y1", yScale(-47.5+140))
    .attr("x2", xScale(-220))
    .attr("y2", yScale(-47.5+140) + (yScale(0) - yScale(140)))
    .style("stroke-width",3)
    .style("stroke", "white");

  //3 point line; right side
  svg.append("line")
    .attr("x1", xScale(220))
    .attr("y1", yScale(-47.5+140))
    .attr("x2", xScale(220))
    .attr("y2", yScale(-47.5+140) + (yScale(0) - yScale(140)))
    .style("stroke-width",3)
    .style("stroke", "white");

  //out of bounds lines for the court
  svg.append("rect")
    .attr("x", xScale(-250))
    .attr("y", yScale(-47.5+470))
    .attr("width", xScale(500) - xScale(0))
    .attr("height", yScale(0) - yScale(470))
    .attr("fill", "none")
    .style("stroke-width",3)
    .style("stroke", "white");

  //drawing the arcs!

  //this is the arc marking the restricted area
  var arc_restricted = d3.svg.arc()
    .innerRadius(xScale(40) - xScale(0))
    .outerRadius(xScale(40) - xScale(0))
    .startAngle(-90 * (Math.PI/180)) //converting from degs to radians
    .endAngle(Math.PI/2) //just radians

  svg.append("path")
    .attr("d", arc_restricted)
    .attr("fill", "none")
    .attr("transform", "translate("+xScale(0)+","+yScale(0)+")")
    .style("stroke-width",3)
    .style("stroke", "white");

  //this is the arc on top of the free throw line
  var arc_top_ft = d3.svg.arc()
    .innerRadius(xScale(60) - xScale(0))
    .outerRadius(xScale(60) - xScale(0))
    .startAngle(-90 * (Math.PI/180)) //converting from degs to radians
    .endAngle(Math.PI/2) //just radians

  svg.append("path")
    .attr("d", arc_top_ft)
    .attr("fill", "none")
    .attr("transform", "translate("+xScale(0)+","+yScale(142.5)+")")
    .style("stroke-width",3)
    .style("stroke", "white");

  //this is the arc on the bottom of the free throw line
  var arc_bottom_ft = d3.svg.arc()
    .innerRadius(xScale(60) - xScale(0))
    .outerRadius(xScale(60) - xScale(0))
    .startAngle(270 * (Math.PI/180)) //converting from degs to radians
    .endAngle(Math.PI/2) //just radians

  svg.append("path")
    .attr("d", arc_bottom_ft)
    .style("stroke-dasharray", ("5, 10"))
    .attr("fill", "none")
    .attr("transform", "translate("+xScale(0)+","+yScale(142.5)+")")
    .style("stroke-width",3)
    .style("stroke", "white");

  //this is the arc marking the rest of the 3 point line
  var arc_three = d3.svg.arc()
    .innerRadius(xScale(237.5) - xScale(0))
    .outerRadius(xScale(237.5) - xScale(0))
    .startAngle(-68 * (Math.PI/180)) //converting from degs to radians
    .endAngle(68 * (Math.PI/180)) //just radians

  svg.append("path")
    .attr("d", arc_three)
    .attr("fill", "none")
    .attr("stroke", "rgb(0, 0, 0)")
    .attr("transform", "translate("+xScale(0)+","+yScale(0)+")")
    .style("stroke-width",3)
    .style("stroke", "white");
}

var height = 600;
var width = 600;
var svg = d3.select("#court_area")
  .attr("height", height)
  .attr("width", width);

var selectedShots=[];

var padding = 15;
var xScale = d3.scale.linear()
  .domain([-250, 250])
  .range([padding, width - padding]);

var yScale = d3.scale.linear()
  .domain([-50, 470])
  .range([height - 2*padding, 0]);

drawCourt(svg, 0);
