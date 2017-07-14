var request = require("request");

var movieName = "";

console.log(process.argv.length);

for (var i = 2; i < process.argv.length; i++)
{
    if (2 === i)
    {
        movieName = process.argv[i];
    }
    else
    {
        movieName += " " + process.argv[i];
    }
}

if (movieName === "")
{
    console.log("Usage: node omdbInteractiveStarter movieName");
    return;
}

var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

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
            //console.log("Data: ", data);
            if (data.Year != undefined)
            {
                var year = data.Year.trim();
                console.log("Release Year: " + year);
            }
            else
            {
                console.log(data.Error);
            }
        }
    }
});
