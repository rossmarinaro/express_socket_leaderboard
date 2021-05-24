/***  SCORES ***/
    const { Database } = require('../mongodb'); 
    const Leaderboard = {
        param: '', 
		status: '',
        scores: {
            top : [],
            current: 0,
            first: 0,
            second: 0,
            third: 0
        },
        _id: {
            first: '',
            second: '',
            third: ''
        },
        names: {
            first: '',
            second: '',
            third: ''
        },
        newPlace: {
            first: false,
            second: false,
            third: false
        },
        init: function(){
            return new Promise(res => res(Database.queryDB()));
        },
        eval: function (scores)
        {
            return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
        },
        run: async function(collections)
        {
            collections.forEach(collection => Leaderboard.scores.top.push(parseInt(collection.score)));
            const minMax = await Leaderboard.eval(Leaderboard.scores.top);
            console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
        ////top scores
            Leaderboard.scores.first = collections[0].score; 
            Leaderboard.scores.second = collections[1].score;
            Leaderboard.scores.third = collections[2].score;
        ////top names
            Leaderboard.names.first = collections[0].userName;
            Leaderboard.names.second = collections[1].userName;
            Leaderboard.names.third = collections[2].userName;
        ////top id
            Leaderboard._id.first = collections[0]._id;
            Leaderboard._id.second = collections[1]._id;
            Leaderboard._id.third = collections[2]._id;
        },
        update: function(add, replace)
        {
            console.log('updating cluster...');
            Database.persist(add, replace);
        }
    }
    
module.exports = { Leaderboard };
  