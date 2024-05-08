const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { stitchSchemas, handleRelaySubschemas } = require('@graphql-tools/stitch');
const { printSchema } = require('graphql');
const fs = require('fs');

const remoteSchema = require('./services/remote/schema');
const localSchema = require('./services/local/schema');

function makeGatewaySchema() {
  // For simplicity, all services run locally in this example.
  // Any of these services could easily be turned into a remote server (see Example 1).
  const final = stitchSchemas({
    subschemas: handleRelaySubschemas([
      {
        schema: remoteSchema,
      },
      {
        schema: localSchema,
        batch: true,
        merge: {
          TransactionDecorator: {
            selectionSet: '{ id }',
            fieldName: '_decorators',
            key: ({ id }) => {
              console.log('transactionDecorator id', id);
              return id;
            },
            argsFromKeys: (ids) => {
              console.log('transactionDecorator', ids)
              return { ids }
            },
          },
          User: {
            selectionSet: '{ id }',
            fieldName: '_users',
            key: ({ id }) => id,
            argsFromKeys: (ids) => ({ ids }),
          },
        },
      },

    ]),
    inheritResolversFromInterfaces: true,
  });
  console.log('final', final.extensions.stitchingInfo.mergedTypes);
  fs.writeFileSync('./final.gql', printSchema(final), 'utf-8');

  return final;
}

const app = express();
app.use('/graphql', graphqlHTTP({ schema: makeGatewaySchema(), graphiql: true }));
app.listen(4000, () => console.log('gateway running at http://localhost:4000/graphql'));
