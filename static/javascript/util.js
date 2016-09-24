function createTable(objList) {
  playerToPercentage = {} 
  objList.map(function(obj) {
    if (!(obj.PLAYER_NAME in playerToPercentage)) {
      playerToPercentage[obj.PLAYER_NAME] = {"made": 0, "attempted": 0}
    } 
    playerToPercentage[obj.PLAYER_NAME]["attempted"] += 1 
    playerToPercentage[obj.PLAYER_NAME]["made"] += obj.SHOT_MADE_FLAG
  });

  for (var key in playerToPercentage) {
    playerToPercentage[key] =  playerToPercentage[key]["made"] / playerToPercentage[key]["attempted"] 
  }

  var items = Object.keys(playerToPercentage).map(function(key) {
    return [key, playerToPercentage[key]];
  });

  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  var content = "<table id= 'bestTable'>"
  for (i = 0; i < 3; i++) {
    content += '<tr>'
    content += '<td>' + items[i][0] + '</td>'
    content += '<td>' + items[i][1] + '</td>'
    content += = '</tr>'
  }
  content += '</table>'

  $('#best_worst_players').append(content);

}

function removeTable() {
  $('#bestTable').remove(); 
}

var percentFormat = d3.format(".3n")
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

function plotShots(svg, teamId) {
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
       var shots = retrieveShots(d.x, d.y, teamId);
       console.log(shots);
     });
}

function retrieveShots(x, y, opposingTeam) {
  fetch('select * from "shot_details" as s, "sv_box_scores_2015\-2016" as g where s.GAME_ID = g."GAME_ID" and s.TEAM_ID = g."TEAM_ID" and g."VS_TEAM_ID" = ' + opposingTeam, print);
}

var select = d3.select("#opposing_team").on("change", onOpposingTeamChange);
function onOpposingTeamChange() {
  var sel = document.getElementById('opposing_team');
  var value = sel.options[sel.selectedIndex].value;
  plotShots(svg, value);
}
