var twitterKeysObj = require("./keys.js");
var Twitter = require("twitter"); 
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");
 
//console.log(twitterKeysObj);

var commandType = process.argv[2];
if (commandType === undefined)
{
    console.log("Usage: node liri [my-tweets, spotify-this-song, movie-this, do-what-it-says]"); 
    return;
}
commandType = commandType.toLowerCase();
console.log("Command: ", commandType);
switch (commandType)
{
    case "my-tweets":
        procMyTweets();
        break;
    case "spotify-this-song":
        procSpotifyThisSong();
        break;
    case "movie-this":
        procMovieThis();
        break;
    case "do-what-it-says":
        procDoWhatItSays();
        break;
    default:
        console.log("Unknown command");
}

function procMyTweets()
{
    var listOfKeys = twitterKeysObj.twitterKeys;

    //console.log(listOfKeys);

    var consumerKey = "";
    var consumerSecret = "";
    var accessTokenKey = "";
    var accessTokenSecret = "";

    for (var key in listOfKeys)
    {
        //console.log(key);
        switch (key)
        {
            case "consumer_key":     
                consumerKey = listOfKeys[key];
                break;
            case "consumer_secret":
                consumerSecret = listOfKeys[key];
                break;
            case "access_token_key":
                accessTokenKey = listOfKeys[key];
                break;
            case "access_token_secret":
                accessTokenSecret = listOfKeys[key];
                break;
            default:
        } 
    }
    //console.log(consumerKey);
    //console.log(consumerSecret);
    //console.log(accessTokenKey);
    //console.log(accessTokenSecret);

    var client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret
    });
    var params = {
        screen_name: "nodejs",
        count: 20
    };
    client.get("favorites/list.json", params, function(err, tweets, response) {
        if (err != null)
        {
            console.log(err);
        }
        else
        {
            console.log(tweets.length);
            for (var i = 0; i < tweets.length; i++)
            {
                console.log("Tweet #" + (i+1) + " ----------------------------------");
                console.log(tweets[i]);
            }
        }
    });
}

function procSpotifyThisSong()
{
    var songName = "The+Sign";
    for (var i = 3; i < process.argv.length; i++)
    {
        if (3 === i)
        {
            songName = process.argv[i];
        }
        else
        {
            songName += "+" + process.argv[i];
        }
    }

    var spotify = new Spotify({
        id: "b4d661f43bbf4d29bd48dad950ce71f1",
        secret: "568cce130202406992dba602bc884dec" 
    });
    var params = {
        type: "track",
        query: songName
    };
    //spotify.search({ type: "track", query: songName }, function(err, data) {
    spotify.search(params, function(err, data) {
        if (err != null) 
        {
            return console.log("Error occurred: " + err);
        }
        console.log(data); 
    });
}

function procMovieThis()
{
    var movieName = "Mr. Nobody";    
    for (var i = 3; i < process.argv.length; i++)
    {
        if (3 === i)
        {
            movieName = process.argv[i];
        }
        else
        {
            movieName += "+" + process.argv[i];
        }
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + 
                   "&y=&plot=short&tomatoes=true&apikey=40e9cece";
    console.log(queryUrl);
    request(queryUrl, function (err, response, body) {
        if (err != null)
        {
            console.log(err);
        }
        else
        {
            //console.log(body);
            if ((err === null) && (response.statusCode === 200))
            {
                var data = JSON.parse(body);
                console.log("Data: ", data);
                if (data.Year != undefined)
                {
                    console.log("Title: ", data.Title); 
                    console.log("Year: ", data.Year); 
                    console.log("IMDB Rating: ", data.imdbRating); 
                    console.log("Country: ", data.Country); 
                    console.log("Language: ", data.Language); 
                    console.log("Plot: ", data.Plot); 
                    console.log("Actors: ", data.Actors); 
                    if (data.tomatoURL != undefined)
                    {
                        console.log("Rotten Tomatoes URL: ", data.tomatoURL); 
                    }
                }
                else
                {
                    console.log(data.Error);
                }
            }
        }
    });
}

function procDoWhatItSays()
{
    var fileName = "random.txt"; 
    fs.readFile(fileName, "utf8", function(err, data) {
        if (err != null)
        {
            console.log("Error occurred: " + err);
        }
        else
        {
            var dataArr = data.split(",");
            var songName = dataArr[1];
            var spotify = new Spotify({
                id: "b4d661f43bbf4d29bd48dad950ce71f1",
                secret: "568cce130202406992dba602bc884dec" 
            });
            var params = {
                type: "track",
                query: songName
            };
            //spotify.search({ type: "track", query: songName }, function(err, data) {
            spotify.search(params, function(err, data) {
                if (err != null) 
                {
                    return console.log("Error occurred: " + err);
                }
                console.log(data); 
            });
        }
    });
}
