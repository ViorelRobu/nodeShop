const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();
// apply middleware to all requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
        keys: ['hjj123ka94bkag7abvhh??u45%$234$%%^^']
    })
);

app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening!');
});