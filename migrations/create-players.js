
// migration to create user table 
module.exports = async (db) => {

    try {
        await db.any(`CREATE TABLE players(
                id SERIAL PRIMARY KEY, 
                game_id INT NOT NULL references games (id) ON DELETE CASCADE,
                user_id INT NOT NULL references users (user_id) ON DELETE CASCADE,
                uno_status VARCHAR(20) DEFAULT 'unavailable',
                player_tag VARCHAR(1), 
                draw_count INT DEFAULT 0
                )
            `);
        console.log('created players table');

    } catch (e) {
        console.log('some sort of error in setting up players table');
        console.log(e);
    }
}