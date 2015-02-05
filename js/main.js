EnemyTank = function (index, game, player) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 1;
    this.player = player;
  
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
   
   

 
    this.tank.anchor.set(0.5);

	

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 1000, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

      
        this.tank.kill();
      
	  

        return true;
    }

    return false;

}

EnemyTank.prototype.update = function() {

    



    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire )
        {
            this.nextFire = this.game.time.now + this.fireRate;

          

            

            
        }
    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('tank', 'assets/owner.png');
    game.load.image('enemy', 'assets/dogg.png');
  

    game.load.image('earth', 'assets/light_grass.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
	game.load.audio('kart', 'assets/kart.mp3');
    
}

var land;


var tank;


var enemies;

var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;



var currentSpeed = 0;
var cursors;


var fireRate = 100;
var nextFire = 0;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 4000, 4000);
	kart = game.add.audio('kart');
        kart.loop = true;
        kart.play();
    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    tank = game.add.sprite(0, 0, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(1000, 1000);
    tank.body.collideWorldBounds = true;

   

   

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal =10;
    enemiesAlive = 10;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank));
    }

   
    

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
   

 



    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

}



function update () {

    



    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            
           game.physics.arcade.overlap(tank, enemies[i].tank, playerHitDog, null, this);
           
            enemies[i].update();
        }
    }

    if (cursors.left.isDown)
    {
        tank.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        tank.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 300;
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;



    

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
    }

}


function playerHitDog (tank, enemies) {

enemiesAlive--;
enemies.alive=false;
enemies.kill();

}



function fire () {

    if (game.time.now > nextFire)
    {
        nextFire = game.time.now + fireRate;

        
    }

}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Dogs: ' + enemiesAlive + ' / ' + enemiesTotal, 300, 32);

}