class Ship extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["Images/playerShip.png"].texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(0.35);
        this.x = x;
        this.y = y;

    }
}

class Enemy extends PIXI.Sprite {
    constructor(radius, color= 0xFF0000, x=0, y=0, speed){
        super(app.loader.resources["Images/enemyShip.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.13);
        this.x = 1;
        this.y = 1;
        this.radius = radius;
        //variables
        this.fwd = getRandomUnitVector();
        this.speed = speed;
        this.isAlive = true;
    }

    rotationVector()
    {
        this.rotation = Math.atan2(this.fwd.x, -(this.fwd.y));
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
        this.rotationVector();
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}


class Bullet extends PIXI.Sprite {
    constructor(color= 0xFFFFFF, x=0, y=0){
        super(app.loader.resources["Images/cannonBall.png"].texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(0.15);
        this.x = x;
        this.y = y;
        this.fwd = {x:0, y:0};
        this.speed = 350;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt=1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }


}

class ExtraLife extends PIXI.Sprite {
    constructor(x=0, y=0) {
        super(app.loader.resources["Images/heart.png"].texture);
        this.scale.set(0.07);
        this.anchor.set(0.5,0.5);
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }
}