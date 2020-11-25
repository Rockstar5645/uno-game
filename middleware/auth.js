
module.exports = async function(req, res, next) {

    if (req.mySession.user_id) {
        console.log('user is authenticated, passing control to the next handler'); 
        next(); 
    } else {
        console.log('user is not authenticated redirecting to the login page'); 
        res.redirect('/login'); 
    }
}