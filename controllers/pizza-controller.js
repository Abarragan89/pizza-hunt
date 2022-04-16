const { Pizza } = require('../models');
// All these methods will be used as callback to the routes;
const pizzaController = {
    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({
                path: 'comments',
                // we don't care about the '__V'
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // get one pizza by id
    getPizzaById({ params }, res ) {
        Pizza.findOne({ _id: params.id})
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                // If no pizza found
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No piza found with this id!' });
                    return;
                }
                res.json(dbPizzaData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // create pizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json)
    },
    // update pizza by id
    updatePizza({ params, body }, res) {
        // {new: true} - instruct Mongoose to return updated version of the document. 
        Pizza.findOneAndUpdate({ _id: params.id }, body, {new: true })
            .then(dbPizzaData => {
                if(!dbPizzaData){
                    res.status(400).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza with this id!'});
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err))
    }
};

module.exports = pizzaController;
