
/***  EXPRESS SERVER ***/

	const express = require('express');
	const { Leaderboard } = require('./api/leaderboard');
	const app = express();
	const expressServer = require('http').Server(app)
	const comPort = process.env.PORT || 5000;
	const io = require('socket.io')(expressServer);
	require('./mongodb');

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(express.static(__dirname + '/public'));
	app.use(function(err, req, res, next) { // 'SyntaxError: Unexpected token n in JSON at position 0'
		err.message;
		next(err);
		console.log(req, res, next)
	});

//init leaderboard
	Leaderboard.init();
///////////////////////////////////////////////////////////////////end points

//query leaderboard
	app.get('/api/leaderboard', (req, res) => res.send(Leaderboard));
//check player's score
	app.post('/', (currentScore, res) => {      
	////leaderboard schema
	/* 	const leaderboard = {
			score: {
				current: currentScore,  
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
			}
		}  */
		for (let [prop, value] of Object.entries(currentScore.body)) 
		{
			let schema = {prop:prop, value:value}
			if (value > Leaderboard.score.third) res.send(schema);
		}

			////submit leaderboard form
			let submitted = false;
			// socket.on('submit leaderboard', (userName, currentPlace, dropUser) => {
			// 	if (submitted === false)
			// 	{
			// 		submitted = true;
			// 		switch (currentPlace)
			// 		{
			// 			case '1st' : dropUser = leaderboard.currentPlace.first; break;
			// 			case '2nd' : dropUser = leaderboard.currentPlace.second; break;
			// 			case '3rd' : dropUser = leaderboard.currentPlace.third; break;
			// 		}
			// 		setTimeout(() => submitted = false, 100);
			// 		console.log('current place:', currentPlace, '\ndropped:', dropUser);
			// 		db.deleteOne({ userName: dropUser});
			// 		db.insertOne({ userName: userName, score: leaderboard.score.current });
			// 	} 
			// }); 
	});
////evaluate / handle player's score
// function evalScore(scores){
// 	return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
// }
// const handleScore = async function(collections)
// {
// 	let scores = [];
// 	collections.forEach(collection => scores.push(parseInt(collection.score)));
// 	const minMax = await evalScore(scores);
// 	console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
// 	// if ()
// 	// {
// 	// 	leaderboard.newPlace.first = false,
// 	// 	leaderboard.newPlace.second = false,
// 	// 	leaderboard.newPlace.third = true
// 	// }
// 	// if ()
// 	// {
// 	// 	leaderboard.newPlace.first = false,
// 	// 	leaderboard.newPlace.second = true,
// 	// 	leaderboard.newPlace.third = false
// 	// }
// 	// if (leaderboard.score.current > scores[2])
// 	// {
// 	// 	leaderboard.newPlace.first = true,
// 	// 	leaderboard.newPlace.second = false,
// 	// 	leaderboard.newPlace.third = false
// 	// }

// 	for (let i in scores)
// 	{console.log(i)
// 		switch(scores[i])
// 		{
// 			case leaderboard.score.current > scores[0] && leaderboard.score.current < scores[1] : 
// 					leaderboard.newPlace.first = false,
// 					leaderboard.newPlace.second = false,
// 					leaderboard.newPlace.third = true
// 			break; 
// 			case leaderboard.score.current > scores[1] && leaderboard.score.current < scores[2] : 
// 					leaderboard.newPlace.first = false,
// 					leaderboard.newPlace.second = true,
// 					leaderboard.newPlace.third = false
// 			break;
// 			case leaderboard.score.current > scores[0] : 
// 					leaderboard.newPlace.first = true,
// 					leaderboard.newPlace.second = false,
// 					leaderboard.newPlace.third = false
// 			break;
// 		}
// 	}
// ////top names
// 	leaderboard.currentPlace.first = collections[0].userName;
// 	leaderboard.currentPlace.second = collections[1].userName;
// 	leaderboard.currentPlace.third = collections[2].userName;
// ////top scores
// 	leaderboard.score.first = collections[0].score;
// 	leaderboard.score.second = collections[1].score;
// 	leaderboard.score.third = collections[2].score;
// ////emit high score
// 	//if (leaderboard.score.current > minMax[0]) socket.emit('high score', leaderboard);
// ////send score data
// 	//socket.emit('set score', minMax[1]);
// }




























