function fetch(query, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);
      callback(result);
    }
  };
  xhttp.open("GET", "/query/" + query, true);
  xhttp.send();
}

function print(result) {
  console.log(result);
}
