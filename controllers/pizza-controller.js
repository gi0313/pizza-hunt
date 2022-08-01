const { Pizza } = require('../models');

const pizzaController = {
    //get all pizzas 
    getAllPizza(req, res) {
        Pizza.find({})
        .populate({
            path: 'comments',
            select: '-_V' //The minus sign - in front of the field indicates that we don't want it to be returned
        })
        .select('-_V')
        .sort({ _id: -1}) //sorts by newest comment first
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    //get one pizza by Id
    getPizzaById({params}, res) {
        Pizza.findOne({_id: params.id})
//Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled
        .populate({
            path: 'comments',
            select: '-_V'
        })
        .select('-_V')
        .then(dbPizzaData => {
            //if no pizza is found, send 404
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //createPizza
    createPizza({body}, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },
    //update pizza by id
    updatePizza({ params, body },res) {
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
        //If we don't set that third parameter, { new: true }, it will return the original document
        //By setting the parameter to true, we're instructing Mongoose to return the new version of the document
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(400).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },
    //delete pizza
    deletePizza({params}, res) {
        Pizza.findOneAndDelete({_id: params.id})
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;