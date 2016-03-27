var Food = require('./models/food');
var path = require("path");

function getFoods(res) {
    Food.find(function (err, food) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(food); // return all foods in JSON format
    });
}

function getTotal(res){
    Food.aggregate({
        $group:{
            "_id": null,
            "total":{$sum: "$price"}
        }
    },function (err, total) {
        if (err)
            res.send(err);

        if(total[0] == undefined){
            res.json(0);
        }else{
            res.json(total[0].total * 1.075);
        }

    });
}
module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all food items
    app.get('/api/food', function (req, res) {
        // use mongoose to get all food items in the database
        getFoods(res);
    });

    // create food and send back all food items after creation
    app.post('/api/food', function (req, res) {

        // create a food item, information comes from AJAX request from Angular
        Food.create({
            name: req.body.name,
            price: req.body.price
        }, function (err, food) {
            if (err)
                res.send(err);

            // get and return all the food items after you create another
            getFoods(res);
        });

    });

    // delete a food
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFoods(res);
        });
    });

    // get total price of food items
    app.get('/api/total', function (req, res){
        getTotal(res);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname,'../', '/public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
    });
};