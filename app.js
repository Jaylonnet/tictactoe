const gameWrapper = document.querySelector(".game-board");

function createPlayer (letter) {
    const getLetter = () => letter;
    return {getLetter};
};

const Gameboard = function() {
    const emptyBoard = ['', '', '', '', '', '', '', '', ''];
    let board = [...emptyBoard]

    const markBoard = function(index, letter) {
        board[index] = letter;
    };

    const getBoard = () => board;

    const resetBoard = () => { board = [...emptyBoard] }

    return {getBoard, markBoard, resetBoard};
};

const GameController = function() {
    const playerOne = createPlayer("X");
    const playerTwo = createPlayer("O");
    const players = [playerOne, playerTwo];

    const board = Gameboard();

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayer = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkValidMove = function (index) {
        if (board.getBoard()[index] == '' && index < 9) {
            return true;
        } else {
            return false;
        }
    };

    const checkForWin = function() {
        let winner = null;
        const b = board.getBoard();
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],

            [0,3,6],
            [1,4,7],
            [2,5,8],
            
            [0,4,8],
            [2,4,6]
        ];
        winConditions.forEach((condition) => {
            if (b[condition[0]] == b[condition[1]] && b[condition[1]] == b[condition[2]] && b[condition[1]] == activePlayer.getLetter()) {
                winner = activePlayer;
            };
        });
        return winner;
    };

    const playRound = function (index) {
        if (checkValidMove(index)) {
            board.markBoard(index, activePlayer.getLetter());
            if (checkForWin()) {
            };
            switchPlayer();
            ScreenController.updateScreen();
        } else {
            return;
        };
    };

    const resetGame = () => {
        board.resetBoard();
        ScreenController.updateScreen();
    }

    return {playRound, getActivePlayer, getBoard: board.getBoard, resetGame}
};

const ScreenController = (() => {
    const boardDiv = document.querySelector(".game-board");
    const playerInfoP = document.querySelector(".player-info");
    const resetBtn = document.querySelector(".reset-game");
    const game = GameController();

    const updateScreen = () => {
        boardDiv.textContent = '';
        playerInfoP.textContent = '';

        const board = game.getBoard();

        let index = 0;
        board.forEach((cell) => {
            const cellBtn = document.createElement("button");
            cellBtn.classList.add("cell");
            cellBtn.textContent = cell;
            cellBtn.dataset.index = index;
            boardDiv.appendChild(cellBtn);
            cellBtn.addEventListener(("click"), (e) => {
                game.playRound(cellBtn.dataset.index);
            });
            index++;
        });
        playerInfoP.textContent = `Current Player: ${game.getActivePlayer().getLetter()}`;
    };

    resetBtn.addEventListener(("click"), () => {
        game.resetGame();
    })

    updateScreen();

    return {updateScreen};
})();