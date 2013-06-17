var BB = {
	
	regex	:	/\[([^\]]+)\](.*?)(?=\[\/\1\])\[\/\1\]/i,

	parseString : function(str){

		var response = [],
			match;
		while ((match = str.match(BB.regex))) {

			response.push({
				type		: 	match[1],
				text		: 	match[2],
				children 	: 	BB.parseString(match[2])
			});

			str = str.replace(match[0], '');

		}
		return response;
	}

};
