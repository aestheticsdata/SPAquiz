require.config({
    paths:{
        'classes': 'classes',
        'jquery': 'libs/jquery',
        'lodash' : 'libs/lodash',
        'handlebars' : 'libs/handlebars'
    },
    shim: {
        'lodash': {
            exports: '_'
        }
    }
});

require(
    ['jquery', 'classes/main', 'classes/login'], function ($, Main, Login) {

        "use strict";

        var allQuestions,
            questionsLength;

        $(function () {

            allQuestions = [];

            localStorage.userName = 'joe';
            localStorage.password = '123';

            $.getJSON('questions.json', function (json) {

                allQuestions = json.questions;
                questionsLength = allQuestions.length;

                Main.setGlobals({allQuestions:allQuestions, questionsLength: questionsLength});
                Main.getTemplate();
            });
        });
});
