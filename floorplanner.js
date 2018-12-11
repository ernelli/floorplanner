// pattern is
// 202 305 202 305 202 305 202 305 : 2028

'use strict';

function sprintf() {
    var args = arguments,
    string = args[0],
    i = 1;
    return string.replace(/%((%)|s|d)/g, function (m) {
        // m is the matched format, e.g. %s, %d
        var val = null;
        if (m[2]) {
            val = m[2];
        } else {
            val = args[i];
            // A switch statement so that the formatter can be extended. Default is %s
            switch (m) {
                case '%d':
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    break;
            }
            i++;
        }
        return val;
    });
}

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


var _console = console;

function fillFloor(roomWidth, roomLength) {

  var buffer = [];

  var console = {
    log: function(msg) {
      buffer.push(sprintf.apply(this, arguments));
      _console.log.apply(this, arguments);
    }
  }

  console.log("fillFloor %d, %d", roomWidth, roomLength);

  var numRows = (1 + roomLength / boardWidth) | 0;

  var pos, row = 0;

  var logs = [];
  var laidPieces = [];
  var splitPieces = [ 1580, 1580];
  var lostPieces = [];

  var usedBoards = 0;

  var even = 0;
  var odd = 254;  //202 + (305-202) / 2;

  function cutBoard(length, pos) {
    var lost;

    if(length % boardLength === 0) {
      //  [ |=======> ,  >===|  ]
      console.log("new board cut, left joinable piece: " + (-pos));
      return [boardLength - pos, -pos]
    } else if(length > 0) {
      if(pos > length) {
	throw ("Invalid cutBoard operation, board length: " + length + ", cutPos: " + pos);
      }

      lost = pos;

      lostPieces.push( lost - 3  );
      lostPieces.push( 3  );

      return [length - pos];
    } else {
      if(pos > -length) {
	throw ("Invalid cutBoard operation, board length: " + length + ", cutPos: " + pos);
      }

      lost = -length - pos;
      lostPieces.push( lost - 3);
      lostPieces.push( 3);

      return [pos];
    }
  }

  function layPiece(piece) {
    console.log("layPiece: " + piece);
    laidPieces[row].push(piece);
    logs.push(buffer.join("\n"));
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

  function lastPieceSize(firstPiece, roomWidth) {
    return roomWidth - boardLength*((roomWidth - firstPiece )/boardLength|0) - firstPiece;
  }

  var lastPieces = [];

  while(row < numRows) {
    pos = 0;

    buffer = [];
    console.log("----------------------------------------");
    console.log("lay row: " + row + ", pieces: " + splitPieces.join(","));


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

	console.log("first piece, find usable piece in stash: " + splitPieces.join(","));

	piece = splitPieces.filter( p => {
	  if(p > 0) {
	    var cut = 0;
	    var patternPos = 507 - (p % 507);
	    if(patternPos < align) {
	      cut = align - patternPos;
	    } else {
	      cut = (align + 507) - patternPos;
	    }

	    /*
	    if(cut < 500) {
	      return false;
	    }

	    if(lastPieceSize(cut, roomWidth) < 500) {
	      return false;
	    }
	    */

	    /*
	    while(cut < 500 || lastPieceSize(cut, roomWidth) < 500) {
	      if(cut < 500) {
		if(cut > lastPieceSize(cut, roomWidth)) {
		  cut += 507;
		}
	      }
 	    }
	    */

	    if(p > cut) {
	      return true;
	    }
	  }
	  return false;
	}).reduce( (a,p) => p > a ? p : a, 0); 

	console.log("Piece found: " + piece);

      } else {
	var minLength = roomWidth - pos;
	console.log("Middle or last, find piece with minLength: " + minLength + " in sequece: " + splitPieces.join(","));
	piece = splitPieces.filter( (p) => p < -minLength).sort( (a,b) => b - a)[0];
      }

      // constraint, do not start with shorter pieces than 500mm
      if(piece && piece < 500) {
	piece = 0;
      }

      // test force length to fit
      //if(row === 1 && pos === 0) {
      //piece = 1500;
      //}

      if(piece) {
	splitPieces.splice(splitPieces.indexOf(piece), 1);
      } else {
	piece = boardLength;
	console.log("use new board");
	usedBoards++;
      }

      if(pos == 0) {

	//                                              |
	// |------|---------------------|---------------|-----|

	var tmpPiece = piece  ? piece : 2028;


	var lastPiece = roomWidth - boardLength*((roomWidth - alignPiece(tmpPiece, align) )/boardLength|0) - alignPiece(tmpPiece, align);

	lastPieces[row] = lastPiece;

	if(lastPiece < 500) {

	}

      }

      var split;

      console.log("piece selected: %d, pos: %d, width: %d", piece, pos, roomWidth);

      if(pos === 0) {
	// align piece
	split = cutBoard(piece, getcutpos(piece, alignPiece(piece, align)));
	//console.log("piece split: ", split);
	//console.log("lay aligned piece: %d", split[0]);

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
	  lostPieces.push(3);
	  splitPieces.push(split[0] - 3);
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
    logs: logs,
    lost: lostPieces,
    split: splitPieces,
    lastPieces: lastPieces,
    boards: usedBoards,
    packs: usedBoards / 6,
    area: usedBoards * 2.028 * 0.192
  };
}


//var floor = fillFloor(2980, 3000);
//console.log("laid:\n", floor.laid);
//console.log("lost:\n", floor.lost);
//console.log("stash:\n", floor.split);
