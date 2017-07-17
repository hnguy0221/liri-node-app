var twitterKeysObj = require("./keys.js");
var Twitter = require("twitter"); 
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");

var commandType = process.argv[2];
if (commandType === undefined)
{
    console.log("Usage: node liri <my-tweets or spotify-this-song or movie-this or do-what-it-says>"); 
    return;
}
commandType = commandType.toLowerCase();
console.log("Command: ", commandType);
writeToLogFile("\nCommand: " + commandType);
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
        writeToLogFile("\nUnknown command");
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
            console.log("Unknown twitter key");
            writeToLogFile("\nUnknown twitter key");
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
            writeToLogFile("\nError occurred: " + err);
        }
        else
        {
            //console.log(tweets.length);
            var cnt = 0;
            for (var i = 0; i < tweets.length; i++)
            {
                console.log("Tweet #" + (i+1) + ":");
                writeToLogFile("\nTweet #" + (i+1) + ":");
                //var json = JSON.stringify(tweets[i]);
                //console.log(tweets[i]);
                var user = tweets[i].user;
                console.log("Created at: " + tweets[i].created_at);
                writeToLogFile("\nCreated at: " + tweets[i].created_at);
                console.log("Text: " + tweets[i].text);
                writeToLogFile("\nText: " + tweets[i].text);
                console.log("User's description: " + user.description);
                writeToLogFile("\nUser's description: " + user.description);
                console.log("User's name: " + user.name);
                writeToLogFile("\nUser's name: " + user.name);
                console.log("User's location: " + user.location);
                writeToLogFile("\nUser's location: " + user.location);
                if (cnt++ < tweets.length-1)
                {
                    console.log("------------------------------------------------------------------------------");
                    writeToLogFile("\n------------------------------------------------------------------------------");
                }
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
    //console.log("songName:", songName);
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
            writeToLogFile("\nError occurred: " + err);
        }
        else
        {
            //console.log(JSON.stringify(data, null, 2));
            var items = data.tracks.items;
            var artistSet = new Set(); //Set removes dups
            //var albumNameSet = new Set();
            //var previewUrlSet = new Set();
            var cnt1 = 0;
            for(var i = 0; i < items.length; i++)
            {
                var album = items[i].album;
                console.log("Album #" + (i+1) + ": " + album.name);
                writeToLogFile("\nAlbum #" + (i+1) + ": " + album.name);
                console.log("  Song's name: ", items[i].name);
                writeToLogFile("  \nSong's name: " + items[i].name);
                if (items[i].preview_url != null)
                {
                    console.log("  Preview URL: " + items[i].preview_url);
                    writeToLogFile("  \nPreview URL: " + items[i].preview_url);
                }
                var artists = items[i].artists;
                for (var j = 0; j < artists.length; j++)
                {
                    artistSet.add(artists[j].name);
                }
                //concatenate the name of each artist to string
                //separted by a comma.
                var cnt2 = 0;
                var artistStr = "";
                for (var v of artistSet)
                {
                    artistStr += v;
                    if (cnt2++ < artistSet.size-1)
                    {
                       artistStr += ", ";
                    }
                }
                console.log("  Artists: " + artistStr);
                writeToLogFile("  \nArtists: " + artistStr);
                if (cnt1++ < items.length-1)
                {
                    console.log("------------------------------------------------------------------------------");
                    writeToLogFile("\n------------------------------------------------------------------------------");
                }
            }
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
    //console.log("movieName:", movieName);
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + 
                   "&y=&plot=short&tomatoes=true&apikey=40e9cece";
    console.log(queryUrl);
    writeToLogFile("\n" + queryUrl);
    request(queryUrl, function (err, response, body) {
        if (err != null)
        {
            console.log("Error occurred: " + err);
            writeToLogFile("\nError occurred: " + err);
        }
        else
        {
            //console.log(body);
            if ((err === null) && (response.statusCode === 200))
            {
                //console.log("JSON.stringify: ", JSON.stringify(body, null, 2));
                var data = JSON.parse(body);
                //console.log("Data after JSON.parse: ", data);
                if (data.Year != undefined)
                {
                    console.log("Title: ", data.Title);
                    writeToLogFile("\nTitle: " + data.Title);
                    console.log("Year: ", data.Year); 
                    writeToLogFile("\nYear: " + data.Year);
                    console.log("IMDB Rating: ", data.imdbRating);
                    writeToLogFile("\nIMDB Rating: " + data.imdbRating);
                    console.log("Country: ", data.Country);
                    writeToLogFile("\nCountry: " + data.Country);
                    console.log("Language: ", data.Language);
                    writeToLogFile("\nLanguage: " + data.Language);
                    console.log("Plot: ", data.Plot);
                    writeToLogFile("\nPlot: " + data.Plot);
                    console.log("Actors: ", data.Actors);
                    writeToLogFile("\nActors: " + data.Actors);
                    if (data.tomatoURL != undefined)
                    {
                        console.log("Rotten Tomatoes URL: ", data.tomatoURL);
                        writeToLogFile("\nRotten Tomatoes URL: " + data.tomatoURL);
                    }
                }
                else
                {
                    console.log(data.Error);
                    writeToLogFile("\n" + data.Error);
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
            writeToLogFile("\nError occurred: " + err);
        }
        else
        {
            var dataArr = data.split(",");
            var songName = dataArr[1];
            procSpotifyThisSong(songName);
        }
    });
}

function writeToLogFile(data)
{
    // This block of code will create a file called "log.txt".
    // It will then print string value passed to data in the file
    fs.appendFile("../log/log.txt", data, function(err) {

        // If the code experiences any errors it will log the error to the console.
        if (err != null) 
        {
            console.log("Error occurred: ", err);
            writeToLogFile("\nError occurred: " + err);
            return;
        }

        // Otherwise, it will print: "log.txt was updated!"
        console.log("log.txt was updated!");
    
    });
}