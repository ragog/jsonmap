# jsonmap

jsonmap is a simple REST API which allows you to write JSON payloads of your choice and retrieve them later.

> **WARNING**: jsonmap is not meant for credentials storage - do not use it to save confidential data

## Getting started

To get started, get your API key from [jsonmap.site](https://jsonmap.site) and store it somewhere safe - you will not be shown your API key again.

Now you can store your first item to retrieve at a later time. An item is identified by a `key` and contains a `value`, e.g.:

```json
{
    "note": {
        "title": "this is an example note"
    }
}
```

Let's create the above item by first saving the above in a file, say `item.json`, then passing that file into our API call:

```bash
$ http PUT https://jsonmap.site/api/v1/items/my-first-item Authorization:'Bearer <MY_API_KEY>' < item.json
```

> **NOTE:** creating a new item with an existing key will overwrite the existing item. 

We can then retrieve this item when needed:

```bash
$ http https://jsonmap.site/api/v1/items/<ITEM_ID> Authorization:'Bearer <MY_API_KEY>'
```

## API

All API endpoints require authentication via Bearer token:

`Authorization: 'Bearer <MY_API_KEY>'`

### Create item

`PUT https://jsonmap.site/api/v1/items/:key`

#### Path params

* key: the item's unique key

#### Body

* the content of the item in JSON format

### Retrieve item

`GET https://jsonmap.site/api/v1/items/:key`

#### Path params

* key: the item's unique key

### Retrieve all items

`GET https://jsonmap.site/api/v1/items`

### Remove item

`DELETE https://jsonmap.site/api/v1/items/:key`

#### Path params

* key: the item's unique key

## How to run locally for development

clone & cd, then

```
npm i
npm run dev
```

Note you will need a local [MongoDB](https://www.mongodb.com/) instance running for jsonmap to connect to.