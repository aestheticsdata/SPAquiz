require.config({
	paths:{
		classes: 'classes',
		'jquery': 'libs/jquery',
		'underscore' : 'libs/underscore',
        'handlebars' : 'libs/handlebars',
        'backbone' : 'libs/backbone'
	},
    shim: {
        'underscore': {
            exports: '_'
        }
    }
});

require(
	['jquery', 'underscore', 'handlebars'], function ($, _, Handlebars) {


        "use strict";

        var allQuestions;
        var questionsLength;
        var warn = $('#warnValidate');
        var intituleDiv = $('#intitule');
        var checked = false;
        var currentQuestion = 0;
        var storedAnswers = [];
        var firstChange = true;
        var score = 0;
        var $backButton = $('#backButton');
        var $nextButton = $('#nextButton');
        var $choices    = $('#choices');
        var $login = $('#login');
        var tpl;
        var tplFunc;



        $(function () {

            console.log('ready');
            allQuestions = [];

            localStorage.userName = 'joe';
            localStorage.password = '123';

            $.getJSON('questions.json', function (json) {

                allQuestions = json.questions;
                questionsLength = allQuestions.length;

                getTemplate();
                 //login();
            });
        });

        function getTemplate() {

            $.get('templates/questions.tpl.html', function (loadedTpl) {

                tpl = loadedTpl;
                tplFunc = Handlebars.compile(tpl);

                login();
            });
        }



        function login() {

            $('#welcomeName').text(getCookies('name'));

//            $login.find('input[type="submit"]').on('click', function () {

              $login.find('#signin_button').on('click', function (e) {
                e.preventDefault();
                var userName = $('#userName').val();
                var password = $('#password').val();
                if (localStorage.userName === userName && localStorage.password === password) {
                    // $login.hide();
                    $login.empty();
                    init();
                } else {
                    $('#wrongLogin').text('wrong name/password');
                }
            });
        }

        function init() {

            console.log('init');

            $('#afterLogin').show();

            warn.hide();
            warn.html('you have to select an answer');

            makeQuestions();

            initListener();
        }

        function makeQuestions() {

            intituleDiv[0].innerHTML = allQuestions[currentQuestion].question;

            var answers = allQuestions[currentQuestion].choices;

            var currentStored = storedAnswers[currentQuestion];

            /*for (var i=0; i<answers.length; i++) {
                $choices.append('<li><input type="radio" name="answerRadio" '+
                    (currentStored !== undefined && currentStored === i ? 'checked="on"' : '') +
                    ' value="'+i+
                    '"></input>'+answers[i]+'</li>');
            }*/

            /* var i = 0;
             answers.forEach(function (item) {
                 $choices.append('<li><input type="radio" name="answerRadio" '+
                     (currentStored !== undefined && currentStored === i ? 'checked="on"' : '') +
                     ' value="'+i+
                     '"></input>'+item+'</li>');
                 i++;
             });*/


            var answersContext = {};
            var i;
            answersContext.questions = answers;
            $choices.append(tplFunc(answersContext));
            currentStored !== undefined && (i = currentStored);
            $choices.children()
                    .eq(i)
                    .children()
                    .attr('checked', 'on');

            $choices.fadeTo(200, 1);

            makeRadioListener();
        }

        function nextQuestion(end) {

            if (storedAnswers[currentQuestion+1] === undefined) {
                checked = false;
            }

            $choices.fadeTo(200, 0, function () {

                $('#questions').find('li').remove();

                if (!end)  {
                    currentQuestion += 1;
                    makeQuestions();
                }  else {
                    computeScore();
                    intituleDiv.html('RESULTS');
                    $('#score').html('your score is : ' + score);
                    $nextButton.hide();
                    $backButton.hide();
                }

                if (currentQuestion > 0 && currentQuestion < questionsLength-1) {
                    $backButton.show();
                }
            });
        }

        function previousQuestion() {

            checked = true;
            warn.hide();

            $choices.fadeTo(200, 0, function () {

                $('#questions').find('li').remove();

                currentQuestion -= 1;

                makeQuestions();

                if (currentQuestion > 0) {
                    $backButton.show();
                } else {
                    $backButton.hide();
                }
            });
        }

        function computeScore() {

            for (var i=0; i<questionsLength; i+=1) {
                if (storedAnswers[i] === allQuestions[i].correctAnswer) {
                    score += 1;
                }
            }
        }

        function makeRadioListener() {

            var $inputAnswer = $('input[name="answerRadio"]');

            $inputAnswer.on('change', function () {

                checked = true;
                warn.hide();
                if (storedAnswers[currentQuestion] !== undefined) {
                    firstChange = false;
                }
                storedAnswers[currentQuestion] = parseInt($inputAnswer.filter(':checked').val(), 10);
            });
        }

        function initListener() {

            $nextButton.on('click', function (e) {

                e.preventDefault();

                if (checked) {
                    if (currentQuestion < questionsLength-1) {
                        nextQuestion();
                    } else {
                        nextQuestion('end');
                    }
                } else {
                    warn.show();
                }
            });

            $backButton.on('click', function (e) {

                e.preventDefault();

                /*if (currentQuestion > 0) {
                    previousQuestion();
                }*/
                currentQuestion > 0 && previousQuestion();
            });
        }

        function getCookies(value) {

            var list = document.cookie.split("; ");
            var theName = 'unknown';
            for (var i=0; i< list.length; i++) {
                var cookie = list[i];
                if (!cookie.indexOf(value)) {
                    var index = cookie.indexOf('=');
                    theName = cookie.substring(index+1);
                }
            }
            return theName;
        }
});
