
// migration to create user table 
module.exports = async (db) => {

    try {
        await db.none(`DROP TABLE IF EXISTS users`); 
        console.log('dropped the table if it existed'); 

        await db.any(`CREATE TABLE users (
                user_id SERIAL PRIMARY KEY, 
                username VARCHAR (50) UNIQUE NOT NULL, 
                password VARCHAR (60) NOT NULL, 
                email VARCHAR (255) UNIQUE NOT NULL)
            `);
        console.log('created user table'); 
        
    } catch (e) {
        console.log('some sort of error in setting up user table'); 
        console.log(e); 
    }
}