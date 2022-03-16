const axios = require('axios');

const apiKeyValid = process.env.API_KEY_VALID;
const testItemKey = process.env.TEST_ITEM_KEY;
const testItemOtherOwnerId = process.env.TEST_ITEM_OTHER_OWNER_ID;

const testObject = {
	glossary: {
		title: 'example glossary'
	},
};

// test('unauthenticated request fails', async () => {
// 	expect(async () => await axios.get('http://localhost:3000')).rejects.toThrow('Request failed with status code 401');
// });

test('creates item', async () => {
	const testGeneratedItemKey = "test_item_key";

	const response = await axios({
		method: 'post',
		url: 'http://localhost:3000/api/v1/items',
		headers: { Authorization: `Bearer ${apiKeyValid}` },
		data: {
			key: testGeneratedItemKey,
			value: testObject
		},
	});

	expect(response.status).toBe(200);
	expect(response.data).toBe(testGeneratedItemKey);
});

test('retrieves own item', async () => {
	const response = await axios({
		method: 'get',
		url: `http://localhost:3000/api/v1/items/${testItemKey}`,
		headers: { Authorization: `Bearer ${apiKeyValid}` },
	});

	expect(response.status).toBe(200);
	expect(response.data).toEqual({
		key: testItemKey,
		value: testObject,
	});
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
