const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.post("/", function(req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const mail = req.body.mailid;

  const data = {
    members: [{
      email_address: mail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname,
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/e8d59fbf27";

  const options = {
    method: "POST",
    auth: "cipher:a35f955061be7f760abbcc8ecd3684f4-us18",
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up!!");
});


//API KEY
//0242032787ded713e9a28fb31a80c517-us18

//LIST ID
//e8d59fbf27
