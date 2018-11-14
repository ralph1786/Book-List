//These are Graphql schema.

const graphql = require("graphql");
// const _ = require("lodash");
const Book = require("../models/book.js");
const Author = require("../models/author.js");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    //code below is to look for author associated with a specific book.
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId); //This code will search for an author with a specific authorId in the database.
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), // This is used because an author can have a list of books not just one.
      resolve(parent, args) {
        return Book.find({
          authorId: parent.id
        });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      //code to get data from database
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      //following code gets data from database.
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    books: {
      //Following code will give you a list of all the books.
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

//Making Changes, like adding or deleting an author.
const Mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString) //The GraphQLNonNull makes this field required when adding an author.
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parent, args) {
        //The new Author below comes from the Author in the mongoDb schema imported at the top of the file.
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save(); //This will save the new author created above to the database.
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        //The new Book below comes from the Book in the mongoDb schema imported at the top of the file.
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save(); //This will save the new author created above to the database.
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
