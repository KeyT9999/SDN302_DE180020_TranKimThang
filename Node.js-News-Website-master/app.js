const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');

const app = express();

// Configure Handlebars
const hbs = exphbs.create({
    helpers: {
        capitalize: (text) => text.toUpperCase()
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Ensure correct paths
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views', 'partials') // Ensure correct paths
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // Use "hbs", not "handlebars"
app.set('views', path.join(__dirname, 'views')); // Ensure correct absolute path

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Import and use routes
const newsRouter = require('./src/routes/news');
app.use('/', newsRouter);
app.use('/news', newsRouter);

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));