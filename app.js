// Import MongoDB client
const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://127.0.0.1:27017"; // Local MongoDB
const client = new MongoClient(url);

// Database Name
const dbName = "statsdb";

// Data provided
var stats = [
    { city: 'San Juan', zip: '00926', state: 'PR', income: '34781', age: '44' },
    { city: 'Corona', zip: '11368', state: 'NY', income: '50797', age: '32' },
    { city: 'Chicago', zip: '60629', state: 'IL', income: '42019', age: '31' },
    { city: 'El Paso', zip: '79936', state: 'TX', income: '54692', age: '31' },
    { city: 'Los Angeles', zip: '90011', state: 'CA', income: '36954', age: '28' },
    { city: 'Norwalk', zip: '90650', state: 'CA', income: '66453', age: '35' }
];

// Async function to run tasks
async function runTasks() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db(dbName);
        console.log(`Database ${dbName} selected successfully!`);

        // Task 2: Create collection
        const collection = db.collection("uscensus");
        console.log("Collection 'uscensus' ready!");

        // Task 3: Insert initial data
        await collection.insertMany(stats);
        console.log("Initial data inserted successfully!");

        // Task 4: Add two new records
        const newRecords = [
            { city: 'Pacoima', zip: '91331', state: 'CA', income: '60360', age: '33' },
            { city: 'Ketchikan', zip: '99950', state: 'AK', income: '00000', age: '00' }
        ];
        await collection.insertMany(newRecords);
        console.log("New records added successfully!");

        // Task 5: Find zip code for Corona, NY
        const corona = await collection.findOne({ city: "Corona", state: "NY" });
        console.log(`Corona, NY zip code: ${corona.zip}`);

        // Task 6: Income for all cities in California
        const caCities = await collection.find({ state: "CA" }).toArray();
        console.log("Income for all California cities:");
        caCities.forEach(city => {
            console.log(`${city.city}: ${city.income}`);
        });

        // Task 7: Update Alaska record
        await collection.updateOne(
            { state: "AK" },
            { $set: { income: "38910", age: "46" } }
        );
        console.log("Alaska record updated successfully!");

        // Task 8: Sort records by state ascending
        const sortedRecords = await collection.find().sort({ state: 1 }).toArray();
        console.log("Records sorted by state (ascending):");
        console.table(sortedRecords);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

// Run the tasks
runTasks();
