var Twitter = require('twitter');
var config = require('./config.js');
var chalk = require('chalk');
var ls = require('log-symbols');
var speedTest = require('speedtest-net');
var test = speedTest({maxTime: 5000});

var client = new Twitter(config);

function whine(){
  client.post('statuses/update', {status: 'testing no.6'})
  .then(function (tweet) {
    console.log(chalk.bgRed.yellow(tweet.created_at));
  })
  .then(function(){
    process.exit(0);
  })
  .catch(function (error) {
    throw error;
  })
}

function testConsole(){
  console.log(ls.success, chalk.green('Success!'));
  console.log(ls.info, chalk.blue('Info'));
  console.log(ls.warning, chalk.yellow('Warning!'));
  console.log(ls.error, chalk.red('Error!'));
}

testConsole();
