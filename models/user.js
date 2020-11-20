let db = require('../db'); 
const bcrypt = require('bcrypt');
const saltRounds = 12;

class User {

    constructor(username, password, email) {

    }

    static async createPassword(password) {
        const myPlaintextPassword = password;
        
        console.log(myPlaintextPassword); 

        let hash = await bcrypt.hash(myPlaintextPassword, saltRounds)
    
        return hash;
    }

    static async create(username, password, confirmPassword, email) {
     
        let res = {};

        if (password !== confirmPassword) {
            res.status = 'password_error';
            res.msg = 'password_mismatch'; 
            return res; 
        }

        if (username.length == 0) {
            res.status = 'username_error';
            res.msg = 'empty_username'; 
            return res; 
        }

        if (username.length > 50) {
            res.status = 'username_error';
            res.msg = 'username_too_long';
            return res; 
        }

        if (password.length == 0) {
            res.status = 'password_error';
            res.msg = 'empty_password';
            return res; 
        }

        if (password.length > 50) {
            res.status = 'password_error';
            res.msg = 'password_too_long';
            return res; 
        }

        email = email.toLowerCase(); 

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email)) || email.length == 0 || email.length > 255) {
            res.status = 'email_error'; 
            res.msg = 'invalid_email'; 
            return res;    
        }
    
        try {

            let hash = await User.createPassword(password); 

            let result = await db.one(`INSERT INTO users(username, password, email) 
                    VALUES($1, $2, $3) RETURNING user_id`, [username, hash, email]); 

            console.log(result); 

            return {
                status: 'success', 
                msg: 'user_created'
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