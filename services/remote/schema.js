const { makeExecutableSchema } = require('@graphql-tools/schema');
const readFileSync = require('../../lib/read_file_sync');
const typeDefs = readFileSync(__dirname, 'schema.graphql');

const tx1 = {
  id: 'tx1',
  accountId: 'Luca',
  reference: 'transaction 1',
  __typename: 'SEPACreditTransferTransaction',
}

const tx2 = {
  id: 'tx2',
  accountId: 'Luca',
  reference: 'transaction 2',
  __typename: 'CardTransaction',
}

const tx3 = {
  id: 'tx3',
  accountId: 'Rafaela',
  reference: 'transaction 3',
  __typename: 'SEPACreditTransferTransaction',
}

const tx4 = {
  id: 'tx4',
  accountId: 'Rafaela',
  reference: 'transaction 4',
  __typename: 'CardTransaction',
}

const allTransactions = [
  tx1,
  tx2,
  tx3,
  tx4,
]

const edges = [
  { node: tx1, cursor: 'tx1' },
  { node: tx2, cursor: 'tx2' },
];

const transactions = [
  {
    totalCount: 2,
    edges: edges,
  }
];

const lucaAccount = {
  id: 'Luca',
  name: 'luca',
  transactions,
}

const rafaelaAccount = {
  id: 'Rafaela',
  name: 'rafa',
  transactions,
}

const accounts = [
  lucaAccount,
  rafaelaAccount,
]

const users = [
  { id: '1', username: 'hanshotfirst' },
  { id: '2', username: 'bigvader23' },
];

const findAccountById = (id) => accounts.find((account) => account.id === id);
const transactionsByAccount = (id) => allTransactions.filter((tx) => tx.accountId === id);
const findTransactionById = (id) => allTransactions.find((tx) => tx.id === id);
const findTransactionByIds = (ids) => allTransactions.filter((tx) => ids.includes(tx.id));

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Account: {
      transactions: (root) => {
        return root.transactions;
      },
    },
    Query: {
      users: (root, { ids }) => {
        console.log('query remote users', ids)
        const result = ids.map(id => users.find(u => u.id === id) || null);
        console.log('result', result)
        return result;
      },
      account: (_root, { id }) => {
        const transactions = transactionsByAccount(id);
        const final = {
          ...findAccountById(id),
          transactions: {
            totalCount: transactions.length,
            edges: transactions.map((tx) => {
              return { node: tx, cursor: tx.id }
            }),
          },
        };
        return final;
      },
      transaction: (_root, { id }) => {
        return findTransactionById(id);
      },
      transactions: (_root, { ids }) => {
        const result = {
          totalCount: allTransactions.length,
          edges: ids.map((id) => 
            allTransactions.find((t) => t.id === id)).map((tx) => ({ node: tx, cursor: tx.id })
          ),
        }
        return (result);
      },
    }
  }
});
