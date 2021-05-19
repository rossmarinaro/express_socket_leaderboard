

/* EXPRESS SERVER */

const express = require('express');
const app = express();
const expressServer = require('http').Server(app)
const comPort = process.env.PORT || 5000;
const io = require('socket.io')(expressServer);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));



////websocket input output
io.on('connection', function(socket)
{
	console.log('new socket connection');
//check player's score
	socket.on('check score', currentScore =>{
	////leaderboard schema
		const leaderboard = {
			score: {
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
		}
	////mongo db
		const MongoClient = require('mongodb').MongoClient;
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
					for (let i in scores)
					{
						switch(scores[i])
						{
							case 2 : 
									leaderboard.newPlace.first = false,
									leaderboard.newPlace.second = false,
									leaderboard.newPlace.third = true
							break; 
							case 1 : 
									leaderboard.newPlace.first = false,
									leaderboard.newPlace.second = true,
									leaderboard.newPlace.third = false
							break;
							case 0 : 
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
					if (currentScore > minMax[0]) socket.emit('high score', leaderboard);
				////submit leaderboard form
					socket.on('submit leaderboard', (userName, currentPlace, currentName) => {
						switch (currentPlace)
						{
							case '1st' : currentName = leaderboard.currentPlace.first; break;
							case '2nd' : currentName = leaderboard.currentPlace.second; break;
							case '3rd' : currentName = leaderboard.currentPlace.third; break;
						}
						console.log('current place:', currentPlace, '\ndropped:', currentName);
						db.deleteOne({userName: currentName});
						db.insertOne({ userName: userName, score: currentScore });
					});
				}
			////database / collection
		    const db = client.db('Pastaboss').collection('leaderboard');
				db.find({}).sort({score: -1}).limit(3).toArray((err, arr) => {
					if (err) throw err;
					handleScore(arr);
				});
			}
		});
	});
});
///////////////////////////////////////////////server listen on port
expressServer.listen(comPort, ()=> console.log(`Welcome to port ${comPort}.`));