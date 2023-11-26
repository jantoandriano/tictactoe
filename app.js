const gameContainer = document.getElementById("game-container");
const inputContainer = document.getElementById("input-container");
const board = document.getElementById("board");
const restartButton = document.getElementById('button-start'); 

let boardSize = 3;
let winningConditions = winningConditionsGen();

let currentPlayer = "X";
let gameBoard = Array.from({ length: boardSize * boardSize }, () => "");
let gameActive = true;

document.addEventListener('DOMContentLoaded', function () {
    resetGame(3); // Set the default board size to 3 when the page loads
});

function changeGridSize(size) {
    resetGame(size);
}

function resetGame(size) {
    currentPlayer = 'X';
    boardSize = size;
    winningConditions = winningConditionsGen();
    gameBoard = Array.from({ length: boardSize * boardSize }, () => '');
    gameActive = true;
    renderBoard();
}

function checkWinner() {
  for (const combination of winningConditions) {
    const [a, b, c] = combination;
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      return gameBoard[a];
    }
  }
  return null;
}

function checkTie() {
  return !gameBoard.includes("");
}

function handleCellClick(index) {
  if (!gameActive || gameBoard[index] !== "") {
    return;
  }

  gameBoard[index] = currentPlayer;
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    alert(`${winner} wins!`);
    gameActive = false;
  } else if (checkTie()) {
    alert("It's a tie!");
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function renderBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;

  gameBoard.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell"); 
    if (value === "X") {
      cell.classList.add("playerX");
    } else if (value === "O") {
      cell.classList.add("playerO");
    }

    cell.textContent = value;
    cell.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cell);
  });
}

function winningConditionsGen() {
    const totalSquares = boardSize * boardSize;
    const numOfArr = boardSize * 2;
    const wArr = new Array(numOfArr);
    let diagStrk1 = '';
    let diagStrk2 = '';

    for (let j = 0; j < boardSize; j++) {
        let horiStrk = '';
        let vertiStrk = '';
        for (let i = 0; i < totalSquares; i++) {
            if (i / boardSize === j) {
                horiStrk += i + ',';
                for (let k = 1; k < boardSize; k++) {
                    horiStrk += i + k + ',';
                }
            }
            if (i % boardSize === j) {
                vertiStrk += i + ',';
            }
        }
        horiStrk = horiStrk.slice(0, -1);
        vertiStrk = vertiStrk.slice(0, -1);
        const h = horiStrk.split(',');
        const v = vertiStrk.split(',');

        wArr[j] = v;
        wArr[j + boardSize] = h;
        diagStrk1 += j * (boardSize + 1) + ',';
        diagStrk2 += (j + 1) * (boardSize - 1) + ',';
    }

    diagStrk1 = diagStrk1.slice(0, -1).split(',');
    wArr.push(diagStrk1);

    diagStrk2 = diagStrk2.slice(0, -1).split(',');
    wArr.push(diagStrk2);
    
    return wArr;
}

// Add input field for changing the grid size dynamically
const gridSizeInput = document.createElement("input");
gridSizeInput.type = "number";
gridSizeInput.placeholder = "Enter Grid Size";
gridSizeInput.className = 'input';
gridSizeInput.addEventListener("change", (event) =>
  changeGridSize(parseInt(event.target.value))
);
inputContainer.appendChild(gridSizeInput);

// Add restart button
restartButton.addEventListener('click', () => resetGame(boardSize));
restartButton.textContent = 'Restart Game';
inputContainer.appendChild(restartButton);

renderBoard();
