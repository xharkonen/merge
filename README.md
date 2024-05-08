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
