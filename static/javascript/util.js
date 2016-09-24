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

var drag = d3.behavior.drag()
  .on("drag", dragging)
  .on("dragstart", dragging);

// Function that is called every time the mouse is dragged
function dragging(){
  // Mouse coords to calculate circle radius
  if (!playerHeatMap){
    var coords = d3.mouse(this);
    var x = coords[0];
    var y = coords[1];
    var r = selectionRadius

    // Get all hexes, see if they are within a radius of the circle, color them if they are
    var hexs = d3.selectAll(".hexagon").filter(function(d){
      var hex = d3.select(this);
      var hexX = d3.transform(hex.attr("transform")).translate[0];
      var hexY = d3.transform(hex.attr("transform")).translate[1];
      var distance = Math.sqrt(Math.pow((hexX - x),2) + Math.pow((hexY - y),2))

      if (distance <= r){
        var selectionType = parseInt(d3.select('input[name="selectionType"]:checked').node().value)

        if (!Boolean(selectionType)){
          if (hex.style("fill") != "rgb(0, 0, 0)"){
            hex.style("fill", "rgb(0, 0, 0)")
            selectedShots = selectedShots.concat(hex.data()[0]) //add shots to selected shot list
          }
        }
        else{
          hex.style("fill", "white")
          hex.data()[0].forEach(function(shot){
            i = selectedShots.indexOf(shot)
            i >= 0 && selectedShots.splice(i,1) //if shot exists, remove it from selected shots
          })
        }
      }
    })
  }
}

var height = 600;
var width = 600;
var svg = d3.select("#court_area")
  .attr("height", height)
  .attr("width", width)
  .call(drag);

var selectedShots=[];

var padding = 15;
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
    .radius(7.5)

// Import all data from the json
d3.json("dictionary.json", function(error, result) {
      season_players_map = JSON.parse(result);

      // Loop through each year and add an option to the selection tab
      Object.keys(season_players_map).sort().forEach(function(year){
        d3.select('#years').append("option").attr("value", year).text(year)
      });

      // create hexes for the legend
      svg.append("g").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("class", "legend")
        .attr("d", hexbin.hexagon(8.5))
        .attr("transform", function(d) {
          return "translate(" + xScale(-250) + "," + yScale(-65) + ")"; })
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", ".7")

      svg.append("text")
        .attr("x",xScale(-240))
        .attr("y",yScale(-70))
        .attr("class", "legend")
        .text("- 0% Shots Made")

      svg.append("g").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("class", "legend")
        .attr("d", hexbin.hexagon(8.5))
        .attr("transform", function(d) {
          return "translate(" + xScale(-70) + "," + yScale(-65) + ")"; })
        .style("fill", "yellow")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", ".7")

      svg.append("text")
        .attr("x",xScale(-60))
        .attr("y",yScale(-70))
        .attr("class", "legend")
        .text("- Season FG Average")


      svg.append("g").append("path")
        .attr("clip-path", "url(#clip)")
        .attr("class", "legend")
        .attr("d", hexbin.hexagon(8.5))
        .attr("transform", function(d) {
          return "translate(" + xScale(120) + "," + yScale(-65) + ")"; })
        .style("fill", "steelblue")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", ".7")

      svg.append("text")
        .attr("x",xScale(130))
        .attr("y",yScale(-70))
        .attr("class", "legend")
        .text("- 100% Shots Made")


      svg.selectAll(".legend").style("opacity", 0)

});

// Arguments:
//     season = selected season
//     svg = svg adding elements to

