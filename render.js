
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

  return board;
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

  var lastPieces = floor.lastPieces;
  var laid = floor.laid;

  var swapPiece = false;
  
  console.log("lastPieces: ", lastPieces);

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

    index = 0;
    laid.map( (row,i) => {
      //console.log("i: " + i);
      x = 0;
      row.map(p => {
	//console.log("add piece: " + p);
	var b = addBoard(elem, x, y, p, color ? '#ff0' : '#cc0');

	b.rowIndex = i;

	b.logs = floor.logs[index++];
	//console.log("added logs for ", index, ", length: " + b.logs.length);

	b.addEventListener('click', (function(e) {

	   if (e.ctrlKey) {
	     if(swapPiece) {
	       console.log("swap rows: ", swapPiece.rowIndex, this.rowIndex);

	       var tmp = floor.laid[swapPiece.rowIndex];
	       floor.laid[swapPiece.rowIndex] = floor.laid[this.rowIndex];
	       floor.laid[this.rowIndex] = tmp;

	       swapPiece.style.backgroundColor = swapPiece.oldColor;
	       swapPiece = false;

	       document.getElementById('floor').innerHTML ="";
	       renderFloor(floor);
	     } else {
	       console.log("set opacity");
	       swapPiece = this;
	       this.oldColor = this.style.backgroundColor;
	       this.style.backgroundColor = "#fed";
	     }



	   } else {
	     console.log("logs, target: ");
	     console.log(this.logs);
	   }

	}).bind(b));

	var se = document.createElement('div');
	//se.style = "font-size: 72px";
	se.className = 'size';
	se.innerHTML = ""+ Math.abs(p);
	//se.innerHTML = '' + Math.abs(p);
	b.appendChild(se);

	  // used when debugging calculated lastPiece size
	/*
	if( (x > 0 && Math.abs(p) !== 2028) || (x === 0) ) {
	  var se = document.createElement('div');
	  se.style = "font-size: 72px";
	  se.className = 'size';
	  se.innerHTML = 'L' + lastPieces[i] + '-R' + Math.abs(p);
	  //se.innerHTML = '' + Math.abs(p);
	  b.appendChild(se);
	}*/


	color = !color;
	x += Math.abs(p);
      });
      //console.log("next row");
      y += 192;
    });
  }

  if(edges) {
    renderEdges(edges)
  }
}

//var currWidth = 2470;
//var currHeight = 2678;

var currWidth = 5254;
var currHeight = 2990;

var dragOffset = 0;

function setElemSize(id, w, h) {
  //var drag = document.getElementById('drag');
  var elem = document.getElementById(id);
  if(elem) {
    elem.style.width = w + "px";
    elem.style.height = h + "px";
  }
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

  setElemSize('drag', width+dragOffset, height);
  setElemSize('floor', width, height+400);

  //setElemPos($('#marker'), width, height);

  currWidth = width;
  currHeight = height;

  document.getElementById('floor').innerHTML ="";
  var floor = fillFloor(width, height);

  var saved = floor.split.reduce( (a,v) => a+Math.abs(v), 0) ;
  var lost  = floor.lost.reduce( (a,v) => a+Math.abs(v), 0) ;

  var used = floor.laid.map(r => r.reduce( (a,v) => a+Math.abs(v), 0)).reduce( (a,v) => a+Math.abs(v), 0) ;

  console.log("Avstämning: saved %d + lost: %s + used: %d = ", saved, lost, used, saved+lost+used);

  floor.roomArea = width * height / 1000000;
  floor.efficiency = floor.roomArea  / (floor.boards * 2.028*0.192);
  console.log("usage: ", floor);

  renderFloor(floor);
  console.log("lost " + floor.lost.reduce( (a,v) => a+v, 0) );
  console.log("num logs: ", floor.logs.length);

  $('#stats').innerText = "room size: "  + (floor.roomArea*10|0)/10 + ", used area: " + (floor.area*10|0)/10 + ", boards: " + floor.boards + ", packs: " + (1+floor.packs|0) + ", efficiency: " + ((1000*floor.roomArea / (floor.boards * 2.028*0.192))|0)/10 + "\nremain: " + ( (floor.packs+1 | 0) *6-floor.boards) + " boards, "
    + floor.split.length + " pieces " + ((saved*0.192/100)|0)/10 + " m2 (" + (saved|0) + " mm) split, "
  + floor.lost.length + " pieces " + ((lost*0.192/100)|0)/10 + " m2 (" + (lost|0) + " mm) lost";
}

function main() {
  //var floor = fillFloor(2546, 2578);

  // 2992, 2985, 2991

  setFloorSize(currWidth, currHeight);

  //document.getElementById('drag').style.width = currWidth+dragOffset;
  //document.getElementById('drag').style.height = currHeight;
  //setElemSize('drag', currWidth+dragOffset, currHeight);
  //setElemSize('floor', currWidth, currHeight);

  //var floor = fillFloor(currWidth-dragOffset, currHeight);
  //renderFloor(floor.laid);


//  document.getElementById('floor').addEventListener('mousemove', (e) => {
  document.getElementById('lay').addEventListener('click', (e) => {

    console.log("click: ", e);
    var width = document.getElementById('drag').getBoundingClientRect().width-dragOffset;
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
