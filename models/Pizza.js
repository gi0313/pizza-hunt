const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: true, // requires data to be input for that field
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true //removes white space before and after input string
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
//With this get option in place, every time we retrieve a pizza, 
//the value in the createdAt field will be formatted by the dateFormat() function 
//and used instead of the default timestamp value
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
//The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
    }]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    //we'll need to tell the Mongoose model that it should use any getter function we've specified
    },
    id: false
    //We set id to false because this is a virtual that Mongoose returns, and we don’t need it
    }
);

//get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    //return this.comments.length;
    return this.comments.reduce((total, comment) => total + comment.replies.legth + 1, 0);
//we're using the .reduce() method to tally up the total of every comment with its replies
//takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment.
})

//create pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the pizza model
module.exports = Pizza;