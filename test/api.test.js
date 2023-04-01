const axios = require('axios');
const uuid = require('uuid');

const apiKeyValid = process.env.API_KEY_VALID;
const testItemOtherOwnerId = process.env.TEST_ITEM_OTHER_OWNER_ID;
let testGeneratedItemKey;

const testObject = {
	glossary: {
		title: 'example glossary',
	},
};

test('retrieves items', async () => {
	const response = await axios({
		method: 'get',
		url: 'http://localhost:3000/api/v1/items',
		headers: { Authorization: `Bearer ${apiKeyValid}` },
	});

	expect(response.status).toBe(200);
	expect(response.data).toEqual(expect.any(Array));
});

test('creates item', async () => {
	testGeneratedItemKey = uuid.v4();

	const response = await axios({
		method: 'put',
		url: `http://localhost:3000/api/v1/items/${testGeneratedItemKey}`,
		headers: { Authorization: `Bearer ${apiKeyValid}` },
		data: testObject
	});

	expect(response.status).toBe(200);
	expect(response.data).toBe(testGeneratedItemKey);
});

test('retrieves own item', async () => {
	const response = await axios({
		method: 'get',
		url: `http://localhost:3000/api/v1/items/${testGeneratedItemKey}`,
		headers: { Authorization: `Bearer ${apiKeyValid}` },
	});

	expect(response.status).toBe(200);
	expect(response.data).toEqual(testObject);
});

test('cannot retrieve item from different owner', async () => {
	expect(async () => {
		await axios({
			method: 'get',
			url: `http://localhost:3000/api/v1/items/${testItemOtherOwnerId}`,
			headers: { Authorization: `Bearer ${apiKeyValid}` },
		}).rejects.toThrow('Request failed with status code 404');
	});
});

test('deletes own item', async () => {
	expect(async () => {
		const response = await axios({
			method: 'delete',
			url: `http://localhost:3000/api/v1/items/${testGeneratedItemKey}`,
			headers: { Authorization: `Bearer ${apiKeyValid}` },
		})

		expect(response.status).toBe(200);
	});
});