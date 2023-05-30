const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const HTTPClientService = require("moleculer-http-client");

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;

const IGNORE_TAG_NAMES = [
	"HEAD",
	"STYLE",
	"SCRIPT",
	"NOSCRIPT",
	"IFRAME",
	"OBJECT",
];
const WORDS_REGEX = /\b\S+\b/g;

function count_words_in_element(elm) {
	let word_count = 0;
	// exclude elements with invisible text nodes
	if (IGNORE_TAG_NAMES.includes(elm.tagName) == false) {
		if (elm.nodeType == ELEMENT_NODE || elm.nodeType == DOCUMENT_NODE) {
			//recursively call this method on all child nodes
			for (let i = 0; i < elm.childNodes.length; i++) {
				word_count =
					word_count + count_words_in_element(elm.childNodes[i]);
			}
		} else if (elm.nodeType == TEXT_NODE) {
			//no child nodes - count the words
			if (elm.nodeValue !== null) {
				const num_words = (
					(elm.nodeValue || "").match(WORDS_REGEX) || []
				).length;
				// if (num_words) {
				// 	console.log(elm.nodeValue);
				// 	console.log(num_words);
				// }
				word_count = word_count + num_words;
			}
		}
	}
	return word_count;
}

module.exports = {
	name: "webinspector",
	mixins: [HTTPClientService],
	actions: {
		async getwordcount(ctx) {
			//get the content from provided url
			const html = await this._get(ctx.params.url, {
				resolveBodyOnly: true,
			});
			if (html == null) {
				return null;
			}
			//build dom and return wordcount of body element
			const dom = new JSDOM(html);
			return count_words_in_element(dom.window.document.body);
		},
	},
};
