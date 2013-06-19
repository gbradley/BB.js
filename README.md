BB.js
=====

Add the script, then create an instance like so:

    var bb = new BB();
    
The constructor optionally accepts a setup object with the following properties, or you can assign them directly to the instance.

    ignoreCase        A boolean denoting whether tags and attributes should be case sensitive. The default is true.
    validTags         An array of valid tag names. If provided, an exception will be thrown if tags are found that do not exist here.
    
Now you can create a JSON object from a BBCode string:

    var json = bb.toJSON("Let's do [hello]world[/hello]!");
    
This will give you back a nested object with the following properties.

    tag             The BBCode tag
    innerCode       The content of the tag, including child tags
    innerText       The content of the tag, excluding child tags
    attributes      An object with attribute/value pairs
    children        An array of any child tags

Note that the top-level object always has an empty `tag`.

An easy way to check the output is to convert `json` into a JSON string like this:

    var jsonStr = JSON.stringify(json);
    
(not sure which versions of IE have native JSON, maybe 9+.) Then copy/paste this into jsonlint.org and you'll get a nicely formatted display of the object like this:

    {
        "tag": "",
        "innerCode": "Let's do [hello]world[/hello]!",
        "innerText": "Let's do world!",
        "children": [
            {
                "tag": "hello",
                "innerCode": "world",
                "innerText": "world",
                "children": [],
                "attributes": {}
            }
        ],
        "attributes": {}
    }
