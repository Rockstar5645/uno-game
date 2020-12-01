
module.exports = async (db) => {
    // order matters, careful when modifying this file. Children must be dropped first
    try {

        await db.none(`DROP TABLE IF EXISTS players`); // child of games and users
        console.log('dropped players table if it existed');

        await db.none(`DROP TABLE IF EXISTS game_deck`); // child of games
        console.log('dropped games_deck table if it existed');

        await db.none(`DROP TABLE IF EXISTS games`);
        console.log('dropped games table if it existed');

        await db.none(`DROP TABLE IF EXISTS deck`);
        console.log('dropped deck table if it existed');

        await db.none(`DROP TABLE IF EXISTS users`);
        console.log('dropped the users table if it existed');

    } catch (e) {
        console.log('some sort of error while cleaning up the tables');
        console.log(e);
    }
}