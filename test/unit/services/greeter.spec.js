"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../../services/greeter.service");

describe("Test 'greeter' service", () => {
	let broker = new ServiceBroker({ logger: false });
	const service = broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' action", () => {

		it("should return with 'Hello Moleculer'", async () => {
			const res = await broker.call("greeter.hello");
			expect(res).toBe("Hello Moleculer");
		});

	});

	describe("Test 'greeter.welcome' action", () => {

		it("should return with 'Welcome'", async () => {
			const res = await broker.call("greeter.welcome", { name: "Adam" });
			expect(res).toBe("Welcome, Adam");
		});

		it("should reject an ValidationError", async () => {
			expect.assertions(1);
			try {
				await broker.call("greeter.welcome");
			} catch(err) {
				expect(err).toBeInstanceOf(ValidationError);
			}
		});

	});

	describe("Test MongoDB", () => {
		it("should add a new record to the database", async () => {
			const res = await broker.call("greeter.create", {name: "Vitali", purpose: "test"});
			const record = await broker.call("greeter.get", {id: res._id.toString()});
			console.log(JSON.stringify(record, null, 2));
			expect(res.name).toEqual(record.name);
			await service.adapter.clear();
		});
	});

});

