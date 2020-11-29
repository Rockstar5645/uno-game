
// migration to create user table 
module.exports = async (db) => {

    try {
        // await db.none(`DROP TABLE IF EXISTS games`);
        // console.log('dropped games table if it existed');

        await db.any(`CREATE TABLE games (
            id SERIAL PRIMARY KEY, 
            card_order INT,
            timer INT,
            player_turn VARCHAR(1),
            turn_direction VARCHAR(3),
            current_card VARCHAR(10),
            turn_timer INT,
            status VARCHAR(10),
            p_a_uno_stat VARCHAR(20),
            p_b_uno_stat VARCHAR(20),
            p_c_uno_stat VARCHAR(20),
            p_d_uno_stat VARCHAR(20)
        )`);
        console.log('created games table');

    } catch (e) {
        console.log('some sort of error in setting up games table');
        console.log(e);
    }
}