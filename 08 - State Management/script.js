import Player from './player.js';
import InputHandler from './input.js';
import { drawStatusText } from './utils.js'


document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById("canvas1");
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');

    const loading = document.getElementById('loading');
          loading.style.display = 'none';
    
    const player = new Player(canvas.width, canvas.height);
    const input = new InputHandler();
    
    let lastTime = 0;
    function animate(timesStamp) {
        const deltaTime = timesStamp - lastTime;
        lastTime = timesStamp;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw(ctx, deltaTime);
        player.update(input.lastKey);
        drawStatusText(ctx, input, player);
        requestAnimationFrame(animate);
    }
    animate(0);

})