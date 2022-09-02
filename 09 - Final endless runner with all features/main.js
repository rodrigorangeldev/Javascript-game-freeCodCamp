import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById("canvas1");
          canvas.width = 900;
          canvas.height = 500;
    const ctx = canvas.getContext('2d');

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 0;
            this.maxSpeed = 6;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            this.maxParticles = 50;
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
            this.winningScore = 40;
            

        }
        update(deltaTime){

            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            //Handle enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            })
            //handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });

            //handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });

            if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }

            //handle collision sprite
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);                
            });

            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            //handle messages
            this.floatingMessages.forEach(message => {
                message.draw(context);
            })

            this.ui.draw(context);
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }
    
    const game = new Game(canvas.width, canvas.height);
    
    let lastTime = 0;
    function animate(timesStamp) {
        const deltaTime = timesStamp - lastTime;
        lastTime = timesStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.update(deltaTime);
        game.draw(ctx);

       if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);

})