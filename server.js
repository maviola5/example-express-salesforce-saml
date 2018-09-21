require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('express')();
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const port = process.env.PORT || 8888;
 
passport.use(new SamlStrategy(
  {
    path: process.env.SAML_PATH,
    entryPoint: process.env.SAML_ENTRY_POINT,
    issuer: process.env.SAML_ISSUER,
    identifierFormat: process.env.SAML_IDENTIFIER_FORMAT,
    cert: fs.readFileSync('./cert.crt', 'utf-8')
  },
  (profile, done) => {
    return done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'this shit hits'
}))
app.use(passport.initialize());
app.use(passport.session());

/**
 * simple home page
 */
app.get('/', (req, res) => res.render('index', {title: 'Express, Passport, Saleforce SSO via SAML', user: req.user || {}}));

/**
 * login route
 */
app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => res.redirect('/')
);

/**
 * success callback route
 */
app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => res.redirect('/profile')
);

/**
 * logout route
 */
app.get('/logout', (req, res) => {
  /**
   * TODO - use SSO logout url in Salesforce in production (HTTPS required)
   */
  // passport logout method (kills the session)
  req.logout();
  res.redirect('/')
});

/**
 * profile page
 */
app.get('/profile', 
  (req, res) => {
    if(req.isAuthenticated()) {
      return res.render('profile', {user: req.user, title: 'Express, Passport, Saleforce SSO via SAML'});
    }
  res.redirect('/');
});


app.listen(port, () => console.log(`server on port ${port}`));