BB.js
=====

Add the script, then call like so:

    var obj = BB.parseString("[span]Hello [span]World[/span][/span]");
    
This will give you back an array with nested objects. An easy way to check the output is to convert the `obj` into a JSON string like this:

    var jsonStr = JSON.stringify(obj);
    
(not sure which versions of IE have native JSON, maybe 9+.) Then copy/paste this into jsonlint.org and you'll get a nicely formatted display of the object like this:

    [
        {
            "type": "span",
            "text": "Hello [span]World[/span]",
            "children": [
                {
                    "type": "span",
                    "text": "World",
                    "children": []
                }
            ]
        }
    ]
