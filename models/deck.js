let db = require('../db');

class Deck {
    
    static async insert_card(name, color, action) {

        console.log(`Inserting card ${name} with color ${color} into deck`); 
        await db.one(`INSERT INTO deck(name, color, action) 
                        VALUES($1, $2, $3) RETURNING id`,
                    [name, color, action]);
    }
}; 

module.exports = Deck; 