

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
	socket.on('check score', score =>{
		const schema = {
			userName: null,
			score: score
		}
		const leaderboard = {
			first: null,
			second: null,
			third: null
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
					collections.forEach(collection => scores.push(collection.schema.score));
					const minMax = await evalScore(scores); 
					console.log('collections: \n', collections,`\nbottom score: ${minMax[0]}, top score: ${minMax[1]}`);
					leaderboard.first = collections[0].schema.userName; 
					leaderboard.second = collections[1].schema.userName;
					leaderboard.third = collections[2].schema.userName;
					if (score > minMax[0]) socket.emit('high score', leaderboard);
				}
			////database / collection
		  const db = client.db('Pastaboss').collection('leaderboard'); 
				db.find({}).limit(3).toArray((err, arr) => {
					if (err) throw err;
					handleScore(arr);
				});  
				socket.on('submit leaderboard', userName => {
					schema.userName = userName;
					db.insertOne({ schema });
				});
			}
		});
	});
});
///////////////////////////////////////////////server listen on port 
expressServer.listen(comPort, ()=> console.log(`Welcome to port ${comPort}.`));