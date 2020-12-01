
// migration to create user table 
module.exports = async (db) => {

    try {

        await db.any(`
                CREATE TABLE deck (
                id SERIAL PRIMARY KEY, 
                name VARCHAR (10) NOT NULL, 
                color VARCHAR (10) NOT NULL, 
                action INT NOT NULL)
            `);
        console.log('created deck table');

    } catch (e) {
        console.log('some sort of error in setting up user table');
        console.log(e);
    }
}