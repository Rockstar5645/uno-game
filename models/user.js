let db = require('../db'); 

class User {

    constructor(username, email) {

        this.username = username; 
        this.email = email; 
    }

    static async find_user(username) {
        try {

            let result = await db.oneOrNone(`SELECT * FROM users 
                                    WHERE username = $1`, username); 

            if (result == null) {
                return {
                    status: 'no_user'
                }; 
            } else {
                return {
                    status: 'success',
                    username: result.username, 
                    hash: result.password, 
                    email: result.email,
                    user_id: result.user_id
                }; 
            }

        } catch (e) {
            console.log('something went wrong when finding the user');
            console.log(e); 

            return {
                status: 'error',
                msg: 'database_error'
            }
        }
    }

    static async create(username, hash, email) {

        try {

            let result = await db.one(`INSERT INTO users(username, password, email) 
                    VALUES($1, $2, $3) RETURNING user_id`, [username, hash, email]); 

            return {
                status: 'success', 
                msg: 'user_created',
                user_id: result.user_id
            }; 

        } catch (e) {
            /*
            console.log('detail: ' + e.detail); 
            console.log('code: ' + e.code); 
            console.log('constraint: ' + e.constraint);  
            console.log('severity: ' + e.severity); 
            // console.log(e); 
            */

            if (e.code === '23505') {
                if (e.constraint === 'users_username_key') {
                    // there is a duplicate user in the username 
                    console.log('username already exists'); 
                    return {
                        status: 'username_error', 
                        msg: 'username_already_exists'
                    };
                }

                if (e.constraint === 'users_email_key') {
                    // there is a duplicate email address
                    console.log('email address already exists'); 
                    return {
                        status: 'email_error', 
                        msg: 'email_already_exists'
                    }; 
                }
            }

            // rethrow the error 
            throw new Error('Somethings wrong with the database');  
        }
    }
}

module.exports = User; 