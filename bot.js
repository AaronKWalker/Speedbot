var Twitter = require('twitter');
var config = require('./config.js');
var chalk = require('chalk');
var ls = require('log-symbols');
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});

var client = new Twitter(config);

var now = new Date();
var days = ['Sunday','Monday', 'Tuesday','Wednesday','Tursday','Friday','Saturday'];
var day, month;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function testConsole(){
  console.log(ls.success, chalk.green('Success!'));
  console.log(ls.info, chalk.blue('Info'));
  console.log(ls.warning, chalk.yellow('Warning!'));
  console.log(ls.error, chalk.red('Error!'));
}

function testSpeed(){
  day = days[now.getDay()];
  month = months[now.getMonth()];
  speedTest.visual({maxTime: 5000}, (err, data)=> {
    if (err) {
      console.log(ls.error, chalk.red(err));
    }
    console.log(ls.success, chalk.green('TEST COMPLETE'));
    console.log(ls.info, `DOWNLOAD: ${data.speeds.download} Mbps`);
    console.log(ls.info, `  UPLOAD: ${data.speeds.upload} Mbps`);
    //download speed threshold
    if (data.speeds.download < 10) {
      console.log(ls.warning, chalk.yellow('Download speeds below threshold! \n'));
      whine(data.speeds.download);
    } else {
      console.log(ls.success, chalk.green('Download speeds are acceptable!'));
      console.log(ls.info, chalk.blue(`${day} ${now.getDate()} ${month} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`));
    }
  })
}

function whine(dl){
  var message = `Download speed tested at ${dl} Mbps`;

  client.post('statuses/update', {status: message})
  .then(function (tweet) {
    console.log(ls.info, chalk.blue('------------------------------------------'));
    console.log(ls.info, chalk.blue(`Tweeted on ${day} ${now.getDate()} ${month} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`));
    console.log(ls.info, chalk.white(message));
    console.log(ls.info, chalk.blue('------------------------------------------'));
  })
  .then(function(){
    //process.exit(0);
  })
  .catch(function (error) {
    console.log(ls.error, chalk.red(error));
  })
}

//setInterval(testSpeed, 3600000);
testSpeed();
