
module.exports = function(app,passport){


	app.get('/profile', function(req, res) {
        if (req.isAuthenticated()){
        	res.json({data:req.user});
        } else{
        	res.json({data:false});
        }
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/profile');
    });

    // facebook routes
    // twitter routes

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
    }));
}