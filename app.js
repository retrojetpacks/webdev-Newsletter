const express = require("express");
const https = require("https"); //replace request
const bodyParser = require("body-parser");

const app = express();

var listID = "6eab828ee5";
var apiKey = "32afb6ec00785a33815ae9b4b70ca43d-us7j";

app.use(express.static("public")); //let's express acces static objects
app.use(bodyParser.urlencoded({extended: true})); //allows for access of form results


app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/" + listID; //need to set usX to us+apikey serverid
  const options = {
    method: "POST",
    auth: "jack:"+apiKey
  };

// Make http request
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      //res.send("Successfully subscribed!");
      res.sendFile(__dirname+"/success.html")
    } else {
      //res.send("Error in signup");
      res.sendFile(__dirname+"/failure.html")

    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  //request.write(jsonData);
  request.end();
});


// On fail, let button redirect to home page
app.post("/failure", function(req, res){
  res.redirect("/");
})


//Dynamic PORT defined by Heroku servers, or 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Server up on 3000");
});


// MAILCHIMP API key
// 32afb6ec00785a33815ae9b4b70ca43d-us7
//List ID
//6eab828ee5
