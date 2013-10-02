define( ['jquery'], function ($) {

    var jsonQuestions;

    $.getJSON('questions.json', function (json) {
        jsonQuestions = json;
    });

    return {allQuestion: jsonQuestions};
});