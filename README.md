# jsonmap

![](https://api.checklyhq.com/v1/badges/groups/261335?style=plastic&theme=default)

jsonmap is a simple REST API which allows you to store and retrieve JSON payloads of your choice.

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

Or, with cURL:

```bash
$ curl -X PUT -H "Authorization: Bearer <MY_API_KEY>" -d @item.json https://jsonmap.site/api/v1/items/my-first-item
```

> **NOTE:** creating a new item with an existing key will overwrite the existing item. 

We can then retrieve this item when needed:

```bash
$ http https://jsonmap.site/api/v1/items/<ITEM_ID> Authorization:'Bearer <MY_API_KEY>'
```

Or, with cURL:

```bash
$ curl -H "Authorization: Bearer <MY_API_KEY>" https://jsonmap.site/api/v1/items/<ITEM_ID>
```

## API

All API endpoints require authentication via Bearer token:

`Authorization: 'Bearer <MY_API_KEY>'`

The base URL for the API is:

`https://jsonmap.site/api`

### Create item

`PUT /v1/items/:key`

#### Path params

* key: the item's unique key

#### Body

* the content of the item in JSON format

#### Example

```bash
$ http PUT https://jsonmap.site/api/v1/items/my-first-item Authorization:'Bearer <MY_API_KEY>' < item.json
```

Where `item.json` could be:

```json
{
	"name": "dodge charger 2.2",
	"miles_per_Gallon": 36,
	"cylinders": 4,
	"displacement": 135,
	"horsepower": 84,
	"weight_in_lbs": 2370,
	"acceleration": 13,
	"year": "1982-01-01",
	"origin": "USA"
}
```

### Retrieve item

`GET /v1/items/:key`

#### Path params

* key: the item's unique key

#### Example

```bash
$ http https://jsonmap.site/api/v1/items/my-first-item Authorization:'Bearer <MY_API_KEY>'
```

### Retrieve all items

`GET /v1/items`

 Authorization:'Bearer <MY_API_KEY>`

#### Example

```bash
$ http https://jsonmap.site/api/v1/items Authorization:'Bearer <MY_API_KEY>'
```

```json
[
    {
        "key": "dodge-charger",
        "value": {
            "acceleration": 13,
            "cylinders": 4,
            "displacement": 135,
            "horsepower": 84,
            "miles_per_Gallon": 36,
            "name": "dodge charger 2.2",
            "origin": "USA",
            "weight_in_lbs": 2370,
            "year": "1982-01-01"
        }
    },
    {
        "key": "my-first-item",
        "value": {
            "note": {
                "title": "this is an example note"
            }
        }
    }
]
```

### Remove item

`DELETE /v1/items/:key`

#### Path params

* key: the item's unique key

#### 

## How to run locally for development

clone & cd, then

```
export DB_URL=path_to_your_local_mongodb
npm i
npm run dev
```

Note you will need a local [MongoDB](https://www.mongodb.com/) instance running for jsonmap to connect to.