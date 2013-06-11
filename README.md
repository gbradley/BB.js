BB.js
=====

Add the script, then call like so:

    var arr = BB.parseString("[select][question]How are you?[/question][answer]I am fine[/answer][/select]");
    
This will give you back an array with nested objects. An easy way to check the output is to convert `arr` into a JSON string like this:

    var jsonStr = JSON.stringify(arr);
    
(not sure which versions of IE have native JSON, maybe 9+.) Then copy/paste this into jsonlint.org and you'll get a nicely formatted display of the array like this:

    [
        {
            "type": "select",
            "text": "[question]How are you?[/question][answer]I am fine[/answer]",
            "children": [
                {
                    "type": "question",
                    "text": "How are you?",
                    "children": []
                },
                {
                    "type": "answer",
                    "text": "I am fine",
                    "children": []
                }
            ]
        }
    ]
