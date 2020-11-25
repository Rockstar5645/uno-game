let User = require('../models/user.js'); 
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

let username; 
let password; 
let confirmPassword; 
let email;

function validate_username() {
    if (username.length == 0) {
        return {
            status: 'username_error', 
            msg: 'empty_username'
        }; 
    }

    if (username.length > 50) {
        return {
            status: 'username_error', 
            msg: 'username_too_long'
        }; 
    }

    return {
        status: 'success'
    }
}

function validate_password() {
    if (password !== confirmPassword) {
        return {
            status: 'password_error', 
            msg: 'password_mismatch' 
        }; 
    }

    if (password.length == 0) {
        return {
            status: 'password_error', 
            msg: 'empty_password'
        }; 
    }

    if (password.length > 50) {
        return {
            status: 'password_error', 
            msg: 'password_too_long'
        }; 
    }

    return {
        status: 'success'
    }
}

function validate_email() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email)) || email.length == 0 || email.length > 255) {
        return {
            status: 'email_error', 
            msg: 'invalid_email'
        } 
    }
    return {
        status: 'success'
    }
}

function prepare_response_template(res_obj) {

    if (username.length > 0)
        res_obj.username = username; 
    if (password.length > 0)
        res_obj.password = password; 
    if (email.length > 0)
        res_obj.email = email; 
    if (confirmPassword.length > 0)
        res_obj.confirmPassword = confirmPassword; 

    return res_obj; 
}

module.exports = async function(req) {

    username = req.body.username; 
    email = req.body.email; 
    email = email.toLowerCase(); 

    password = req.body.password;  
    confirmPassword = req.body.confirmPassword;  
    
    let username_res = validate_username(username); 
    if (username_res.status !== 'success') {
        return prepare_response_template(username_res); 
    }

    let email_res = validate_email(email);
    if (email_res.status !== 'success') {
        return prepare_response_template(email_res); 
    }
    
    let password_res = validate_password(password, confirmPassword); 
    if (password_res.status !== 'success') {
        return prepare_response_template(password_res); 
    }

    let hash = await bcrypt.hash(password, SALT_ROUNDS); 

    let result = await User.create(username, hash, email); 
    if (result.status === 'success') {
        // user was created successfully in the database
        return {
            status: 'success', 
            user_id: result.user_id
        }; 
    } else {
        // there was a problem registering the user 
        
        let db_error = {
            status: result.status, 
            msg: result.msg
        };  
        
        return prepare_response_template(db_error); 
    }
}