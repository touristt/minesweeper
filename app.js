let gridArr = []
function drawGrid(difficulty, rows,cols) {
	let grid = document.querySelector("#grid")
	grid.innerHTML = ""
	for (var i = 0; i < cols; i++) {
		grid.innerHTML += `<div class="col"></div>`
		gridArr[i] = []
		for (var j = 0; j < rows; j++) {
			gridArr[i][j] = 0
			document.querySelector(`.col:nth-of-type(${i+1})`).innerHTML += `<div class="cell"><p></p></div>`
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
	for (var i = 0; i < numberOfMines; i++) {
		pos = rand(rows,cols)
		console.log(i,pos,isInMines(pos,mines)) 
		while(isInMines(pos,mines)){
			pos = rand(rows,cols)
			console.log(i,pos,isInMines(pos,mines)) 
		}
		mines.push(pos)
	}
	for (var i = 0; i < mines.length; i++) {
		pos = [0,0]
		pos[0] = Math.floor(mines[i]/rows)
		pos[1] = mines[i]%rows
		gridArr[pos[0]][pos[1]] = -1
	}
}
function colorChange(color) {
	if(color == "#a7d948" ) return "#8ecc39"
	return 	"#a7d948"
}
function isInMines(pos, mines) {
	for (var i = 0; i < mines.length; i++) {
		if (pos == mines[i]) return true		
	}
	return false
}

function rand(rows,cols) {
	return  Math.floor(Math.random()*rows*cols)
}
newGame(1)
sum = 0
for (var i = 0; i < gridArr.length; i++) {
	for (var j = 0; j < gridArr[i].length; j++) {
		if (gridArr[i][j] == -1) {
			sum++
		}
	}
}
console.log(sum)