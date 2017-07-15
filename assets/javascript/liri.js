var twitterKeysObj = require("./keys.js");
var Twitter = require("twitter"); 
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");

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
        procSpotifyThisSong(getSongName());
        break;
    case "movie-this":
        procMovieThis(getMovieName());
        break;
    case "do-what-it-says":
        procDoWhatItSays();
        break;
    default:
        console.log("Unknown command");
}

function procMyTweets()
{
    var consumerKey = "";
    var consumerSecret = "";
    var accessTokenKey = "";
    var accessTokenSecret = "";

    var listOfKeys = twitterKeysObj.twitterKeys;
    for (var key in listOfKeys)
    {
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
            console.log("Error occurred: " + err);
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

function getSongName()
{
    var songName = "The Sign";
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
    return songName;
}

function procSpotifyThisSong(songName)
{
    console.log("songName:", songName);
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
            console.log("Error occurred: " + err);
        }
        else
        {
            //get the name of each artist
            var items = data.tracks.items;
            var artistSet = new Set();
            var albumNameSet = new Set();
            var previewUrlSet = new Set();
            for(var i = 0; i < items.length; i++)
            {
                var album = items[i].album;
                albumNameSet.add(album.name);
                if (items[i].preview_url != null)
                {
                    previewUrlSet.add(items[i].preview_url);
                }
                var artists = items[i].artists;
                for (var j = 0; j < artists.length; j++)
                {
                    artistSet.add(artists[j].name)
                }
            }
            //concatenate the name of each artist to string
            //separted by a comma.
            var i = 0;
            var artistStr = "";
            for (var v of artistSet)
            {
                artistStr += v;
                if (i++ < artistSet.size-1)
                {
                    artistStr += ", ";
                }
            }
            console.log("\nArtists: ", artistStr);
            console.log("The song's name: ", items[0].name );
            //concatenate the preview url of each item to string
            //separted by a comma.
            i = 0;
            var previewUrlStr = "";
            for (var v of previewUrlSet)
            {
                previewUrlStr += v;
                if (i++ < previewUrlSet.size-1)
                {
                    previewUrlStr += ", ";
                }
            }
            if (previewUrlStr != "")
            {
                console.log("Preview URL: ", previewUrlStr);
            }
            //concatenate the name of each album to string
            //separted by a comma.
            i = 0;
            var albumNameStr = "";
            for (var v of albumNameSet)
            {
                albumNameStr += v;
                if (i++ < albumNameSet.size-1)
                {
                    albumNameStr += ", ";
                }
            }
            console.log("Album: ", albumNameStr);
        }
    });
}

function getMovieName()
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
    return movieName;
}

function procMovieThis(movieName)
{
    console.log("movieName:", movieName);
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + 
                   "&y=&plot=short&tomatoes=true&apikey=40e9cece";
    console.log(queryUrl);
    request(queryUrl, function (err, response, body) {
        if (err != null)
        {
            console.log("Error occurred: " + err);
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
            procSpotifyThisSong(songName);
        }
    });
}