import {getCookie} from './util.js';

let socket = io(); 


socket.emit('game-board', {
    op: 'play-card', 
    card_id: 1 
}, (res) => {
    console.log(res); 
}); 


socket.on('card-played', {
    
})