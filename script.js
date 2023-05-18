// ==UserScript==
// @name         Zybooks Auto Answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto answers Zybooks multiple choice and short answer.
// @author       You
// @match        https://learn.zybooks.com/zybook/*/chapter/*/section/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //alert('lol');

    loop();

})();


function loop()
{ //  create a loop function

    const multipleChoiceQs = document.getElementsByClassName("question-set-question multiple-choice-question ember-view")
    if (multipleChoiceQs)
    {
        for (let i = 0; i < multipleChoiceQs.length; i++)
        {
            var question = multipleChoiceQs[i];

            var correct = false;
            var questionClass = null
            for (var j = 0; j < question.childNodes.length; j++) {
                var child = question.childNodes[j];
                if (!child.className)
                    continue;
                if (child.className == "question")
                    questionClass = child;

                else if (child.className.includes("explanation correct")) {
                    correct = true;
                }
            }
            if (!correct)
            {
                for (var j = 0; j < questionClass.childNodes.length; j++) {
                    if (questionClass.childNodes[j].className == "question-choices") {
                        var choices = questionClass.childNodes[j].childNodes;
                        var choiceIndexes = []
                        for (var k = 0; k < choices.length; k++)
                        {
                            if (choices[k].nodeType === Node.ELEMENT_NODE)
                                choiceIndexes.push(k);
                        }
                        var randomIndex = choiceIndexes[Math.floor(Math.random() * choiceIndexes.length)];//Math.floor(Math.random() * choices.length);
                        choices[randomIndex].getElementsByTagName("input")[0].click()
                        break;
                    }
                }
            }
        }

        const shortAnswers = document.getElementsByClassName("question-set-question short-answer-question ember-view")

        if (shortAnswers)
        {
            for (let i = 0; i < shortAnswers.length; i++)
            {
                var question = shortAnswers[i];
                var correct = false;
                for (var j = 0; j < question.childNodes.length; j++)
                {
                    if (!question.childNodes[j].className)
                        continue;
                    if (question.childNodes[j].className.includes("explanation correct"))
                        correct = true;
                }
                if (!correct)
                {

                    var showAnsButton = question.querySelector('button[class~="show-answer-button"]');
                    var forfeitAnswer = question.querySelector('span[class~="forfeit-answer"]');
                    if (!forfeitAnswer)
                    {
                        showAnsButton.click();
                        showAnsButton.click();
                    }
                    else
                    {
                        var textBox = question.querySelector('textarea[class~="ember-text-area"]');
                        textBox.value = forfeitAnswer.textContent;

                        const event = new Event('input', { bubbles: true});
                        textBox.dispatchEvent(event);

                        var checkButton = question.querySelector('button[class~="check-button"]');
                        checkButton.click();
                    }
                }

            }
        }

        setTimeout(function() {   //  call a 3s setTimeout when the loop is called
            loop()
        }, 1000)
    }
}
