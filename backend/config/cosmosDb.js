import 'dotenv/config';
import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  console.error('CRITICAL: COSMOS_ENDPOINT or COSMOS_KEY is not defined in environment variables.');
}

const client = new CosmosClient({ endpoint, key });
const databaseId = 'AzureStayDB';

let db = null;
const containers = {};

export const initCosmos = async () => {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    db = database;
    console.log(`Azure Cosmos DB SQL Database '${databaseId}' initialized successfully.`);

    const containerIds = ['users', 'hotels', 'bookings', 'reviews', 'settings'];
    for (const id of containerIds) {
      const { container } = await db.containers.createIfNotExists({
        id,
        partitionKey: { paths: ['/id'] },
      });
      containers[id] = container;
      console.log(`Cosmos DB Container '${id}' ready.`);
    }
  } catch (error) {
    console.error('Failed to initialize Azure Cosmos DB Containers:', error.message);
    throw error;
  }
};

export const getContainer = (containerId) => {
  const c = containers[containerId];
  if (!c) {
    throw new Error(`Container '${containerId}' has not been initialized.`);
  }
  return c;
};

// Database utility abstractions
export const cosmosDb = {
  find: async (containerId, querySpec = { query: 'SELECT * FROM c' }) => {
    const c = getContainer(containerId);
    const { resources } = await c.items.query(querySpec).fetchAll();
    return resources;
  },

  findOne: async (containerId, querySpec) => {
    const c = getContainer(containerId);
    const { resources } = await c.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  },

  findById: async (containerId, itemId) => {
    try {
      const c = getContainer(containerId);
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: itemId }]
      };
      const { resources } = await c.items.query(querySpec).fetchAll();
      return resources.length > 0 ? resources[0] : null;
    } catch (e) {
      return null;
    }
  },

  create: async (containerId, item) => {
    const c = getContainer(containerId);
    // Cosmos requires an 'id' string field on all items
    const itemWithId = {
      ...item,
      id: item.id || item._id || 'item-' + Date.now() + Math.random().toString(36).substring(2, 9),
    };
    if (itemWithId._id) delete itemWithId._id;
    
    const { resource } = await c.items.create(itemWithId);
    return resource;
  },

  save: async (containerId, item) => {
    const c = getContainer(containerId);
    const itemId = item.id;
    if (!itemId) {
      throw new Error('Cannot save item to Cosmos DB without an id property.');
    }
    const { resource } = await c.items.upsert(item);
    return resource;
  },

  deleteOne: async (containerId, itemId) => {
    const c = getContainer(containerId);
    const { resource } = await c.item(itemId, itemId).delete();
    return resource;
  },

  countDocuments: async (containerId, querySpec = { query: 'SELECT VALUE COUNT(1) FROM c' }) => {
    const c = getContainer(containerId);
    const { resources } = await c.items.query(querySpec).fetchAll();
    return resources.length > 0 ? resources[0] : 0;
  }
};
