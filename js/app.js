
// Step related
var init_x = 0;
var init_y = 50.5;
var step_x = 101;
var step_y = 85.5;
var board_x = 505;
var board_y = 606;
var top_limit = init_y - step_y;
var bottom_limit = init_y + step_y * 4;
var delta = init_y;

// Enemies our player must avoid
var Enemy = function(level) {
    init_enemy_position(this);
    this.speed = level;
    this.sprite = 'images/enemy-bug.png';
};

var init_enemy_position = function(enemy) {
    rand_seed = Math.round(Math.random() * 3 - 0.5);
    console.log(rand_seed);
    enemy.x = init_x;
    enemy.y = init_y + step_y * rand_seed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x >= board_x) {
        init_enemy_position(this);
    }
    this.x += this.speed * step_x * dt;
    checkCollision(this);
};

var checkCollision = function(anEnemy) {
    if (Math.abs(game.player.x - anEnemy.x) < delta && Math.abs(game.player.y - anEnemy.y) < delta) {
        console.log('collided');
        init_player_position(game.player);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var init_player_position = function(player) {
    player.x = init_x + step_x * 2;
    player.y = bottom_limit;
};

var Player = function() {
    init_player_position(this);

    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    if (this.y < top_limit) {
        init_player_position(this);
        game.level += 1;
        create_new_enemy(game.level);
    }
    if (this.y >= bottom_limit) {
        this.y = bottom_limit;
    }
    if (this.x <= init_x) {
        this.x = init_x;
    }
    if (this.x >= board_x) {
        this.x = step_x * 4;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key_press) {
    switch(key_press) {
        case 'left':
            this.x -= step_x;
            break;
        case 'right':
            this.x += step_x;
            break;
        case 'up':
            this.y -= step_y;
            break;
        case 'down':
            this.y += step_y;
            break;
        default:
            ;
    }
    //console.log(this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var Game = function() {
  this.allEnemies = [];
  this.player = new Player;
  this.level = 1;
};

Game.prototype.run = function() {
  create_new_enemy(this.level);
};

var create_new_enemy = function(level) {
  game.allEnemies.push(new Enemy(level));
}

var game = new Game;
game.run();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});