//     Creates hexbins using imputed season and global data initialized above.
//     Creates clicking events for hexbins
function plotShots(svg, season, player=-1) {
  players_map = season_players_map[season];
  clearPlayerHexes();

  if (player == -1){
    svg.selectAll('.hexagon').remove(); // Remove all existing hexagons
    var shots = [];
    for (var key in players_map) {
      if(players_map.hasOwnProperty(key)) {
        shots = shots.concat(players_map[key][players_map[key].length -1])
      }
    }

    svg.append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll(".hexagon")
        .data(hexbin(shots))
      .enter().append("path")
        .attr("class", "hexagon")
        .attr("d", hexbin.hexagon(8.5))
        .attr("transform", function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
        .style("fill", "white")

  }else{
    var shots = players_map[player][players_map[player].length -1];

    svg.selectAll(".legend").style("opacity", 1) // unhide legend

    var percentMade = season_players_map[season][player][2]
    color.domain([0,percentMade,1]);

    d3.selectAll(".hexagon").style("opacity",0) // hide all hexes
    playerHeatMap = true;

    svg.append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll(".hexagon")
        .data(hexbin(shots))
      .enter().append("path")
        .attr("class", "hexagon player")
        .attr("d", hexbin.hexagon(8.5))
        .attr("transform", function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; })
        .style("fill", function(d){
          makes = 0
          d.forEach(function(shot){
            makes += shot[2]/d.length
          })
          return color(makes);
        })

    svg.selectAll(".player").filter(function(d){
      makes = 0
      d.forEach(function(shot){
        makes += shot[2]/d.length
      })

      var hex = d3.select(this);
      var hexX = d3.transform(hex.attr("transform")).translate[0];
      var hexY = d3.transform(hex.attr("transform")).translate[1];

      svg.append("text")
        .attr("x",hexX)
        .attr("y",hexY)
        .attr("dy", 2)
        .attr("class", "percent")
        .text((percentFormat(makes*100)) + "%")
        .style("text-anchor", "middle")
        .style("font-size", "4px")
        .style("font-weight", "1000")
    })

    // Make percent and hex bigger on hover
    svg.selectAll(".percent").on("mouseover", function(d){
      var x = d3.select(this).attr("x")
      var y = d3.select(this).attr("y")
      hexs = d3.selectAll(".player").filter(function(h){
      // iterate through all player hexes and see if they are hovered over
        d3.select(this).style("opacity", .1)

        var hex = d3.select(this);
        if (hex){
          return (d3.transform(hex.attr("transform")).translate[0] == parseFloat(x))
          && (d3.transform(hex.attr("transform")).translate[1] == (parseFloat(y)))
        }
      })
      .attr("d", hexbin.hexagon(25))
      .style("opacity","1")

      // make other hexes dim so you can see the hover
      d3.selectAll(".percent").style("opacity", .1)
      d3.select(this)
        .style("font-size", "15px")
        .style("opacity", 1)
        .attr("dy", 5)


    })
    // return everything to normal on mouseout
    svg.selectAll(".percent").on("mouseout", function(d){
      d3.select(this).style("font-size", "4px").attr("dy", 2)
      d3.selectAll(".percent").style("opacity", 1)

      var x = d3.select(this).attr("x")
      var y = d3.select(this).attr("y")
      hexs = d3.selectAll(".player").filter(function(h){
        d3.select(this).style("opacity", .6)
        var hex = d3.select(this);
        if (hex){
          return (d3.transform(hex.attr("transform")).translate[0] == parseFloat(x)) && (d3.transform(hex.attr("transform")).translate[1] == (parseFloat(y)))
        }
      })
      .attr("d", hexbin.hexagon(8.5))
      .style("opacity",".6")
    })

    d3.select("#clearPlayer").style("visibility", "visible")
  }
}

// Clears all of the player heat map hexes
function clearPlayerHexes(){
  d3.selectAll(".player").remove()
  d3.selectAll(".percent").remove()
  d3.selectAll(".hexagon").style("opacity",.6)
  d3.select("#clearPlayer").style("visibility", "hidden")
  d3.selectAll(".legend").style("opacity", 0) //hide legend


  playerHeatMap = false;
}

// clears selected list and resets the colors of the hexes
function clearSelection(){
  removeCards();
  selectedShots = [];
  d3.selectAll(".hexagon").filter(function(d){
    var hex = d3.select(this);
    hex.style("fill", "white")
  })
}

// Clear selection when button is clicked.
d3.select("#clearSelection").on("click", function(d){
  clearSelection();
})

// Get year selection
d3.select("#years").on("change",function(){
  if (d3.select("#years").node().value != '0'){
    plotShots(svg, d3.select("#years").node().value );
  };
  clearSelection();
});

// Get selected radius
d3.select("#selectionRadius").on("input", function(){
  selectionRadius = d3.select("#selectionRadius").node().value
  d3.select("#brush").select("circle").attr("r", selectionRadius)
});

//Clear player hexes when clicked
d3.select("#clearPlayer").on("click", function(){
  clearPlayerHexes();
})
