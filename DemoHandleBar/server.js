// server.js
const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const app = express();
// Configure Handlebars
const hbs = exphbs.create({
  helpers: {
    capitalize: (text) => text.toUpperCase()
  },
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main',
  partialsDir: 'views/partials/'
}); 
Handlebars.registerHelper('helperMissing', function ( 
  /* dynamic arguments */) {
  var options = arguments[arguments.length - 1];
  var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1)
  return new Handlebars.SafeString("Missing: " + options.name + "(" + args + ")")
})
// Template with a missing helper
const template = Handlebars.compile('{{missingHelper}}');
console.log(template({})); // Output: "Helper not found!"
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.get('/', (req, res) => {
 res.render('home', {
  items: [
    { name: 'Item 1', description: 'This is the first item.' },
    { name: 'Item 2', description: 'This is the second item.' }
  ]
    
});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

