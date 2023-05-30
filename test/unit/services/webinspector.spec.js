"use strict";

const { ServiceBroker } = require("moleculer");
const TestService = require("../../../services/webinspector.service");
const nock = require("nock");

describe("Test 'webinspector' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'webinspector.getwordcount' action", () => {
		it("should count words", async () => {
			nock("http://www.example.com")
				.get("/resource")
				.reply(
					200,
					"<html><body><h1>main title</h1><p>some words</body></html>"
				);
			const result = await broker.call("webinspector.getwordcount", {
				url: "http://www.example.com/resource",
			});
			expect(result).toEqual(4);
		});
	});

	//TODO: more tests would be needed in reality
});
