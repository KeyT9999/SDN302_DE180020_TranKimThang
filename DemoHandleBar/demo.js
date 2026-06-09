const Handlebars = require('handlebars');
// Register `helperMissing` to handle undefined helpers or properties
Handlebars.registerHelper('blockHelperMissing', function(context, options) {
    return "Helper '"+options.name+"' not found. " 
     + "Printing block: " + options.fn(context); 
});    
// Create a Handlebars template
const template = Handlebars.compile(`
    {{#person}}
    {{firstname}} {{lastname}}
    {{/person}}
`);
// Data passed to the template
const data = {
    person: {
     firstname: "Van",
     lastname: "Nam",
    },
}
    
// Render the template with the data
const output = template(data);
console.log(output);