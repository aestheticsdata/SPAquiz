define(function(require) {
	var 
		Main        = require('classes/main'),
	 	QS          = require('classes/services/questionService'), 
	 	questionsVO = require('classes/services/VO/questionsVO'), 
	 	TS          = require('classes/services/templateService'), 
	 	templateVO  = require('classes/services/VO/templateVO');

	return {
		startupCompleted: new signals.Signal(),
		
		start: function () {
			var self = this;
			
			function onJsonLoaded() {
            	Main.initQuestions(questionsVO);
            	TS.getTemplate(); // this function call must be here because we have to be sure json is loaded
        	}

        	function onTemplateLoaded() {
            	Main.tplFunc = templateVO.tplFunc;
            	self.startupCompleted.dispatch();
        	}

        	QS.loaded.add(onJsonLoaded);
        	QS.getJson();

        	TS.loaded.add(onTemplateLoaded);
		}
	}
});