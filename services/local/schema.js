const { makeExecutableSchema } = require('@graphql-tools/schema');
const readFileSync = require('../../lib/read_file_sync');
const typeDefs = readFileSync(__dirname, 'schema.graphql');

const decorators = [
  { id: '1', txId: 'tx1', decorationKey: 'dtx1', decorationType: 'CategoryDecorator', __typename: 'CategoryDecorator' },
  { id: '2', txId: 'tx2', decorationKey: 'dtx2', decorationType: 'CategoryDecorator', __typename: 'CategoryDecorator' },
  { id: '3', txId: 'tx3', decorationKey: 'dtx3', decorationType: 'DocumentDecorator', __typename: 'DocumentDecorator' },
  { id: '4', txId: 'tx1', decorationKey: 'dtx4', decorationType: 'DocumentDecorator', __typename: 'DocumentDecorator'  },
];


const reviews = [
  { id: 'tx1', productUpc: '1', userId: '1', body: 'love it' },
];

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Transaction: {
      decorators: (root, { ids }) => {
        const result = ids.map(id => decorators.find(d => d.txId === id) || null);
        console.log('CardTransaction decorators', result);
        return result;
      },
    },
    CardTransaction: {
      decorators: (root, { ids }) => {
        const result = ids.map(id => decorators.find(d => d.txId === id) || null);
        console.log('CardTransaction decorators', result);
        return result;
      },
    },
    SEPACreditTransferTransaction: {
      decorators: (root, { ids }) => {
        const result = ids.map(id => decorators.find(d => d.txId === id) || null);
        console.log('SEPACreditTransferTransaction decorators', result);
        return result;
      },
    },
    Review: {
      // product: (review) => ({ upc: review.productUpc }),
      user: (review) => ({ id: review.userId }),
    },
    User: {
      reviews: (user) => reviews.filter(r => r.userId === user.id),
    },
    Query: {
      reviews: (root, { ids }) => {
        const result = ids.map(id => reviews.find(r => r.id === id) || null);
        console.log('result', result);
        return result
      },
      _users: (root, { ids }) => ids.map(id => ({ id })),
      _transactions: (root, { ids }) => ids.map(id => ({ id })),
      _decorators: ( root, { ids }) => {
        const deco = ids.map((id) => decorators.find(d => d.txId === id));
        console.log('deco result',ids, deco)
        return deco;
      },
      transactionDecoratorsById: (root, {id}) => {
        const decoResult = decorators.find(m => m.txId === id) || null;
        console.log('single', id, decoResult)
        return decoResult;
        // ids.map(id => decorators.find(m => m.txId === id) || null);
      },
      transactionDecoratorsByIds: (root, {ids}) => {
        const decoResult = ids.map(id => decorators.find(m => m.txId === id) || null);
        console.log('transactionDecoratorsByIds', ids, decoResult)
        return decoResult;
        // ids.map(id => decorators.find(m => m.txId === id) || null);
      },
      categoryDecoratorsByIds: (root, {ids}) => {
        console.log('ex')
        return ids.map(id => decorators.find(m => m.txId === id && decorationType === 'CategoryDecorator') || null);
      },
      documentDecoratorsByIds: (root, {ids}) => {
        console.log('ex')
        return ids.map(id => decorators.find(m => m.txId === id && decorationType === 'DocumentDecorator') || null);
      },
    }
  }
});
