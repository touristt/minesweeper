let gridArr = [],
	cells,
	flags = 0 ,
	isGameOver = true,
	totalFlags,
	isFirstMove,
	timerId

let stats = {
	best :{},
	last:[]
}


function newGame(difficulty){
	clearInterval(timerId)
	document.querySelector("#timeCount").innerText = "000"
	isGameOver = false
	isFirstMove = true
	gridArr = []
	flags = 0 
	let numberOfMines,rows,cols 

	if (difficulty == 0) 	   numberOfMines = 10, rows = 8,  cols = 10
	else if (difficulty == 1)  numberOfMines = 40, rows = 14, cols = 18
	else 					   numberOfMines = 99, rows = 20, cols = 24
	document.querySelector("#flagCount").innerText = numberOfMines
	totalFlags = numberOfMines
	let mines = [], minesLocation = []
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
        	if(isFirstMove)   startTimer(1)
        	if (!isGameOver)  uncover(gridArr, rows, cols,Math.floor(i/rows), i%rows, mines ) 
            break
    	}
	}) 
	each.addEventListener("contextmenu",function(event) {
		 event.preventDefault()
		 if (!isGameOver) addFlag(gridArr, rows, cols,Math.floor(i/rows), i%rows) 
	})
}


}

function drawGrid(gridArr, difficulty, rows,cols) {
	let grid = document.querySelector("#grid")
	grid.innerHTML = ""
	for (var i = 0; i < cols; i++) {
		grid.innerHTML += `<div class="col"></div>` 
		for (var j = 0; j < rows; j++) { 
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
    item.style.width = (40/(Number(difficulty)+1))+10+"px"})
    document.querySelectorAll(".cell").forEach(function(item){
    item.style.height = (40/(Number(difficulty)+1))+10+"px"})
    document.querySelector("#info").style.width= (40/(Number(difficulty)+1)+10)*cols+"px"
    document.querySelector(".statsHeader").style.width= (40/(Number(difficulty)+1)+10)*cols+"px"
    document.querySelector("#stats").style.width= (40/(Number(difficulty)+1)+10)*cols+"px"
    document.querySelector("#stats").style.width= (40/(Number(difficulty)+1)+10)*cols+"px"
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

function uncover(gridArr,rows,cols,x,y, mines) {
	colors = ["#2196f3","#9c27b0","#3f51b5","#4caf50","#ff3d00","#ab9900","#ff4584","#2e8cff"]
	let queue = []
	if (gridArr[x][y] == 0) {
		
		gridArr[x][y] = -2
		cells[x*rows + y].style.background = "#d7b899"  
		queue.push([x,y])
	}
	else if (gridArr[x][y] !== 0 && gridArr[x][y] != -1  && gridArr[x][y] != -2){
		cells[x*rows + y].innerHTML = `<p style="color:${colors[gridArr[x][y]-1]}">${gridArr[x][y]}</p>`
 		cells[x*rows + y].style.background = "#e5c29f"

	}
	else if(gridArr[x][y] == -1 && gridArr[x][y] != -2){
		isGameOver = true
		let time =  Number(document.querySelector("#timeCount").innerText)
			clearInterval(timerId)
			let temp = [10,40,99].indexOf(mines.length)
			stats.last.push({result : "lost", time: time, difficulty: temp})
			
			document.querySelector(".lostTime").innerText = time+" seconds"
			if (stats.best[temp])  document.querySelector(".bestTimeLost").innerText = stats.best[temp]+" seconds"
			document.querySelector("#lost").style.display = "block"
		cells[x*rows + y].innerHTML = `<p style="color:${colors[Math.floor(Math.random()*colors.length)]}"><i class="fas fa-bomb"></i></p>` //&#10687
		cells[x*rows + y].style.background = "#d7b899"
		showAll(mines, cells)
		setStats()
	}

	while(queue.length){
		currentCell = queue.shift()
		for (var a = currentCell[0]-1; a <= currentCell[0]+1; a++) {
		 	for (var b = currentCell[1]-1; b <= currentCell[1]+1; b++) {
		 		if (a>= 0 && a < cols && b>=0 && b < rows && gridArr[a][b] == 0) {
		 			
			 		gridArr[a][b] = -2 
			 		cells[a*rows + b].style.background = "#d7b899" 
			 		cells[a*rows + b].innerHTML = "<p></p>" 
			 		queue.push([a,b])
			 	}
			 	if (a>= 0 && a < cols && b>=0 && b < rows && gridArr[a][b] != 0 && gridArr[a][b] != -1  && gridArr[a][b] != -2) {
			 		 
			 		cells[a*rows + b].style.background = "#e5c29f"
			 		cells[a*rows + b].innerHTML = `<p style="color:${colors[gridArr[a][b]-1]}">${gridArr[a][b]}</p>`
			 	}
		 	}
		}
	}	
	refreshFlags()
	checkWin(cells,mines)
	return gridArr
}


function showAll(mines, cells) {
		let i = 0, iterations = mines.length;
		(function f (){
    	 cells[mines[i]].innerHTML = `<p style="color:${colors[Math.floor(Math.random()*colors.length)]}"><i class="fas fa-bomb"></i></p>` //&#10687
	 	 cells[mines[i]].style.background = "#d7b899" 
   		 i++
    	if( i < iterations ) setTimeout( f, 2000/mines.length);
		})()
}


function addFlag(gridArr,rows,cols,x,y) {
	if (cells[x*rows + y].innerHTML == `<p style="color:#e91e63"><i class="fas fa-flag"></i></p>`) {
		cells[x*rows + y].innerHTML = "<p></p>"
		refreshFlags()
	}
	else if (gridArr[x][y] != -2 && cells[x*rows + y].style.background !="rgb(229, 194, 159)" ) {
	 	cells[x*rows + y].innerHTML = `<p style="color:#e91e63"><i class="fas fa-flag"></i></p>`
	 	refreshFlags()
	 }  	
}


function checkWin(cells,mines) {
		count = 0;
		for (var i = 0; i < cells.length; i++) {
			if(cells[i].style.background == "rgb(142, 204, 57)" || cells[i].style.background == "rgb(167, 217, 72)" ){
 			count++
 			}		
		}
		if (count == mines.length) {
			isGameOver = true
			let time =  Number(document.querySelector("#timeCount").innerText)
			clearInterval(timerId)
			let temp = [10,40,99].indexOf(mines.length)
			stats.last.push({result : "won", time: time, difficulty: temp})
			
			if (temp in stats.best) {
				if(stats.best[temp] > time )  stats.best[temp] = time 
			}
			else{
				 stats.best[temp] = time
			}
			document.querySelector(".wonTime").innerText = time+" seconds"
			document.querySelector(".bestTimeWon").innerText = stats.best[temp]+" seconds"
			document.querySelector("#won").style.display = "block"
			setStats()
		}
		console.log(count)
 			
		
}

function refreshFlags() {
	flags = document.querySelectorAll(".cell > p[style='color:#e91e63']").length
	document.querySelector("#flagCount").innerText = totalFlags - flags
}


function startTimer(sec) {
	isFirstMove = false
 	timerId =  setInterval(function(){
 			if(sec<10) text = "00"+sec
 			if(sec<100 && sec > 9) text = "0"+sec
 			if(sec > 99) text = sec
           document.querySelector("#timeCount").innerText =text
           sec++;
       
   } , 1000) 

} 

document.querySelectorAll(".playAgain").forEach(function(item) {
	item.addEventListener("click",function() {
	document.querySelector("#won").style.display = "none"
	document.querySelector("#lost").style.display = "none"
	newGame(document.querySelector("#difficulty").value)
})
})

function setStats() {
	document.querySelector("#overall").innerHTML = ""
	document.querySelector("#recent").innerHTML = ""
	setOverallStats()
	setRecentStats()
}
function setOverallStats() {
		let eb,mb,hb
	if ("0" in stats.best) { eb = stats.best["0"]}
		else eb = "-"
	if ("1" in stats.best) { mb = stats.best["1"]}
		else mb = "-"
	if ("2" in stats.best) { hb = stats.best["2"]}
		else hb = "-"
	let ed = getOverallData(0)		
	let md = getOverallData(1)		
	let hd = getOverallData(2)
	document.querySelector("#overall").innerHTML = `
		<table>
								<thead>
									<th></th>
									<th>Best</th>
									<th>Won</th>
									<th>Lost</th>
									<th>Won%</th>
								</thead>
								<tbody>
								
									<tr>
										<th>Easy</th>
										<td>${eb} sec</td>
										<td>${ed[0]}</td>
										<td>${ed[1]}</td>
										<td>${ed[2]}%</td>
									</tr>
									<tr>
										<th>Medium</th>
										<td>${mb} sec</td>
										<td>${md[0]}</td>
										<td>${md[1]}</td>
										<td>${md[2]}%</td>
									</tr>
									<tr>
										<th>Hard</th>
										<td>${hb} sec</td>
										<td>${hd[0]}</td>
										<td>${hd[1]}</td>
										<td>${hd[2]}%</td>
									</tr>
								</tbody>
							</table>
	 `		

}

function getOverallData(difficulty) {
	let wins = 0, losses = 0
	for (var i = 0; i < stats.last.length; i++) {
		if (stats.last[i].difficulty == +difficulty) {
			if(stats.last[i].result == "won") wins++	
			else losses++	
		}}
	if ((wins+losses) == 0) {
		return [0,0,"-"]
	}
	else{
		return [wins,losses,parseFloat((wins*100)/(wins+losses)).toFixed(2)]
	}			
}

function setRecentStats(){
	document.querySelector("#recent").innerHTML = `
								<table>
									<thead>
										<th>S. No.</th>
										<th>Difficulty</th>
										<th>Result</th>
										<th>Time</th>
									</thead>
									<tbody>
										
									</tbody>
								</table>
						 `
	let diffs = ["Easy" , "Medium" , "Hard"]					 
	for (var i = stats.last.length; i >= 1; i--) {
		document.querySelector("#recent tbody").innerHTML += `
										<tr>
											<td>${i}</td>
											<td>${diffs[stats.last[i-1].difficulty]}</td>
											<td>${stats.last[i-1].result}</td>
											<td>${stats.last[i-1].time}</td>
										</tr>
		 						` 
	}					 
}

newGame(0)
setStats()