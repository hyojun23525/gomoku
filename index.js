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
    }
    isOutOfRange(x, y){
        return (x < 0 || y < 0 || x >= Gomoku.line || y >= Gomoku.line);
    }
    get(x, y){
        if(this.isOutOfRange(x, y))
            return -1;
        return this.board[y*Gomoku.line + x];
    }
    set(x, y){
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
    }
    end(winner){
        this.state = Gomoku.stateCode.end;
        return winner;
    }
}