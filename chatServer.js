/*
chatServer.js
Author: Hathaitorn Rojnirun (hr346@cornell.edu)
Modified from original chatServer.js by David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function () {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function (socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function () {// we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hi there! I am a simple chat bot to motivate you to stay healthy. ('-') "); //We start with the introduction;
    setTimeout(timedQuestion, 3000, socket, "What is your Name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum);	// run the bot function with the new message
  });
  socket.on('disconnect', function () { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hiya ' + input + ' :D';// output response
    waitTime = 2000;
    question = 'How many glasses of water have you drunk today?';			    	// load next question
  }
  else if (questionNum == 1) {
    if (parseInt(input) < 8 && parseInt(input) >= 0) {
      socket.emit('changeBG', '#4FC3F7');
      answer = 'You should drink ' + (8 - parseInt(input) + ' more glasses of water today to stay hydrated.');
      waitTime = 3000;
      question = 'What\'s your favorite fruit?';			    	// load next question
    }
    else if (parseInt(input) >= 8) {
      socket.emit('changeBG', '#4FC3F7');
      answer = 'Awesome! Drinking enough water is good for your body!';
      waitTime = 3000;
      question = 'What\'s your favorite fruit?';			    	// load next question
    }
    else {
      answer = 'I did not understand you. Can you please answer with a positive number.';
      waitTime = 2000;
      question = 'How many glasses of water have you drunk today?';
      questionNum = 0; // Here we go back in the question number 1
    }
  }
  else if (questionNum == 2) {
    if (input.toLowerCase() === 'raspberry') {
      socket.emit('changeBG', '#F48FB1');
      answer = 'Yeah! Cool kids like RASPBERRY 8-)';
      waitTime = 3000;
      question = 'What about your favorite meat?';			    	// load next question
    }
    else {
      socket.emit('changeBG', '#F48FB1');
      answer = input + ' huh, nice! My favorite fruit is Raspberry!';
      waitTime = 3000;
      question = 'What about your favorite meat?';			    	// load next question
    }
  }
  else if (questionNum == 3) {
    answer = 'OMG I like ' + input + ' too!';
    waitTime = 2000;
    question = 'Have you eaten any veggies today?';			    	// load next question
  }
  else if (questionNum == 4) {
    if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'yeah' || input.toLowerCase() === 'yep' || input === 1) {
      socket.emit('changeBG', '#CDDC39');
      answer = 'Perfect! You\'re eating healthy.';
      waitTime = 2000;
      question = 'Do you play any sports?';			    	// load next question
    }
    else if (input.toLowerCase() === 'no' || input.toLowerCase() === 'nah' || input.toLowerCase() === 'nope' || input === 0) {
      socket.emit('changeBG', '#CDDC39');
      answer = 'It\'s a good idea to eat some veggies daily. Maybe you can start with broccoli :D'
      waitTime = 3000;
      question = 'Do you play any sports?';			    	// load next question
    } else {
      answer = ' I did not understand you. Can you please answer with simply yes or no.';
      question = 'Have you eaten any veggies today?';
      questionNum = 3; // Here we go back in the question number 4
      waitTime = 0;
    }
  }
  else if (questionNum == 5) {
    if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'yeah' || input.toLowerCase() === 'yep' || input === 1) {
      socket.emit('changeBG', '#FFEB3B');
      answer = 'Cool!';
      waitTime = 1000;
      question = 'What sport do you usually play?';			    	// load next question
    }
    else if (input.toLowerCase() === 'no' || input.toLowerCase() === 'nah' || input.toLowerCase() === 'nope' || input === 0) {
      socket.emit('changeBG', '#FFEB3B');
      answer = 'Excercise keeps you healthy. Maybe you can try something simple, like running :-)'
      question = 'How does that sounds?';			    	// load next question
      waitTime = 3000;
      questionNum = 7;
    } else {
      answer = ' I did not understand you. Can you please answer with simply yes or no.';
      question = 'Do you play any sports?';
      waitTime = 2000;
      questionNum = 4; // Here we go back in the question number 5
    }
  }
  else if (questionNum == 6) {
    answer = 'You know, if I\'m not a chatbot, I would be #1 at ' + input +'!';
    waitTime = 2000;
    question = 'I gtg. It was fun chatting with you! Let\'s chat again some time! :-D';			    	// load next question
    questionNum = 7;
  }
  else if (questionNum == 7) {
    if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'yeah' || input.toLowerCase() === 'yep' || input === 1) {
      answer = 'Alright!';
      waitTime = 2000;
      question = 'Hope you stay healthy, let\'s chat next time';			    	// load next question
    }
    else if (input.toLowerCase() === 'no' || input.toLowerCase() === 'nah' || input.toLowerCase() === 'nope' || input === 0) {
      answer = 'Well, maybe you can try other sports your friends like. :D'
      question = 'I gtg, but try to stay healthy okay?! :D';			    	// load next question
      waitTime = 3000;
    }
  }
  else if(questionNum == 8){
    answer = 'Bye Bye! (^_^)';// output response
    socket.emit('changeBG', '#5E35B1');
    socket.emit('changeFont', 'white');
    waitTime = 0;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  }
  else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//