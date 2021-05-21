/*** MONGO DB ***/

const MongoClient = require('mongodb').MongoClient;
const mongoURI = require('./keys').mongoURI;

const Database = {
    collection : [],
    awaitDB: function (collection)
    {
        return new Promise(res => {
            this.getCollection = data => res(data);
            MongoClient.connect(mongoURI, {useUnifiedTopology: true}, (err, client) => {
                if (err) console.log(`cannot connect to data cluster...${err}`);
                else{
                    console.log('connection to data cluster successful.');
                    const db = client.db('Pastaboss').collection('leaderboard');
                    db.find({}).sort({score: -1}).limit(3).toArray((err, arr) => {
                        if (err) throw err;
                        collection = arr;
                        this.getCollection(collection);
                    })
                }
            });
        });
    },
    queryDB: async function()
    {
        const res = await Database.awaitDB(); 
        Database.collection = res; 
        const { Leaderboard } = require('./api/leaderboard');
        Leaderboard.handleScore(Database.collection);
    }
}

module.exports = { Database };


  