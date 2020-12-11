// migration to create lobby_messages table
module.exports = async (db) => {
    try {
        await db
            .any(
                `CREATE TABLE lobby_messages (
                id SERIAL PRIMARY KEY, 
                message VARCHAR (500), 
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
                user_id INT REFERENCES users)
            `
            )
            .then(() => console.log("Created table lobby_messages"));
    } catch (e) {
        console.log("some sort of error in setting up lobby_messages table");
        console.log(e);
    }
};