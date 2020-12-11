let User = require('../models/user.js'); 
const bcrypt = require('bcrypt');

let username; 
let password; 

function prepare_response_template(res_obj) {

    if (username.length > 0)
        res_obj.username = username; 
    if (password.length > 0)
        res_obj.password = password; 

    return res_obj; 
}

module.exports = async function(req) {

    username = req.body.username; 
    password = req.body.password; 

    if (username.length == 0) {
        return prepare_response_template({
            status: 'username_error',
            msg: 'empty_username'
        }); 
    }

    if (password.length == 0) {
        return prepare_response_template({
            status: 'password_error',
            msg: 'empty_password' 
        });
    }

    let db_result = await User.find_user(username); 

    if (db_result.status == 'no_user') {

        return prepare_response_template({
            status: 'error', 
            msg: 'authentication_error'
        });
    } else if (db_result.status == 'success') {

        let hash = db_result.hash; 
        const match = await bcrypt.compare(password, hash);
 
        if(match) {
            return {
                status: 'success',
                user_id: db_result.user_id,
                username: db_result.username,
                avatar: db_result.avatar
            }; 
        } else {
            return prepare_response_template({
                status: 'error', 
                msg: 'authentication_error'
            });
        }
 
    } else if (db_result.status == 'database_error') {
        return prepare_response_template(db_result); 
    }

}