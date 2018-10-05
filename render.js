
var $ = function(sel, elem) {
  return document.querySelector(sel, elem ? elem : document);
}

var $$ = function(sel, elem) {
  return document.querySelectorAll(sel, elem ? elem : document);
}

function addBoard(parent, x, y, split, color) {
var board = document.createElement('board');
board.innerHTML =

`<board-pattern style="position: relative; left: 0px">
<box><v></v><v></v><v></v><v></v></box>
<slate><h></h><h></h><h></h></slate>
<box>  <v></v><v></v><v></v><v></v></box>
<slate><h></h><h></h><h></h></slate>
<box>  <v></v><v></v><v></v><v></v></box>
<slate><h></h><h></h><h></h></slate>
<box>  <v></v><v></v><v></v><v></v></box>
<slate><h></h><h></h><h></h></slate>
</board-pattern>`;
// `<board style="width: 2040px">
  board.style.width = "2028px";
  board.style.position = "absolute";
  board.style.left=  x + "px";
  board.style.top =  y + "px";
  board.style.backgroundColor = color || 'yellow';

  if(split < 0) {
    board.style.width = (-split) + "px";
  } else if(split > 0) {
    board.firstChild.style.left = "-" + (2028-split) + "px";
    board.firstChild.style.width = "2028px";
    board.style.width = ""+(split) + "px";
    board.style.border = "1px solid black";
  }
/*
if(split < 0) {
  board.firstChild.style.left = split + "px";
  board.style.width = (2029+split) + "px";
} else if(split > 0) {
  board.style.width = (split) + "px";
}
*/

  parent.appendChild(board);
}

var test = false;


var edges = [
  2558, 0,
  2561, 20,
  2561, 40,
  2560, 60,
  2558, 80,
  2558, 100,
  2559, 120,
  2561, 140,
  2558, 160,
  2557, 178,
  2331, 204,
  2339, 220,
  2343, 240,
  2345, 260,
  2345, 280,
  2207, 300,
  2154+55, 320,
  2150+55, 340,
  2196+16, 360
];

edges = edges.reduce( (a,v,i) => {
  if(i & 1) {
    a[a.length-1].push(10*v);
  } else {
    a.push([v]);
  }
  return a;
}, []);

console.log("edges:", edges);

function renderEdges(edges) {
  var w = 3000, h = 3000;

  var svgNS = "http://www.w3.org/2000/svg";

  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", ""+w);
  svg.setAttribute("height", ""+h);
  var p = document.createElementNS(svgNS, "polygon");
  p.setAttribute("points", "0,0 0,3000 3000,3000 3000,0");
  p.setAttribute("style", "stroke: black; stroke-width:20; fill: none");
  svg.appendChild(p);
  document.getElementById('svg').appendChild(svg);
  var testDiv = document.createElement("div");
  testDiv.innerHTML = "<h1>this is some text</h1>"

  document.getElementById('svg').appendChild(svg);
  document.getElementById('svg').appendChild(testDiv);
  //document.body.appendChild(svg);

}

function renderFloor(floor) {

  if(test) {
    addBoard(document.getElementById('floor'),0,0,0);
    addBoard(document.getElementById('floor'),254,194,0);
    addBoard(document.getElementById('floor'),0, 388, 1040);

    var cut = 192;

    addBoard(document.getElementById('floor'), 800, 582, cut-2028);
    addBoard(document.getElementById('floor'), 800, 582+192+2, 2028-cut);
    addBoard(document.getElementById('floor'), 800-cut, 582+2*(192+2), 2028);

  } else {
    var x, y = 0;

    var elem = document.getElementById('floor');

    var color = true;

    floor.map( (row,i) => {
      //console.log("i: " + i);
      x = 0;
      row.map(p => {
	//console.log("add piece: " + p);
	addBoard(elem, x, y, p, color ? '#ff0' : '#cc0');
	color = !color;
	x += Math.abs(p);
      });
      //console.log("next row");
      y += 192;
    });
  }

  if(edges) {
    //renderEdges(edges)
  }
}

//var currWidth = 2470;
//var currHeight = 2678;

var currWidth = 5254;
var currHeight = 2986;

function setElemSize(id, w, h) {
  //var drag = document.getElementById('drag');
  var elem = document.getElementById(id);

  elem.style.width = w + "px";
  elem.style.height = h + "px";
}

function setElemPos(elem, x, y) {
  //var drag = document.getElementById('drag');
  elem.style.left = x + "px";
  elem.style.top =  y + "px";
}

function setFloorSize(width, height) {
  console.log("setFloorSize; ", width, height);

  $('#width').value = ""+ width;
  $('#height').value = ""+ height;

  setElemSize('drag', width+100, height);
  setElemSize('floor', width, height);

  setElemPos($('#marker'), width, height);

  currWidth = width;
  currHeight = height;

  document.getElementById('floor').innerHTML ="";
  var floor = fillFloor(width, height);
  renderFloor(floor.laid);
  console.log("lost " + floor.lost.reduce( (a,v) => a+v, 0) );
  console.log("usage: ", floor);
}

function main() {
  //var floor = fillFloor(2546, 2578);


  setFloorSize(currWidth, currHeight);

  //document.getElementById('drag').style.width = currWidth+100;
  //document.getElementById('drag').style.height = currHeight;
  //setElemSize('drag', currWidth+100, currHeight);
  //setElemSize('floor', currWidth, currHeight);

  //var floor = fillFloor(currWidth-100, currHeight);
  //renderFloor(floor.laid);


//  document.getElementById('floor').addEventListener('mousemove', (e) => {
  document.getElementById('lay').addEventListener('click', (e) => {

    console.log("click: ", e);
    var width = document.getElementById('drag').getBoundingClientRect().width-100;
    var height = document.getElementById('drag').getBoundingClientRect().height;

    setFloorSize(width, height);

  });


  $('#controls').addEventListener('change', (e) => {

    console.log("change: ", e);
    var width = 1*$('#width').value;
    var height = 1*$('#height').value;
    if(!isNaN(width) && !isNaN(height) ) {
      setFloorSize(width, height);
    }
  });
}
