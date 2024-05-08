### Reproduction

yarn 
yarn start
and perform the sample query to get the decorators of a transaction.

### Sample query

```
query {
  users(ids: ["1", "2"]) {
    username
    id
    reviews {
      id
    }
  }
  transactions(first:2, ids: ["tx1", "tx2", "tx3"]) {
    edges {
      node {
        __typename
        id
        ...on CardTransaction {
          id
          accountId
        }
        ...on SEPACreditTransferTransaction {
          id
          accountId
          decorators {
            id
        	}
        }
      }
    }
  }
```

### Result

```
{
  "errors": [
    {
      "message": "Cannot return null for non-nullable field SEPACreditTransferTransaction.decorators.",
      "locations": [
        {
          "line": 52,
          "column": 10
        }
      ],
      "path": [
        "transactions",
        "edges",
        0,
        "node",
        "decorators"
      ]
    },
    {
      "message": "Cannot return null for non-nullable field SEPACreditTransferTransaction.decorators.",
      "locations": [
        {
          "line": 52,
          "column": 10
        }
      ],
      "path": [
        "transactions",
        "edges",
        2,
        "node",
        "decorators"
      ]
    }
  ],
  "data": {
    "users": [
      {
        "username": "hanshotfirst",
        "id": "1",
        "reviews": [
          {
            "id": "tx1"
          }
        ]
      },
      {
        "username": "bigvader23",
        "id": "2",
        "reviews": []
      }
    ],
    "transactions": {
      "edges": [
        null,
        {
          "node": {
            "__typename": "CardTransaction",
            "id": "tx2",
            "accountId": "Luca"
          }
        },
        null
      ]
    }
  }
```


