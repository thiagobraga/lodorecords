const mongoose = require('mongoose');
const Product = require('./models/Product');
const Band = require('./models/Band');
const Variant = require('./models/Variant');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb://admin:password123@mongodb:27017/lodorecords?authSource=admin',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin',
        directConnection: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
      }
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

function slugify(value = '') {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function skuify(value = '') {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

const seedData = async () => {
  try {
    // Safety guard: never seed in production
    if (String(process.env.NODE_ENV).toLowerCase() === 'production') {
      throw new Error('Refusing to seed in production. Set NODE_ENV!=production.');
    }

    // Optional one-time reset to remove duplicates
    const shouldReset = String(process.env.SEED_RESET).toLowerCase() === 'true';
    if (shouldReset) {
      await Variant.deleteMany({});
      await Product.deleteMany({});
      await Band.deleteMany({});
      console.log('Cleared Bands/Products/Variants (SEED_RESET=true)');
    }

    // Upsert bands
    const bands = [
      {
        name: 'Artigo DZ9?',
        description:
          'Veteran hardcore punk band from Agudos, SP, named after Article XIX of Human Rights Declaration, fighting for freedom of expression through subversive lyrics and old-school punk attitude.',
        genre: 'Punk Rock / Hardcore',
        image: '/images/bands/artigodz9.png',
        logo: '/images/bands/artigodz9.png',
        members: [
          { name: 'Ricardo Silva', role: 'Vocalist' },
          { name: 'Gabriel Santos', role: 'Guitarist' },
          { name: 'Mateus Lima', role: 'Bassist' },
          { name: 'Leonardo Costa', role: 'Drummer' }
        ],
        formedYear: 2018,
        website: 'https://instagram.com/artigodz9',
        socialMedia: {
          facebook: 'https://facebook.com/artigodz9',
          instagram: 'https://instagram.com/artigodz9',
          spotify: 'https://open.spotify.com/artist/artigodz9'
        },
        featured: true,
        active: true
      },
      {
        name: 'Autoboneco',
        description:
          'Innovative Brazilian post-punk collective exploring the intersection of folk traditions and dark atmospheric soundscapes, creating haunting melodies with poetic depth.',
        genre: 'Post Punk / Folk Rock',
        image: '/images/bands/autoboneco.jpg',
        logo: '/images/bands/autoboneco.png',
        members: [
          { name: 'Ana Oliveira', role: 'Lead Vocalist' },
          { name: 'Bruno Ferreira', role: 'Guitarist' },
          { name: 'Lucas Almeida', role: 'Keyboardist' },
          { name: 'Diego Rocha', role: 'Drummer' }
        ],
        formedYear: 2015,
        website: 'https://autoboneco.com',
        socialMedia: {
          facebook: 'https://facebook.com/autoboneco',
          instagram: 'https://instagram.com/autoboneco',
          spotify: 'https://open.spotify.com/artist/autoboneco'
        },
        featured: true,
        active: true
      },
      {
        name: 'Revel',
        description:
          'Uncompromising Brazilian hardcore crust band delivering fast, aggressive punk with raw production and fierce social commentary against inequality and oppression.',
        genre: 'Hardcore / Crust',
        image: '/images/bands/revel.jpg',
        logo: '/images/bands/revel.png',
        members: [
          { name: 'Marcos Pereira', role: 'Vocalist/Guitarist' },
          { name: 'Felipe Souza', role: 'Lead Guitarist' },
          { name: 'Thiago Martins', role: 'Bassist' },
          { name: 'André Ribeiro', role: 'Drummer' }
        ],
        formedYear: 2001,
        website: 'https://revel.com',
        socialMedia: {
          facebook: 'https://facebook.com/revel',
          instagram: 'https://instagram.com/revel',
          spotify: 'https://open.spotify.com/artist/revel'
        },
        featured: true,
        active: true
      },
      {
        name: 'Sociopata',
        description:
          'Aggressive Brazilian thrash metal band from Bauru, SP, delivering raw intensity and confrontational lyrics that embody the chaotic spirit of Brazilian extreme metal.',
        genre: 'Crossover / Thrash',
        image: '/images/bands/sociopata.jpg',
        logo: '/images/bands/sociopata.png',
        members: [
          { name: 'João Silva', role: 'Vocalist' },
          { name: 'Pedro Santos', role: 'Guitarist' },
          { name: 'Carlos Lima', role: 'Bassist' },
          { name: 'Rafael Costa', role: 'Drummer' }
        ],
        formedYear: 2017,
        website: 'https://sociopata.com',
        socialMedia: {
          facebook: 'https://facebook.com/sociopata',
          instagram: 'https://instagram.com/sociopata',
          spotify: 'https://open.spotify.com/artist/sociopata'
        },
        featured: true,
        active: true
      }
    ];

    const bandByName = new Map();
    for (const band of bands) {
      const slug = slugify(band.name);
      const saved = await Band.findOneAndUpdate(
        { slug },
        { ...band, slug },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      bandByName.set(band.name, saved);
    }

    // Products + variants
    const products = [
      {
        name: 'Sociopata - Corrosão (2016)',
        description:
          'Debut album featuring aggressive metal tracks with powerful lyrics about social corruption.',
        category: 'cd',
        images: ['/images/merch/sociopata-corrosao.jpg'],
        featured: true,
        artist: 'Sociopata',
        releaseDate: new Date('2016-06-15'),
        variants: [{ format: 'cd', price: 20.0, countInStock: 15 }]
      },
      {
        name: 'Autoboneco - Turnihil! (2018)',
        description:
          'Experimental rock album exploring themes of transformation and self-discovery.',
        category: 'vinyl',
        images: ['/images/merch/autoboneco-turnihil.jpg'],
        featured: true,
        artist: 'Autoboneco',
        releaseDate: new Date('2018-03-22'),
        variants: [{ format: 'vinyl', price: 30.0, countInStock: 12, color: 'black' }]
      },
      {
        name: 'Revel - Estrada Perdida (2018)',
        description:
          'Raw alternative rock album capturing the essence of lost highways and forgotten dreams.',
        category: 'cd',
        images: ['/images/merch/revel-estrada-perdida.jpg'],
        featured: true,
        artist: 'Revel',
        releaseDate: new Date('2018-09-10'),
        variants: [{ format: 'cd', price: 20.0, countInStock: 8 }]
      },
      {
        name: 'Revel - Petróleo (Single) (2018)',
        description: 'Powerful single about environmental concerns and corporate greed.',
        category: 'cd',
        images: ['/images/merch/revel-single-petroleo.jpg'],
        featured: false,
        artist: 'Revel',
        releaseDate: new Date('2018-11-05'),
        variants: [{ format: 'cd', price: 20.0, countInStock: 25 }]
      },
      {
        name: 'Artigo DZ9? - Intolerâncias (2024)',
        description:
          'Progressive metal album exploring themes of social intolerance and human behavior.',
        category: 'cd',
        images: ['/images/merch/artigodz9-intolerancias.jpg'],
        featured: true,
        artist: 'Artigo DZ9?',
        releaseDate: new Date('2024-05-15'),
        variants: [{ format: 'cd', price: 20.0, countInStock: 10 }]
      },
      {
        name: 'Artigo DZ9? - Liberte-se do Medo de Se Expressar (2013)',
        description:
          'Powerful album about liberation and breaking free from societal constraints.',
        category: 'cd',
        images: ['/images/merch/artigodz9-liberte-se.jpg'],
        featured: true,
        artist: 'Artigo DZ9?',
        releaseDate: new Date('2013-08-20'),
        variants: [{ format: 'cd', price: 20.0, countInStock: 8 }]
      },
      {
        name: 'Artigo DZ9? - O Universo É Nosso (2021)',
        description:
          'Latest release featuring cosmic themes and progressive metal compositions.',
        category: 'vinyl',
        images: ['/images/merch/artigodz9-o-universo-e-nosso.jpg'],
        featured: true,
        artist: 'Artigo DZ9?',
        releaseDate: new Date('2021-04-01'),
        variants: [{ format: 'vinyl', price: 20.0, countInStock: 12, color: 'black' }]
      }
    ];

    let productsUpserted = 0;
    let variantsUpserted = 0;

    for (const p of products) {
      const slug = slugify(p.name);

      const activeVariants = (p.variants || []).filter(Boolean);
      const startingPrice = Math.min(...activeVariants.map((v) => Number(v.price)));
      const totalStock = activeVariants.reduce((acc, v) => acc + Number(v.countInStock || 0), 0);

      const productDoc = await Product.findOneAndUpdate(
        { slug },
        {
          name: p.name,
          slug,
          description: p.description,
          category: p.category,
          images: p.images,
          featured: !!p.featured,
          artist: p.artist,
          releaseDate: p.releaseDate,
          price: Number.isFinite(startingPrice) ? startingPrice : 0,
          countInStock: Number.isFinite(totalStock) ? totalStock : 0
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      productsUpserted += 1;

      for (const v of activeVariants) {
        const sku = skuify(`${productDoc.slug}-${v.format}-${v.color || 'default'}-${v.condition || 'new'}`);
        await Variant.findOneAndUpdate(
          { sku },
          {
            sku,
            product: productDoc._id,
            format: v.format,
            color: v.color,
            condition: v.condition || 'new',
            price: Number(v.price),
            countInStock: Number(v.countInStock || 0),
            images: v.images && v.images.length ? v.images : productDoc.images,
            active: true
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        variantsUpserted += 1;
      }
    }

    console.log('🎸 Bands upserted:    ', bandByName.size);
    console.log('🛍️  Products upserted:', productsUpserted);
    console.log('📦 Variants upserted: ', variantsUpserted);
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);
