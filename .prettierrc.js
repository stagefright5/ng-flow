const prettierConfig = {
	"printWidth": 120,
	"singleQuote": true,
	"quoteProps": "as-needed",
	"trailingComma": false,
	"useTabs": true,
	"tabWidth": 4,
	"semi": true,
	"bracketSpacing": true,
	"arrowParens": "avoid",
	/**
		 By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer,
		e.g. GitHub comment and BitBucket. In some cases you may want to rely on editor/viewer soft wrapping instead,
		so this option allows you to opt out with "never".
   		Valid options:
   		"always" - Wrap prose if it exceeds the print width.
   		"never" - Do not wrap prose.
   		"preserve" - Wrap prose as-is. 
	 */
	//  proseWrap: "<always|never|preserve>"
}

module.exports = prettierConfig;