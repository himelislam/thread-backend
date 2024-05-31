import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express'

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000
    
    app.use(express.json())

    // create a GraphQl server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello: String!
                say(name: String): String!
            }
        `, // Schema
        resolvers: {
            Query:{
                hello: ()=> `Hello from hello query`,
                say: (parent, {name}: {name: string})=> `Hey ${name}, How are you?`
            }
        }
    });

    // Start the GQL server
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({ message: "Server is Running!!" })
    })

    app.use('/graphql', expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`Server started at PORT: ${PORT}`);
    })
}

init();