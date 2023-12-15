	// http://paulbourke.net/miscellaneous/interpolation/
	
	// we use this to interpolate the ship towards the mouse position
	function lerp(start, end, amt){
        return start * (1-amt) + amt * end;
  }
  
  // we use this to keep the ship on the screen
  function clamp(val, min, max){
      return val < min ? min : (val > max ? max : val);
  }
  
  // bounding box collision detection - it compares PIXI.Rectangles
  //adjusting for smaller bounfing boxes between player and enemies for more precise collisions
  function PlayerEnemyIntersect(a,b){
      var ab = a.getBounds();
      var bb = b.getBounds();
      return ab.x + ab.width * 0.4 > bb.x && ab.x < bb.x + bb.width *0.4 && ab.y + ab.height *0.4 > bb.y && ab.y < bb.y + bb.height * 0.4;
  }


  //for bullets and enemies to have smaller boxes to track hits
  function BulletEnemyIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width *0.4 > bb.x && ab.x < bb.x + bb.width *0.4  && ab.y + ab.height * 0.4 > bb.y && ab.y < bb.y + bb.height * 0.4;
}
  
  // these 2 helpers are used by classes.js
  function getRandomUnitVector(){
      let x = getRandom(-1,1);
      let y = getRandom(-1,1);
      let length = Math.sqrt(x*x + y*y);
      if(length == 0){ // very unlikely
          x=1; // point right
          y=0;
          length = 1;
      } else{
          x /= length;
          y /= length;
      }
  
      return {x:x, y:y};
  }

  function getRandom(min, max) {
      return Math.random() * (max - min) + min;
  }