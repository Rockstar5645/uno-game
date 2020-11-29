
// migration to create user table 
module.exports = async (db) => {

    try {
        // await db.none(`DROP TABLE IF EXISTS players`);
        // console.log('dropped players table if it existed');

        await db.any(`CREATE TABLE players (
                id SERIAL PRIMARY KEY, 
                game_id INT references games (id),
                user_a_id INT references users (user_id),
                user_b_id INT references users (user_id),
                user_c_id INT references users (user_id),
                user_d_id INT references users (user_id)
                )
            `);
        console.log('created players table');

    } catch (e) {
        console.log('some sort of error in setting up players table');
        console.log(e);
    }
}