////websocket input output
io.on('connection', function(socket)
{
	console.log('new socket connection');
	
//check player's score
	socket.on('check score', currentScore =>{      
	////leaderboard schema
		// const leaderboard = {
		// 	score: {
		// 		current: currentScore,
		// 		first: 0,
		// 		second: 0,
		// 		third: 0
		// 	},
		// 	currentPlace: {
		// 		first: null,
		// 		second: null,
		// 		third: null
		// 	},
		// 	newPlace: {
		// 		first: false,
		// 		second: false,
		// 		third: false
		// 	}
		// }
	////mongo db
	/* 	const MongoClient = require('mongodb').MongoClient;
		const mongoURI = require('./keys').mongoURI;
		MongoClient.connect(mongoURI, {useUnifiedTopology: true}, (err, client) => {
			if (err) console.log(`cannot connect to data cluster...${err}`);
			else{
				console.log('connection to data cluster successful.');
			////evaluate / handle player's score
				function evalScore(scores){
					return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
				}
				const handleScore = async function(collections)
				{
					let scores = [];
					collections.forEach(collection => scores.push(parseInt(collection.score)));
					const minMax = await evalScore(scores);
					console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
					// if ()
					// {
					// 	leaderboard.newPlace.first = false,
					// 	leaderboard.newPlace.second = false,
					// 	leaderboard.newPlace.third = true
					// }
					// if ()
					// {
					// 	leaderboard.newPlace.first = false,
					// 	leaderboard.newPlace.second = true,
					// 	leaderboard.newPlace.third = false
					// }
					// if (leaderboard.score.current > scores[2])
					// {
					// 	leaderboard.newPlace.first = true,
					// 	leaderboard.newPlace.second = false,
					// 	leaderboard.newPlace.third = false
					// }
				
		
				
					for (let i in scores)
					{console.log(i)
						switch(scores[i])
						{
							case leaderboard.score.current > scores[0] && leaderboard.score.current < scores[1] : 
									leaderboard.newPlace.first = false,
									leaderboard.newPlace.second = false,
									leaderboard.newPlace.third = true
							break; 
							case leaderboard.score.current > scores[1] && leaderboard.score.current < scores[2] : 
									leaderboard.newPlace.first = false,
									leaderboard.newPlace.second = true,
									leaderboard.newPlace.third = false
							break;
							case leaderboard.score.current > scores[0] : 
									leaderboard.newPlace.first = true,
									leaderboard.newPlace.second = false,
									leaderboard.newPlace.third = false
							break;
						}
					}
				////top names
					leaderboard.currentPlace.first = collections[0].userName;
					leaderboard.currentPlace.second = collections[1].userName;
					leaderboard.currentPlace.third = collections[2].userName;
				////top scores
					leaderboard.score.first = collections[0].score;
					leaderboard.score.second = collections[1].score;
					leaderboard.score.third = collections[2].score;
				////emit high score
					if (leaderboard.score.current > minMax[0]) socket.emit('high score', leaderboard);
				////send score data
					socket.emit('set score', minMax[1]);
				}
			////database / collection
		    const db = client.db('Pastaboss').collection('leaderboard');
				db.find({}).sort({score: -1}).limit(3).toArray((err, arr) => {
					if (err) throw err;
					handleScore(arr);
				});
				////submit leaderboard form
				let submitted = false;
				socket.on('submit leaderboard', (userName, currentPlace, dropUser) => {
					if (submitted === false)
					{
						submitted = true;
						switch (currentPlace)
						{
							case '1st' : dropUser = leaderboard.currentPlace.first; break;
							case '2nd' : dropUser = leaderboard.currentPlace.second; break;
							case '3rd' : dropUser = leaderboard.currentPlace.third; break;
						}
						setTimeout(() => submitted = false, 100);
						console.log('current place:', currentPlace, '\ndropped:', dropUser);
						db.deleteOne({ userName: dropUser});
						db.insertOne({ userName: userName, score: leaderboard.score.current });
					} 
				}); 
			}
		}); */
	});
});
///////////////////////////////////////////////server listen on port
expressServer.listen(comPort, ()=> console.log(`Welcome to port ${comPort}.`));



