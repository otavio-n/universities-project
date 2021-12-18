const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const urls = require('./endpoints');
const University = require('./schema');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/universitiesDB', {useNewUrlParser: true});

////////////    Load and Save All Universities      ///////////////

app.get('/', function(req, res){

    var completedRequests = 0;

    urls.forEach(function(url){

        http.get(url, function(response){
            console.log(url + ' response: ' + response.statusCode);

            let chunks = [];
    
            response.on('data', function(data){
                chunks.push(data);

            }).on('end', function () {

                let data = Buffer.concat(chunks);
                const requests = JSON.parse(data);

                requests.forEach(function(request){

                    const university = new University ({
                        alpha_two_code: request.alpha_two_code,
                        web_pages: request.web_pages,
                        name: request.name,
                        country: request.country,
                        domains: request.domains,
                        state_province: request['state-province']
                    });

                    university.save();
                });

                if (completedRequests++ == urls.length - 1) {
                     console.log('Finished!');
                }
            }).on('error', (err) => {
                res.send(err);
            });

        });
        
    });
    res.send('Server is up and running!');
});  

///////////     API REST    ////////////

////Requests Targetting all Universities////
app.route('/universities')

//Get universities
.get(function(req, res){

    //Show limited number of universities 
    var limiting = req.query.limit;

    if (limiting != undefined) {
        limiting = parseInt(limiting);
    } else {
        limiting = 20;
    }

    //Define country filter
    var filter = {};

    if (req.query.country) {

        const capitalizeCountry = req.query.country[0]
        .toUpperCase() + req.query.country.slice(1)
        .toLowerCase();

        filter = {
            country: capitalizeCountry
        };
    }

    //Find university
    University.find
    (
        filter,
        '_id name country state_province', 
        function(err, foundUniversities){
            if(!err) {
                res.send(foundUniversities);
            } else {
                res.send(err);
            }
        }
    ).limit(limiting);
})

//Post a new university
.post(function(req, res){

    //Avoid duplicates
    University.findOne(
        {
            name: req.body.name,
            country: req.body.country,
            state_province: req.body['state-province']
        },
        function(err, foundUniversity) {
            if(err) {
                res.send(err);
            } else if (foundUniversity) {
                res.send('This university has already been saved.');
            } else {

                //Adding new university
                const newUniversity = new University({
                    alpha_two_code: req.body.alpha_two_code,                        
                    web_pages: req.body.web_pages,
                    name: req.body.name,
                    country: req.body.country,
                    domains: req.body.domains,
                    state_province: req.body['state-province']
                });

                newUniversity.save(function(err){
                    if (!err){
                        res.send('Successfully added new university.');
                    } else {
                        res.send(err);
                    }
                });
            }
        }
    );
});


////Requests Targetting A Specific University///
app.route('/universities/:id')

//Get university by id
.get(function(req, res){

    University.findOne({_id: req.params.id}, function(err, foundUniversity){
        if (foundUniversity) {
            res.send(foundUniversity);
        } else {
            res.send('No universities found.');
        }
    });
})

//Update university by id
.put(function(req, res){
    
    University.updateOne(
        {_id: req.params.id},
        {web_pages: req.body.web_pages,
        name: req.body.name,
        domains: req.body.domains},
        function(err){
            if(!err){
                res.send('Successfully updated university.');
            } else {
                res.send(err);
            }
        }
    );
})

//Delete university by id
.delete(function(req,res){

    University.deleteOne({_id: req.params.id}, function(err){
        if (!err) {
            res.send('Successfully deleted the corresponding university.');
        } else {
            res.send(err);
        }
    });
});


app.listen(3000, function(){
    console.log('Server is running on port 3000.');
});