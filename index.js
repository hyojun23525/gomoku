class Gomoku {
    static line = 15;
    static stone = Object.freeze({
        empty: 0,
        black: 1,
        white: 2
    });
    static stateCode = Object.freeze({
        ready: 0,
        running: 1,
        pause: 2,
        end: 3
    });
    static nWin = 5;
    static direction = [
        [[-1, -1], [1, 1]],
        [[-1, 1], [1, -1]],
        [[0, 1], [0, -1]],
        [[1, 0], [-1, 0]]
    ];

    constructor(){
        this.board = new Uint8Array(Gomoku.line ** 2);
        this.state = Gomoku.stateCode.ready;
        this.turn = Gomoku.stone.black;

        this.sectionElement = document.getElementById('gomoku');
        this.sectionElement.dataset.turn = this.turn;
        this.boardElement = document.getElementById('gomoku-board');
        const boardElementBody = document.createElement('tbody');
        this.boardElement.appendChild(boardElementBody);

        for(let i=0; i<Gomoku.line; i++){
            const row = document.createElement('tr');
            row.dataset.y = i;

            for(let j=0; j<Gomoku.line; j++){
                const cell = document.createElement('td');
                cell.dataset.x = j;
                cell.dataset.y = i;
                cell.classList.add('gomoku-cell');

                if(i == Math.floor(Gomoku.line / 2) && j == Math.floor(Gomoku.line / 2))
                    cell.classList.add('gomoku-position-point');
                row.appendChild(cell);
            }

            boardElementBody.appendChild(row);
        }

        boardElementBody.addEventListener('click', this.placeStone);
    }

    isOutOfRange(x, y){
        return (x < 0 || y < 0 || x >= Gomoku.line || y >= Gomoku.line);
    }
    get(x, y){
        if(this.isOutOfRange(x, y))
            return -1;
        return this.board[y*Gomoku.line + x];
    }
    set(e, x, y){
        if(this.state == Gomoku.stateCode.ready){ this.state = Gomoku.stateCode.running; }
        else if(this.state == Gomoku.stateCode.pause || this.state == Gomoku.stateCode.end){
            alert('Error: The game is paused. You can\'t place a stone.');
            return;
        }
        if(this.get(x, y) != Gomoku.stone.empty){
            alert('Error: Invalid board position. \nx: ' + x + ', y: ' + y);
            return;
        }
        this.board[y*Gomoku.line + x] = this.turn;
        e.dataset.stone = this.turn;

        for(let l of Gomoku.direction){
            let n = 1;
            for(let d of l){
                let curX = x;
                let curY = y;
                do{
                    curX += d[0];
                    curY += d[1];
                    if(this.get(curX, curY) != this.turn){ break; }
                    else{ n++; }
                }while(1);
            }

            if(n == Gomoku.nWin){
                this.state = Gomoku.stateCode.end;
                this.end(this.turn);
                return;
            }
        }
        this.turn ^= 3;
        this.sectionElement.dataset.turn = this.turn;
    }
    end(winner){
        this.state = Gomoku.stateCode.end;
        const winnerName = winner === Gomoku.stone.black ? 'Black' : 'White';
        setTimeout(() => alert(`${winnerName} 승리!`), 10);
        return winner;
    }
    placeStone = (e) => {
        if(!e.target.classList.contains('gomoku-cell') || 'stone' in e.target.dataset){
            return;
        }
        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        this.set(e.target, x, y);
    }
}

const gomoku = new Gomoku();