
// migration to create user table 
module.exports = async (db) => {

    try {
        // await db.none(`DROP TABLE IF EXISTS game_deck`);
        // console.log('dropped game_deck table if it existed');

        // location should have a default of draw_stack
        await db.any(`CREATE TABLE game_deck (
            id SERIAL PRIMARY KEY, 
            game_id INT references games (id),
            name VARCHAR (10) NOT NULL, 
            color VARCHAR (10) NOT NULL, 
            location VARCHAR(20) NOT NULL,
            "order" INT NOT NULL
            )`);
        console.log('created game_deck table');

    } catch (e) {
        console.log('some sort of error in setting up game_deck table');
        console.log(e);
    }
}