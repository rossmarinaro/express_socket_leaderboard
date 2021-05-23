/***  SCORES ***/
    const { Database } = require('../mongodb'); 
    const Leaderboard = {
        param: '', 
		status: '',
        score: {
            scores : [],
            current: 0,
            first: 0,
            second: 0,
            third: 0
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
        init: ()=>{
            return new Promise(res => res(Database.queryDB()));
        },
        eval: function (scores)
        {
            return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
        },
        run: async function(collections)
        {
            collections.forEach(collection => Leaderboard.score.scores.push(parseInt(collection.score)));
            const minMax = await Leaderboard.eval(Leaderboard.score.scores);
            console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
        ////top scores
            Leaderboard.score.first = minMax[1]; 
            Leaderboard.score.second = collections[1].score;
            Leaderboard.score.third = collections[2].score;
        ////top names
            Leaderboard.names.first = collections[0].userName;
            Leaderboard.names.second = collections[1].userName;
            Leaderboard.names.third = collections[2].userName;
        },
        update: function(add, replace)
        {
            console.log('updating cluster...');
            Database.persist(add, replace);
        }
    }
    
module.exports = { Leaderboard };
  