// queries.js
/**
 * MongoDB Queries - Week 1 Assignment
 * Author: Rebira Adugna
 * Description: A collection of MongoDB queries demonstrating CRUD operations
 * and advanced queries like sorting, filtering, and aggregation.
 */

const { MongoClient } = require("mongodb");

// Connection details
const uri = "mongodb://localhost:27017";
const dbName = "plp_bookstore";

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db(dbName);
    const books = db.collection("books");

    console.log(" Connected successfully to:", dbName);

    // 1 FIND — Show all books
    const allBooks = await books.find().toArray();
    console.log("\n All Books:");
    console.table(
      allBooks.map((b) => ({ Title: b.title, Author: b.author, Year: b.year }))
    );

    // 2 FILTER — Find books published after 1950
    const modernBooks = await books.find({ year: { $gt: 1950 } }).toArray();
    console.log("\n Books published after 1950:");
    console.table(modernBooks.map((b) => ({ Title: b.title, Year: b.year })));

    // 3 SORT — Sort books alphabetically by title (ascending)
    const sortedBooks = await books.find().sort({ title: 1 }).toArray();
    console.log("\n Books sorted by title:");
    console.table(sortedBooks.map((b) => ({ Title: b.title })));

    // 4 PROJECTION — Show only title and author (hide _id)
    const titleAndAuthor = await books
      .find({}, { projection: { _id: 0, title: 1, author: 1 } })
      .toArray();
    console.log("\n Titles and Authors only:");
    console.table(titleAndAuthor);

    // 5 UPDATE — Update the year of a specific book
    const updateResult = await books.updateOne(
      { title: "1984" },
      { $set: { year: 1950 } }
    );
    console.log(`\n Updated '${updateResult.modifiedCount}' document(s)`);

    // 6 DELETE — Remove a book by title
    const deleteResult = await books.deleteOne({ title: "Moby Dick" });
    console.log(`\n Deleted '${deleteResult.deletedCount}' document(s)`);

    // 7 AGGREGATION — Count how many books per author
    const authorCounts = await books
      .aggregate([
        { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
        { $sort: { totalBooks: -1 } },
      ])
      .toArray();
    console.log("\n Total books per author:");
    console.table(
      authorCounts.map((a) => ({ Author: a._id, Books: a.totalBooks }))
    );

    // 8 LIMIT — Get only first 3 books
    const limitedBooks = await books.find().limit(3).toArray();
    console.log("\n First 3 books:");
    console.table(
      limitedBooks.map((b) => ({ Title: b.title, Author: b.author }))
    );
  } catch (error) {
    console.error(" Error running queries:", error);
  } finally {
    await client.close();
    console.log("\n Connection closed.");
  }
}

// Run the queries
runQueries();
