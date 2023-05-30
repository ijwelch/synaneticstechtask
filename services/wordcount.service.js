"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "wordcount",

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Get the count of words at a web page (from the webinspector service)
		 *
		 * @param {String} url - a web url
		 */
		at_url: {
			rest: { method: "GET", path: "/at_url" },
			params: {
				url: { type: "url" },
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const url_string = ctx.params.url;
				const result = await ctx.call("webinspector.getwordcount", {
					url: url_string,
				});
				return { count: result };
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
