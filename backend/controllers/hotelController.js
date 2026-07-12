import { cosmosDb } from '../config/cosmosDb.js';

// @desc    Get filtered, sorted, and paginated hotels from Cosmos DB
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
  try {
    const {
      destination = '',
      category = 'all',
      maxPrice,
      rating = 'any',
      amenities,
      sortBy = 'newest',
    } = req.query;

    let query = 'SELECT * FROM c WHERE 1=1';
    const parameters = [];

    // Destination filter
    if (destination && destination.trim() !== '') {
      query += ' AND (CONTAINS(LOWER(c.name), LOWER(@dest)) OR CONTAINS(LOWER(c.location), LOWER(@dest)) OR CONTAINS(LOWER(c.country), LOWER(@dest)))';
      parameters.push({ name: '@dest', value: destination.trim() });
    }

    // Category filter
    if (category && category !== 'all') {
      query += ' AND c.category = @category';
      parameters.push({ name: '@category', value: category });
    }

    // Max Price filter
    if (maxPrice && Number(maxPrice) > 0) {
      query += ' AND c.startingPrice <= @maxPrice';
      parameters.push({ name: '@maxPrice', value: Number(maxPrice) });
    }

    // Rating filter
    if (rating && rating !== 'any') {
      query += ' AND c.rating >= @rating';
      parameters.push({ name: '@rating', value: Number(rating) });
    }

    // Amenities filter (ARRAY_CONTAINS)
    if (amenities) {
      let amenitiesList = [];
      if (Array.isArray(amenities)) {
        amenitiesList = amenities;
      } else if (typeof amenities === 'string') {
        amenitiesList = amenities.split(',').filter(Boolean);
      }

      for (let i = 0; i < amenitiesList.length; i++) {
        const paramName = `@amenity${i}`;
        query += ` AND ARRAY_CONTAINS(c.amenities, ${paramName})`;
        parameters.push({ name: paramName, value: amenitiesList[i] });
      }
    }

    // Sorting
    if (sortBy === 'rating') {
      query += ' ORDER BY c.rating DESC';
    } else if (sortBy === 'price-asc') {
      query += ' ORDER BY c.startingPrice ASC';
    } else if (sortBy === 'price-desc') {
      query += ' ORDER BY c.startingPrice DESC';
    } else {
      // newest
      query += ' ORDER BY c._ts DESC'; // _ts is the default Cosmos timestamp
    }

    const querySpec = { query, parameters };
    const hotels = await cosmosDb.find('hotels', querySpec);

    res.json({
      data: hotels,
      total: hotels.length,
    });
  } catch (error) {
    console.error('Error fetching hotels from Cosmos:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: req.params.id }]
    };
    const hotel = await cosmosDb.findOne('hotels', querySpec);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
export const getFeaturedHotels = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    
    // Cosmos DB SQL requires TOP for limit queries
    const querySpec = {
      query: `SELECT TOP ${limit} * FROM c ORDER BY c.rating DESC`
    };
    
    const hotels = await cosmosDb.find('hotels', querySpec);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
