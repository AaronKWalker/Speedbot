var Twitter = require('twitter');
var config = require('./config.js');
var chalk = require('chalk');
var ls = require('log-symbols');
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});

var client = new Twitter(config);

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
  var now = new Date();
  day = days[now.getDay()];
  month = months[now.getMonth()];
  speedTest.visual({maxTime: 30000}, (err, data)=> {
    if (err) {
      console.log(ls.error, chalk.red(err));
    }
    console.log(ls.success, chalk.green('TEST COMPLETE'));
    console.log(ls.info, `DOWNLOAD: ${data.speeds.download} Mbps`);
    console.log(ls.info, `  UPLOAD: ${data.speeds.upload} Mbps`);
    //download speed threshold///////////////////////////
    if (data.speeds.download < 300) {
      console.log(ls.warning, chalk.yellow('Download speeds below threshold! \n'));
      whine(data.speeds.download, data.speeds.upload, now);
    } else {
      console.log(ls.success, chalk.green('Download speeds are acceptable!'));
      console.log(ls.info, chalk.blue(`${day} ${now.getDate()} ${month} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`));
    }
  })
}

function whine(dl, ul, now){
  var message = `Hey @ATT why is my internet speed ${dl}dn/${ul}up when I pay for Fiber? @ATTCares #ATT #speedtest #cedarparktowncenter #Ethernetport`;

  client.post('statuses/update', {status: message})
  .then(function (tweet) {
    console.log(ls.info, chalk.blue('------------------------------------------'));
    console.log(ls.info, chalk.blue(`Tweeted on ${day} ${now.getDate()} ${month} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`));
    console.log(ls.info, chalk.white(message));
    console.log(ls.info, chalk.blue(tweet.created_at));
    console.log(ls.info, chalk.blue('------------------------------------------ \n'));
  })
  .then(function(){
    //process.exit(0);
  })
  .catch(function (error) {
    console.log(ls.error, chalk.red(error));
  })
}

function begin(){
  var time = new Date();
  console.log(ls.warning, chalk.yellow('=========================================================='));
  console.log(ls.warning, chalk.yellow(`Speedbot initiated. ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()} \n`));
  setInterval(testSpeed, 3600000);
}

begin();
