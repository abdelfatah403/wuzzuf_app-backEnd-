import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID
} from "graphql";
import * as dashBoardService from './resolve.js';

// // Define User Type
// const UserType = new GraphQLObjectType({
//     name: 'User',
//     fields: () => ({
//         id: { type: GraphQLID },
//         firstName: { type: GraphQLString },
//         lastName: { type: GraphQLString },
//         email: { type: GraphQLString }
//     })
// });

// // Define Company Type
// const CompanyType = new GraphQLObjectType({
//     name: 'Company',
//     fields: () => ({
//         id: { type: GraphQLID },
//         companyName: { type: GraphQLString },
//         industry: { type: GraphQLString }
//     })
// });

// const QueryType = new GraphQLObjectType({
//     name: "Query",
//     fields: {
//         retriveusers: {
//             type: new GraphQLList(UserType),
//             resolve: dashBoardService.retriveusers
//         },
//         retrivecompanies: {
//             type: new GraphQLList(CompanyType),
//             resolve: dashBoardService.retrivecompanies
//         }
//     }
// });

// const dashBoardSchema = new GraphQLSchema({
//     query: QueryType
// });

// export default dashBoardSchema;


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello World!'
        }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: GraphQLString,
                resolve: () => 'Hello World!'
            }
        }
    })
});

export default schema;
