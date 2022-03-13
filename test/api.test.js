const axios = require('axios');
const uuid = require('uuid');

const apiKeyValid = process.env.API_KEY_VALID;
const testItemId = process.env.TEST_ITEM_ID;
const testItemOtherOwnerId = process.env.TEST_ITEM_OTHER_OWNER_ID;

const testObject = {
	glossary: {
		title: 'example glossary'
	},
};

test('unauthenticated request fails', async () => {
	expect(async () => await axios.get('http://localhost:3000')).rejects.toThrow('Request failed with status code 401');
});

test('creates item', async () => {
	const testGeneratedItemId = uuid.v4();

	const response = await axios({
		method: 'post',
		url: 'http://localhost:3000/items',
		headers: { Authorization: `Bearer ${apiKeyValid}` },
		data: {
			id: testGeneratedItemId,
			body: testObject,
		},
	});

	expect(response.status).toBe(200);
	expect(response.data).toBe(testGeneratedItemId);
});

test('retrieves own item', async () => {
	const response = await axios({
		method: 'get',
		url: `http://localhost:3000/items/${testItemId}`,
		headers: { Authorization: `Bearer ${apiKeyValid}` },
	});

	expect(response.status).toBe(200);
	expect(response.data).toEqual({
		id: testItemId,
		body: testObject,
	});
});

test('cannot retrieve item from different owner', async () => {
	expect(async () => {
		await axios({
			method: 'get',
			url: `http://localhost:3000/items/${testItemOtherOwnerId}`,
			headers: { Authorization: `Bearer ${apiKeyValid}` },
		}).rejects.toThrow('Request failed with status code 404');
	});
});
