

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');

        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://Nikunj:Nikunj152@stackuptest.euwnpqn.mongodb.net/connectfour?retryWrites=true&w=majority&appName=StackUpTest");
        console.log('✅ Connected to MongoDB successfully');

        // Test the connection
        const connectionState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        console.log(`📊 Connection state: ${states[connectionState] || 'unknown'}`);

        // Get database info
        const dbName = mongoose.connection.db.databaseName;
        console.log(`🗄️  Database: ${dbName}`);

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Existing collections:');
        collections.forEach(collection => {
            console.log(`  - ${collection.name}`);
        });

        if (collections.length === 0) {
            console.log('📝 No collections found. Collections will be created automatically when data is inserted.');
        }

        console.log('\n🎉 Database setup completed successfully!');
        console.log('💡 The app will automatically create the required collections when users start playing.');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

setupDatabase();

