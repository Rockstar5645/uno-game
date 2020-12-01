
let q = []; 

module.exports = function add_user(user_id) {

    q.push(user_id); 

    if (q.length === 4) {
        let res = {
            status: 'ready', 
            players: q.slice()
        }
        q.length = 0; 
        return res; 
    } else {
        return {
            status: 'added'
        }
    }
}