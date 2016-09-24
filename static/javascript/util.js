var svg = d3.select("#court_area");

var xScale = d3.scale.linear()
  .domain([-250, 250])
  .range([padding, width - padding]);

var yScale = d3.scale.linear()
  .domain([-50, 470])
  .range([height - 2*padding, 0]);

drawCourt(svg, 0);

// Initialized season players map and players map
var season_players_map;
var players_map;
var playerHeatMap = false;

// Color scale for hexes
var color = d3.scale.linear()
    .domain([0,.5, 1])
    .range(["red","yellow", "steelblue"])
    .interpolate(d3.interpolateLab);

var hexbin = d3.hexbin()
    .radius(7.5);

var transition = d3.transition();

function plotShots(svg) {
  svg.selectAll('.hexagon').remove();

  var points = [];
  for (var i = -270; i < 270; i++) {
    for (var j = -100; j < 470; j++) {
      points.push([i, j]);
    }
  }

  svg.append("g")
    .attr("clip-path", "url(#clip)")
    .selectAll(".hexagon")
      .data(hexbin(points))
    .enter().append("path")
      .attr("class", "hexagon")
      .attr("d", hexbin.hexagon(8.5))
      .attr("transform", function(d) {
        return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
      .style("fill", "white")
      .style("opacity", 0.001)
      .transition().duration(1500)
      .style("opacity", 0.3);
  svg.selectAll(".hexagon")
     .on("click", function(d) {
       d3.selectAll(".hexagon").style("fill", "white").style("opacity", 0.3);
       d3.select(this).style("fill", "blue").style("opacity", 0.8);
       console.log("x: " + d.x);
       console.log("y: " + d.y);
       //display(d.x, d.y);
     });
}

plotShots(svg);
