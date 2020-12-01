
// migration to create user table 
module.exports = async (db) => {

    try {
        await db.any(`CREATE TABLE players (
                id SERIAL PRIMARY KEY, 
                game_id INT references games (id) NOT NULL,
                user_id INT references users (user_id) NOT NULL,
                uno_status VARCHAR(20)
                )
            `);
        console.log('created players table');

    } catch (e) {
        console.log('some sort of error in setting up players table');
        console.log(e);
    }
}