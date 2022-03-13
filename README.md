# restore

restore is a simple REST API which allows you to write and read JSON items of your choice.

## How to use it

A `POST /items` saves an item, e.g. with [httpie](https://httpie.io/):
```echo -n '{"id": "", "body":"{ glossary: { title: 'example glossary' } }"}' | http POST https://json-restore.herokuapp.com/items Authorization:'Bearer <API_KEY>'```

A `GET /items/:id` retrieves an item, e.g.:
```http https://json-restore.herokuapp.com/items/<ITEM_ID> Authorization:'Bearer <API_KEY>'```

## How to run locally

clone & cd, then

```
npm i
npm run dev
```

Note you will need a local [MongoDB](https://www.mongodb.com/) instance running for restore to connect to.