let gridArr = []
let cells
function drawGrid(gridArr, difficulty, rows,cols) {
	let grid = document.querySelector("#grid")
	grid.innerHTML = ""
	for (var i = 0; i < cols; i++) {
		grid.innerHTML += `<div class="col"></div>` 
		for (var j = 0; j < rows; j++) { 
				document.querySelector(`.col:nth-of-type(${i+1})`).innerHTML += `<div class="cell"><p></p></div>`
			// if (gridArr[i][j] == -1 ) {
			// 	document.querySelector(`.col:nth-of-type(${i+1})`).innerHTML += `<div class="cell"><p>&#10687</p></div>`
			// }
			// else if (gridArr[i][j] == 0) {
			// 	document.querySelector(`.col:nth-of-type(${i+1})`).innerHTML += `<div class="cell"><p></p></div>`
				
			// }
			// else{
			// 	colors = ["#2196f3","#9c27b0","#3f51b5","#4caf50","#ff3d00","#ab9900"]
			// 	document.querySelector(`.col:nth-of-type(${i+1})`).innerHTML += `<div class="cell" style="color:${colors[gridArr[i][j]-1]}"><p>${gridArr[i][j]}</p></div>`
			// }
		}
	}
	for (var i = 0; i < cols; i++) {
		let color
			if (i % 2 == 0) color = "#a7d948"
			else color = "#8ecc39"	
		let cells = document.querySelectorAll(".cell")
		for (var j = 0; j < rows; j++) {
			cells[i*rows + j].style.background = color 
			color = colorChange(color)
		}
	}

	document.querySelectorAll(".cell").forEach(function(item){
    item.style.width = 40/(difficulty+1)+10+"px"})
    document.querySelectorAll(".cell").forEach(function(item){
    item.style.height = 40/(difficulty+1)+10+"px"})

    

}
function newGame(difficulty){
	gridArr = []
	let numberOfMines,rows,cols
	if (difficulty == 0) 	  numberOfMines = 10, rows = 8,  cols = 10
	else if (difficulty == 1) numberOfMines = 40, rows = 14, cols = 18
	else 					  numberOfMines = 99, rows = 20, cols = 24
	drawGrid(difficulty,rows,cols)
	let mines = []
	let minesLocation = []
	for (let i = 0; i < numberOfMines; i++) {
		pos = rand(rows,cols)
		while(isInMines(pos,mines)){
			pos = rand(rows,cols)
		}
		mines.push(pos)
	}
	for (let i = 0; i < mines.length; i++) {
		pos = [0,0]
		pos[0] = Math.floor(mines[i]/rows)
		pos[1] = mines[i]%rows
		minesLocation.push(pos) 
	} 

	gridArr = assignValues(gridArr,minesLocation,rows,cols)

	drawGrid(gridArr, difficulty, rows, cols)

	   cells = document.querySelectorAll(".cell")

	for (let [i,each] of cells.entries()){

	each.addEventListener("mousedown",function(event) {
 		switch (event.which) {
        case 1:
        	uncover(gridArr, rows, cols,Math.floor(i/rows), i%rows ) 
            break
        case 3:
            alert("flag" + Math.floor(i/rows) +i%rows)
            break
    }
	}) 
}


}
 function colorChange(color) {
	if(color == "#a7d948" ) return "#8ecc39"
	return 	"#a7d948"
}
function isInMines(pos, mines) {
	for (var i = 0; i < mines.length; i++) if (pos == mines[i]) return true
	return false
}

function rand(rows,cols){ 
		 return  Math.floor(Math.random()*rows*cols)
}

newGame(1)
// sum = 0
// for (var i = 0; i < gridArr.length; i++) {
// 	for (var j = 0; j < gridArr[i].length; j++) {
// 		if (gridArr[i][j] == -1) {
// 			sum++
// 		}
// 	}
// }
// console.log(sum)

function assignValues(gridArr,minesLocation,rows,cols) {
	for (var i = 0; i < cols; i++) {
		gridArr[i] = []
		for (var j = 0; j < rows; j++) {
		gridArr[i][j] = 0
		}
	}
	for (var k = 0; k < minesLocation.length; k++) {
		let r = minesLocation[k][0]
		let c = minesLocation[k][1]
		gridArr[r][c] = -1
		
		for (var l = r-1; l <= r+1; l++) {
 			for (var m = c-1; m <= c+1; m++) {
			 	if (l>= 0 && l < cols && m>=0 && m < rows && gridArr[l][m] != -1) {
			 		gridArr[l][m] +=1
			 	}
			}
		}
	}
	return gridArr 	
}

