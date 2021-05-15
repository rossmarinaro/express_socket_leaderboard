

/* EXPRESS SERVER */

const express = require('express');
const app = express();
const expressServer = require('http').Server(app)
const comPort = process.env.PORT || 5000;
const io = require('socket.io')(expressServer);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let scores = [],
	collections = [];

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
		MongoClient.connect(mongoURI, {useUnifiedTopology: true}, (err, client)=>{
			if (err) console.log(`cannot connect to data cluster...${err}`);
			else{
				console.log('connection to data cluster successful.');
			////evaluate / handle player's score
				function evalScore(){
					return new Promise(res => setTimeout(()=> res([Math.min(...scores), Math.max(...scores)]), 100));
				}
				const handleScore = async function()
				{
					const minMax = await evalScore(); //[0] = bottom score, [1] = top score
					console.log('collections: \n', collections,`\n top score: ${minMax[1]}`);
					collections.filter(collection => {
						if (collection.schema.score === minMax[1]) 
						{
							console.log(`first place: ${collection.schema.userName}`);
							leaderboard.first = collection.schema.userName;
						}
						if (collection.schema.score !== minMax[0] && collection.schema.score !== minMax[1]) 
						{
							console.log(`second place: ${collection.schema.userName}`);
							leaderboard.second = collection.schema.userName;
						}
						if (collection.schema.score === minMax[0])
						{
							console.log(`third place: ${collection.schema.userName}`);
							leaderboard.third = collection.schema.userName;
						}
						if (score > minMax[0]) socket.emit('high score', leaderboard)
					}); 
				}
			////database / collection
		  const db = client.db('Pastaboss').collection('leaderboard'); 
				db.find()/* .limit(3) */.forEach(obj => {  
					collections.push(obj);
					scores.push(obj.schema.score);
				}); 
				socket.on('submit leaderboard', userName => {
					schema.userName = userName;
					db.insertOne({ schema });
				});
			//perform check
				handleScore(); 
			}
		});
	});
});
///////////////////////////////////////////////server listen on port 
expressServer.listen(comPort, ()=> console.log(`Welcome to port ${comPort}.`));