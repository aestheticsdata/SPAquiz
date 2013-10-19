define(function (require) {
	var 
		signals     = require('jssignals')
		questionsVo = require('classes/services/VO/questionsVO');


    return {
    	loaded: new signals.Signal(),
    	
	    getJson: function () {
	    	self = this;
	    	$.getJSON('questions.json', function (json) {

	        	questionsVo.allQuestions    = json.questions;
	        	questionsVo.questionsLength = questionsVo.allQuestions.length;

				self.loaded.dispatch();               
	    	});
	    }
    }
});