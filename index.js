
/***  EXPRESS SERVER ***/

	const express = require('express');
	const { Leaderboard } = require('./api/leaderboard');
	const app = express();
	const expressServer = require('http').Server(app)
	const comPort = process.env.PORT || 5000;
	//const io = require('socket.io')(expressServer);
	require('./mongodb');

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(express.static(__dirname + '/public'));
	app.use(function(err, req, res, next) 
	{ // 'SyntaxError: Unexpected token n in JSON at position 0'
		err.message;
		next(err);
		console.log(req, res, next)
	});

	Leaderboard.init(); 
///////////////////end points
//query Leaderboard
	app.get('/leaderboard', (req, res) => res.send(Leaderboard));  
	app.post('/check-score', (score, res) => {      
		for (let [prop, value] of Object.entries(score.body)) 
		{
			Leaderboard.param = prop;  
			Leaderboard.scores.current = value;
			if (value > Leaderboard.scores.third) 
			{
				if(value > Leaderboard.scores.top[0])
				{
					Leaderboard.status = '1st'; 
					Leaderboard.newPlace.first = true;
					Leaderboard.newPlace.second = false;
					Leaderboard.newPlace.third = false;	
				}
				else if(value > Leaderboard.scores.top[1] && value <= Leaderboard.scores.top[0])
				{
					Leaderboard.status = '2nd';
					Leaderboard.newPlace.first = false;
					Leaderboard.newPlace.second = true;
					Leaderboard.newPlace.third = false;	
				}
				else{
					Leaderboard.status = '3rd';
					Leaderboard.newPlace.first = false;
					Leaderboard.newPlace.second = false;
					Leaderboard.newPlace.third = true;
				}
				res.send(Leaderboard);
			}
		} 
	});
////submit leaderboard form
	app.post('/submit', (data, res) => {   
		let dropUser, submitted = false;
		if (submitted === false)
		{
			submitted = true;
			switch (data.body.status)
			{
				case '1st' : dropUser = Leaderboard._id.first; break;
				case '2nd' : dropUser = Leaderboard._id.second; break;
				case '3rd' : dropUser = Leaderboard._id.third; break;
			}
			console.log('current place:', data.body.status, '\ndropped:', dropUser);
			Leaderboard.update({userName: data.body.userName, score: data.body.score}, {_id: dropUser});
			Leaderboard.init()
			setTimeout(() => {
				res.send(Leaderboard);
				submitted = false;
			}, 1000);
		}  
	});
  

///////////////////////////////////////////////server listen on port
	expressServer.listen(comPort, ()=> console.log(`Welcome to port ${comPort}.`));



