let winCases =[ [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 4, 8],
                [6, 4, 2],
                [2, 5, 8],
                [1, 4, 7],
                [0, 3, 6] ];
let humanPlayer = "X";
let aiPlayer = "O";
let currentState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let restart = document.querySelector(".restart");
let cells = document.querySelectorAll(".cell");
let winner =  document.querySelector(".winner");
let winText = document.querySelector(".win-txt");

restart.addEventListener("click",()=>{
    currentState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    cells.forEach(cell=>{
        cell.innerText = "";
        cell.style.backgroundColor = `rgb(36,178,230)`;
        winner.style.display = "none";
    });
})

cells.forEach(cell=>cell.addEventListener("click",cellClick));

function cellClick(event){
    if(typeof currentState[event.target.id] == "number"){
        event.target.innerText = humanPlayer;
        currentState[event.target.id] = humanPlayer;
        
        
            
            if(getEmptyCells().length != 0){

                let bestStateIndex = minmax(aiPlayer,currentState).index;
                document.getElementById(currentState[bestStateIndex]).innerText = aiPlayer;
                currentState[bestStateIndex] = aiPlayer;
                let winCase = isWin(aiPlayer,currentState);
                if(winCase > -1 ){
                    displayWinner(winCase, aiPlayer);
                }
            }else {
                winText.innerText = `No  Winner`;
                winner.style.display = "flex";
            }
            
        
    }
    
}
function isWin(player,node){
    let playerCells = node.reduce((prv,cell,index)=>{
        //collecting the cells that the player(ai,humen) had played in
            return cell == player?  prv.concat(index): prv}
            ,[])

    for([winCaseIndex,winCase] of winCases.entries()){
        if(winCase.every(cell=>playerCells.indexOf(cell) > -1)){//if all a win case exist in it 
            winCaseIndex;
            return winCaseIndex;
        }
    }
    return -1;
}
function displayWinner(winCase,player){
    
        winCases[winCase].forEach(cell => document.getElementById(cell).style.backgroundColor ="green");
        winText.innerText = `${player} Win`;
        winner.style.display = "flex";
    
}
function getEmptyCells(){
    return currentState.filter(cell=> typeof cell == "number");
}
function minmax(player,newState){
    let emptyCells = getEmptyCells();

    if(isWin(aiPlayer,newState)> -1){return {cost: 10};}
    else if(isWin(humanPlayer,newState)> -1){return {cost: -10};}
    else if(emptyCells.length === 0){return {cost:0};}

    let nodes =[]
    emptyCells.forEach((cell)=>{
        let node = {};
        node.index = newState[cell];//save the position so we can back to it
        newState[cell] = player;
        
        if(player == aiPlayer){
            let result = minmax(humanPlayer,newState);
            node.cost =result.cost;
        }
        else {
            let result = minmax(aiPlayer,newState);
            node.cost = result.cost;
        }

        newState[cell] = node.index; //reset the position 

        nodes.push(node);

        
    })
    let bestStateIndex ,bestCost;
    if(player === aiPlayer){
        //get the largest cost
        bestCost = -100000;
        nodes.forEach((state,index)=>{
            if(state.cost > bestCost){
                bestCost = state.cost;
                bestStateIndex = index;
            }
        })
    }else {

        bestCost = 100000;
        nodes.forEach((state,index)=>{
            if(state.cost < bestCost){
                bestCost = state.cost;
                bestStateIndex = index;
            }
        })
    }

    return nodes[bestStateIndex]
}