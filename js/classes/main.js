define(['classes/Login', 'lodash', 'handlebars'], function (Login, _, Handlebars) {
	
	var mainWrapper = {},
		allQuestions,
        questionsLength,
        warn = $('#warnValidate'),
        intituleDiv = $('#intitule'),
        checked = false,
        currentQuestion = 0,
        storedAnswers = [],
        firstChange = true,
        score = 0,
        $backButton = $('#backButton'),
        $nextButton = $('#nextButton'),
        $choices    = $('#choices'),
        tplFunc;
	
    mainWrapper.setGlobals = function (o) {
    	allQuestions    = o.allQuestions;
    	questionsLength = o.questionsLength;
    };

	mainWrapper.getTemplate = function () {
        var self = this,
        	tpl;
            
        $.get('templates/questions.tpl.html', function (loadedTpl) {

            tpl = loadedTpl;
            tplFunc = Handlebars.compile(tpl);

            Login.init(self);
        });
    };

    mainWrapper.init = function () {

            $('#afterLogin').show();

            warn.hide();
            warn.html('you have to select an answer');

            mainWrapper.makeQuestions();

            mainWrapper.initListener();
    };
    
    mainWrapper.makeQuestions = function () {

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

            mainWrapper.makeRadioListener();
    };
       
    mainWrapper.nextQuestion = function (end) {

            if (storedAnswers[currentQuestion+1] === undefined) {
                checked = false;
            }

            $choices.fadeTo(200, 0, function () {

                $('#questions').find('li').remove();

                if (!end)  {
                    currentQuestion += 1;
                    mainWrapper.makeQuestions();
                }  else {
                    mainWrapper.computeScore();
                    intituleDiv.html('RESULTS');
                    $('#score').html('your score is : ' + score);
                    $nextButton.hide();
                    $backButton.hide();
                }

                if (currentQuestion > 0 && currentQuestion < questionsLength-1) {
                    $backButton.show();
                }
            });
    };
    
    mainWrapper.previousQuestion = function () {

            checked = true;
            warn.hide();

            $choices.fadeTo(200, 0, function () {

                $('#questions').find('li').remove();

                currentQuestion -= 1;

                mainWrapper.makeQuestions();

                if (currentQuestion > 0) {
                    $backButton.show();
                } else {
                    $backButton.hide();
                }
            });
    };
    
    mainWrapper.computeScore = function () {

            for (var i=0; i<questionsLength; i+=1) {
                if (storedAnswers[i] === allQuestions[i].correctAnswer) {
                    score += 1;
                }
            }
    };
    
    mainWrapper.makeRadioListener = function () {

            var $inputAnswer = $('input[name="answerRadio"]');

            $inputAnswer.on('change', function () {

                checked = true;
                warn.hide();
                if (storedAnswers[currentQuestion] !== undefined) {
                    firstChange = false;
                }
                storedAnswers[currentQuestion] = parseInt($inputAnswer.filter(':checked').val(), 10);
            });
    };
    
    mainWrapper.initListener = function () {

            $nextButton.on('click', function (e) {

                e.preventDefault();

                if (checked) {
                    if (currentQuestion < questionsLength-1) {
                        mainWrapper.nextQuestion();
                    } else {
                        mainWrapper.nextQuestion('end');
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
                currentQuestion > 0 && mainWrapper.previousQuestion();
            });
    };

    return mainWrapper;
});