class Gomoku {
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
    static direction = [
        [[-1, -1], [1, 1]],
        [[-1, 1], [1, -1]],
        [[0, 1], [0, -1]],
        [[1, 0], [-1, 0]]
    ];
	  static getStone(stone){
			if(stone == Gomoku.stone.black) return 'black';
			else if(stone == Gomoku.stone.white) return 'white';
			return 'empty';
		}

    constructor(){
				this.line = 15;
				this.nWin = 5;
        this.board = new Uint8Array(this.line ** 2);
        this.state = Gomoku.stateCode.ready;
        this.turn = Gomoku.stone.black;

        this.sectionElement = document.getElementById('gomoku');
        this.sectionElement.dataset.turn = this.turn;
        this.boardElement = document.getElementById('gomoku-board');
        const boardElementBody = document.createElement('tbody');
        this.boardElement.appendChild(boardElementBody);

        for(let i=0; i<this.line; i++){
            const row = document.createElement('tr');
            row.dataset.y = i;
						if(i == 0) row.classList.add('gomoku-top');
						else if(i == this.line-1) row.classList.add('gomoku-bottom');

            for(let j=0; j<this.line; j++){
                const cell = document.createElement('td');
                cell.classList.add('gomoku-cell');
							
								const stone = document.createElement('div');
								stone.dataset.x = j;
                stone.dataset.y = i;
								stone.classList.add('gomoku-stone');
								cell.appendChild(stone);

                if(i == Math.floor(this.line / 2) && j == Math.floor(this.line / 2))
                    cell.classList.add('gomoku-point');
								if(j == 0) cell.classList.add('gomoku-left');
								if(j == this.line-1) cell.classList.add('gomoku-right');
                row.appendChild(cell);
            }

            boardElementBody.appendChild(row);
        }

        this.boardElement.addEventListener('click', this.placeStone);
    }

    isOutOfRange(x, y){
        return (x < 0 || y < 0 || x >= Gomoku.line || y >= Gomoku.line);
    }
    get(x, y){
        if(this.isOutOfRange(x, y))
            return -1;
        return this.board[y*this.line + x];
    }
    set(e, x, y){
        if(this.state == Gomoku.stateCode.ready){ this.state = Gomoku.stateCode.running; }
        else if(this.state == Gomoku.stateCode.pause || this.state == Gomoku.stateCode.end){
            alert('Error: The game is paused. You can\'t place a stone.');
            return;
        }
        if(this.get(x, y) != Gomoku.stone.empty){
            alert('Error: Invalid board position. \nx: ' + x + ', y: ' + y + ', error: ' + this.get(x, y));
            return;
        }
        this.board[y*this.line + x] = this.turn;
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

            if(n == this.nWin){
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
				this.sectionElement.classList.add('end');
        const winnerName = winner === Gomoku.stone.black ? 'Black' : 'White';
        setTimeout(() => alert(`${winnerName} 승리!`), 10);
				this.boardElement.removeEventListener('click', this.placeStone);
        return winner;
    }
    placeStone = (e) => {
        if(!e.target.classList.contains('gomoku-stone') || 'stone' in e.target.dataset){
            return;
        }
        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        this.set(e.target, x, y);
    }
}

const gomoku = new Gomoku();