"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/wordcount.service");

describe("Test 'wordcount' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	//mock wordcounter
	broker.createService({
		name: "webinspector",
		actions: {
			async getwordcount() {
				return 1;
			},
		},
	});

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'wordcount.at_url' action", () => {
		it("should reject a missing url with a ValidationError", async () => {
			expect.assertions(1);
			try {
				await broker.call("wordcount.at_url");
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
			}
		});

		it("should reject an invalid url with a ValidationError", async () => {
			expect.assertions(1);
			try {
				await broker.call("wordcount.at_url", { url: "notvalid" });
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
			}
		});

		it("should accept a valid url", async () => {
			const result = await broker.call("wordcount.at_url", {
				url: "http://www.google.com",
			});
			expect(result).toEqual({ count: 1 });
		});
	});
});
