
// migration to create user table 
module.exports = async (db) => {

    try {

        await db.any(`CREATE TABLE games (
            id SERIAL PRIMARY KEY, 
            created_at DATE,
            timer INT,
            player_turn VARCHAR(1),
            turn_direction VARCHAR(1),
            current_card INT,
            current_color VARCHAR (10),
            top_card INT,
            turn_timer INT,
            status VARCHAR(20), 
            prev_player VARCHAR(1) DEFAULT 'M'
        )`);

        console.log('created games table');

    } catch (e) {
        console.log('some sort of error in setting up games table');
        console.log(e);
    }
}