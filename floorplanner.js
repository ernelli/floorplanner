// pattern is
// 202 305 202 305 202 305 202 305 : 2028

'use strict';

var boardLength = 2028;
var boardWidth = 192;

// board = +length cut is on leftside |===========>
// board = -length cut right           >=======|
// board = 0, length 2028              >===========>

//                         pos               2028 - pos,  -pos
// cutting full board:  >===|=======>  ->  [ |=======> ,  >===|  ]


//var roomWidth = 2980;
//var roomLength = 3000;

//var row = 0;
//var pos = 0;


// https://jsfiddle.net/mta6oonp/35/

/*
function nextLength() {
  return roomWidth - pos;
}

function fillRow() {
  var fit = nextLength();
}
*/

var verbose = true;

/*
_log = console.log;

console.log = function () {
  if(verbose) {
    _log.apply(console, arguments);
  } else {

  }
}
*/


function getcutpos(piece, length) {
  if(piece < 0) {

    // |---| < length
    // >=======|
    // -piece
    return length;
  } else {
    //      |------| < length
    // |===========>
    // |           | < piece
    //      |<- pos
    return piece - length;
  }

}


function fillFloor(roomWidth, roomLength) {
  console.log("fillFloor %d, %d", roomWidth, roomLength);

  var numRows = 1 + roomLength / boardWidth;

  var pos, row = 0;

  var laidPieces = [];
  var splitPieces = [];
  var lostPieces = [];

  var usedBoards = 0;

  var even = 0;
  var odd = 254;  //202 + (305-202) / 2;

  function cutBoard(length, pos) {

    if(length % boardLength === 0) {
      //  [ |=======> ,  >===|  ]
      return [boardLength - pos, -pos]
    } else if(length > 0) {
      if(pos > length) {
	throw ("Invalid cutBoard operation, board length: " + length + ", cutPos: " + pos);
      }

      lostPieces.push( pos );

      return [length - pos];
    } else {
      if(pos > -length) {
	throw ("Invalid cutBoard operation, board length: " + length + ", cutPos: " + pos);
      }

      lostPieces.push(-length - pos);

      return [pos];
    }
  }

  function layPiece(piece) {
    console.log("layPiece: " + piece);
    laidPieces[row].push(piece);
    pos += piece < 0 ? -piece : piece;
  }

  function alignPiece(length, align) {
    var cut = 0;
    var patternPos = 507 - (length % 507);
    if(patternPos === align) {
      length;
    } else if(patternPos < align) {
      cut = align - patternPos;
    } else {
      cut = (align + 507) - patternPos;
    }

    //cut = 0;

    return length - cut;
  }

  while(row < numRows) {
    pos = 0;

    console.log("----------------------------------------");
    console.log("lay row: " + row);


    laidPieces[row] = [];

    //roomWidth = 3000 - row*50;

    while(pos < roomWidth) {
      var piece;

      //
      //         | <patternPos
      //  0      |-----------------------> length
      //  |||=====|||=====|||=====|||=====   cut 5 to 4, l = 32. l % 8 = 0
      //  ====|||=====|||=====|||=====|||   cut 4 to 0, l = 31   l % 8 = 7
      //
      //

      var align = (row & 1) ? odd : even;

      if(pos === 0) {
	// align pattern with row
	piece = splitPieces.filter( p => {
	  if(p > 0) {
	    var cut = 0;
	    var patternPos = 507 - (p % 507);
	    if(patternPos < align) {
	      cut = align - patternPos;
	    } else {
	      cut = (align + 507) - patternPos;
	    }
	    if(p > cut) {
	      return true;
	    }
	  }
	  return false;
	})[0];

      } else {
	var minLength = roomWidth - pos;
	console.log("find piece with minLength: " + minLength);
	piece = splitPieces.filter( (p) => p < -minLength).sort( (a,b) => b - a)[0];
      }

      if(piece) {
	splitPieces.splice(splitPieces.indexOf(piece), 1);
      } else {
	piece = boardLength;
	console.log("use new board");
	usedBoards++;
      }

      var split;

      console.log("piece selected: %d, pos: %d, width: %d", piece, pos, roomWidth);

      if(pos === 0) {
	// align piece
	split = cutBoard(piece, getcutpos(piece, alignPiece(piece, align)));
	console.log("piece split: ", split);
	console.log("lay aligned piece: %d", split[0]);

	if(split[0] > roomWidth) {
	  console.log("split long piece: %d", split[0]);
	  split = cutBoard(split[0], (roomWidth - pos));
	  piece = split[1];
	} else {
	  piece = split[0];
	}

	layPiece(piece);

	//if(split[1]) { // full board, cut
	//  splitPieces.push(split[1]);
	//}
      } else if(pos + Math.abs(piece) > roomWidth) {
	console.log("cut long piece %d to: %d", piece, roomWidth - pos);

	split = cutBoard(piece, roomWidth - pos); //getcutpos(piece, roomWidth - pos));
	console.log("piece split: ", split);

	if(split[1]) { // full board, cut
	  layPiece(split[1]);
	  splitPieces.push(split[0]);
	} else {
	  layPiece(split[0]);
	}
      } else  {
	if(piece !== 2028) {
	  console.log("ERROR, mid piece not full pice");
	}
	layPiece(piece);
      }
    }
    row++;
  }

  return {
    laid: laidPieces,
    lost: lostPieces,
    split: splitPieces,
    boards: usedBoards,
    packs: usedBoards / 8,
    area: usedBoards * 2.028 * 0.192
  };
}


//var floor = fillFloor(2980, 3000);
//console.log("laid:\n", floor.laid);
//console.log("lost:\n", floor.lost);
//console.log("stash:\n", floor.split);
