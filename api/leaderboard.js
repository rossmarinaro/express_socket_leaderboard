/***  SCORES ***/
    const { Database } = require('../mongodb'); 
    const Leaderboard = {
        score: {
            current: 0,
            first: 0,
            second: 0,
            third: 0
        },
        currentPlace: {
            first: null,
            second: null,
            third: null
        },
        newPlace: {
            first: false,
            second: false,
            third: false
        },
        init: ()=>{
            return new Promise(res => res(Database.queryDB()));
        },
        evalScore: function (scores)
        {
            return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
        },
        handleScore: async function(collections)
        {
            let scores = []; 
            collections.forEach(collection => scores.push(parseInt(collection.score)));
            const minMax = await Leaderboard.evalScore(scores);
            console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
            return Leaderboard.score.first = minMax[1];
        }
    }
    
module.exports = { Leaderboard };
  