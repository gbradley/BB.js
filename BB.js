var BB = function(setup){
	setup = setup || {};
	this.validTags = setup.validTags || null;
	this.ignoreCase = setup.ignoreCase || false;

	this._attributeValidators = {};
};

BB.prototype = {

	setAttributeValidator : function(attribute, callback){

		var validators = this._attributeValidators;
		
		if (!(attribute in validators)){
			validators[attribute] = [];
		}

		validators[this.ignoreCase ? attribute.toLowerCase() : attribute].push(callback);
		return true;
	},
	
	toJSON	: function(str){

		/*
		Matches
		- opening bracket
		- an optional forward slash (denoting a close tag)
		THEN:
			- a matching tag name
		OR
			- any (lazy) number of characters except closing brackets
			- any character except a backslash
		- any attributes
		- closing bracket
		*/

		var ignoreCase = this.ignoreCase,
			validators = this._attributeValidators,
			re = RegExp("\\[(\\/?)"+(this.validTags ? "("+this.validTags.join("|")+")" : "([^\\]]*?[^\\\\])")+"(?:[=\\s].*?)?\\]", "g"+(ignoreCase ? "i" : "")),
			attrRe = /([^\[\s]+?)=('|")?([^\2\]]+)\2/g,
			trimRe = /(^\s+)|(\s+$)/,
			tagList = [],
			lastIndex = 0;
		
		function parse(str, parent){

			while ((match = re.exec(str)) && re.lastIndex > lastIndex){

				lastIndex = re.lastIndex;

				// we don't have lookbehind, so we have to check for leading escaped bracket manually
				var prevIndex = lastIndex  - match[0].length - 1;
				if (prevIndex > 0 && str.substring(prevIndex, prevIndex + 1) == '\\'){
					continue;
				}

				var tag = ignoreCase ? match[2].toLowerCase() : match[2];

				if (match[1]){
					// closing tag

					// does the tag match the last opening tag?
					var l = tagList.length;
					if (l && tagList[l-1].tag == tag){

						// pop the opening tag off the list
						var opening = tagList.pop();

						// determine the inner text
						parent.innerCode = str.substring(opening.index, re.lastIndex - match[0].length);
						parent.innerText = parent.innerCode.replace(re,'');

						return parent;

					} else {
						// didn't match a closing tag, so throw an error
						throw new Error("Invalid closing tag");
					}

				} else {
					// opening tag

					// check for attributes
					var attrs = {},
						attrStr = match[0],
						attrMatch, attribute, value, callbacks;
					while ((attrMatch = attrRe.exec(attrStr))){

						attribute = attrMatch[1];
						value = attrMatch[3];
						callbacks = validators[ignoreCase ? attribute.toLowerCase() : attribute] || validators['*'];

						if (callbacks && callbacks.length){
							for (var i = 0; i < callbacks.length; i++){
								if (!(callbacks[i](attribute, value, tag))){
									throw new Error("Invalid attribute '"+attribute+"' with value '"+value+"' in tag '"+tag+"'");
								}
							}
						}


						attrs[attribute] = value;
					}
					attrRe.lastIndex = 0;

					// add to the tagList, and create a new child element
					tagList.push({
						tag : tag,
						index : re.lastIndex
					});

					var child = {
						tag 		: tag,
						innerCode	: '',
						innerText	: '',
						children	: [],
						attributes	: attrs
					};

					parent.children.push(child);
					parse(str, child);

				}
			}

			return parent;
		}

		result = parse(str, {
			tag 		: '',
			innerCode	: str,
			innerText	: str.replace(re,''),
			children	: [],
			attributes	: {}
		});

		if (tagList.length){
			throw new Error("Invalid number of closing tags");
		}
		
		return result;

	}

};
