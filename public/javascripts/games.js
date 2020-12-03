import {getCookie} from './util.js';

let socket = io(); 

socket.emit('game-board', {
    user_id: getCookie('user_id')
}); 