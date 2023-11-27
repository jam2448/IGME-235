const lifeWorld = {

    init(numCols,numRows){
        this.numCols = numCols,
        this.numRows = numRows,
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();

    },

    buildArray(){
        let outerArray = [];
        for(let row= 0; row < this.numRows; row++){
            let innerArray = [];
            for(let col = 0; col < this.numCols; col++){
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup(){
        for(let row = 0; row < this.numRows; row++){
            for(let col = 0; col < this.numCols; col++){
                this.world[row][col] = 0;
                if(Math.random() < .1) {
                    this.world[row][col] = 1;
                }
            }

        }
    },


        getLivingNeighbors(row, col) {
            // Check if row and col are within valid bounds
            if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
              return 0;
            }
        
            // Define the eight possible neighbor positions (N, NE, E, SE, S, SW, W, NW)
            const neighbors = [
              [-1, 0], [-1, 1], [0, 1], [1, 1],
              [1, 0], [1, -1], [0, -1], [-1, -1]
            ];
        
            // Initialize a count for living neighbors
            let livingNeighbors = 0;
        
            // Iterate through the neighbor positions
            for (const [dx, dy] of neighbors) {
              const newRow = row + dx;
              const newCol = col + dy;
        
              // Check if the neighbor is within valid bounds and alive
              if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                livingNeighbors += this.world[newRow][newCol];
              }
            }
        
            return livingNeighbors;
        },       

    step(){

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
              const livingNeighbors = this.getLivingNeighbors(row, col);
      
              // Apply Conway's Game of Life rules to determine the cell's fate
              if (this.world[row][col] === 1) {
                if (livingNeighbors < 2 || livingNeighbors > 3) {
                  this.worldBuffer[row][col] = 0; // Cell dies due to underpopulation or overpopulation
                } else {
                  this.worldBuffer[row][col] = 1; // Cell survives
                }
              } else {
                if (livingNeighbors === 3) {
                  this.worldBuffer[row][col] = 1; // Cell is born
                } else {
                  this.worldBuffer[row][col] = 0; // Cell remains dead
                }
              }
            }
        }
      
        //swapping .world and .worldBuffer
        const temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp;

        this.randomSetup();
    }
}