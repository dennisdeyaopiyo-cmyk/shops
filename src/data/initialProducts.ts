import { Product, ShopInfo } from '../types';

export const initialShopInfo: ShopInfo = {
  name: "Oak Street Porch & Pantry",
  tagline: "Fresh homegrown goods & homemade treats for our immediate neighbours.",
  houseAddress: "42 Oak Street (Front Porch)",
  pickupHours: "Today: 8:00 AM – 7:30 PM",
  contactPhone: "+1 (555) 349-2180",
  pickupNote: "Items are kept in the labeled porch cooler or on the bench. Pay on pickup (Cash box or digital pay)."
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Farm Fresh Free-Range Eggs',
    description: 'Gathered daily from our pasture-roaming hens. Clean, unwashed shells with rich, bright golden yolks. Great for baking or weekend breakfast.',
    price: 5.50,
    unit: '1 dozen (carton)',
    category: 'Eggs & Dairy',
    inStock: true,
    stockCount: 6,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    badge: 'Fresh Today'
  },
  {
    id: 'prod-2',
    name: 'Artisan Sourdough Country Loaf',
    description: '36-hour cold fermented sourdough made with organic unbleached flour, water, and sea salt. Crisp blistered crust and an airy, chewy crumb.',
    price: 7.00,
    unit: '1 large loaf (~850g)',
    category: 'Bakery & Bread',
    inStock: true,
    stockCount: 3,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    badge: 'Baked This Morning'
  },
  {
    id: 'prod-3',
    name: 'Raw Wildflower Backyard Honey',
    description: '100% pure unfiltered raw honey straight from our garden apiary. Rich floral notes with hints of clover and lavender. Never heated.',
    price: 9.00,
    unit: '375g glass jar',
    category: 'Pantry & Preserves',
    inStock: true,
    stockCount: 8,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    badge: 'Home Apiary'
  },
  {
    id: 'prod-4',
    name: 'Heirloom Garden Tomatoes',
    description: 'Naturally vine-ripened mix of Cherokee Purple, Brandywine, and Sweet 100 cherry tomatoes picked at peak sweetness. Bursting with real summer flavor.',
    price: 4.50,
    unit: '1 kg basket',
    category: 'Fresh Produce',
    inStock: true,
    stockCount: 5,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    badge: 'Organically Grown'
  },
  {
    id: 'prod-5',
    name: 'Small-Batch Strawberry Rhubarb Jam',
    description: 'Slow-simmered preserve made with sweet local strawberries, tart garden rhubarb, lemon zest, and low cane sugar. Fantastic on warm toast.',
    price: 6.50,
    unit: '250ml glass jar',
    category: 'Pantry & Preserves',
    inStock: true,
    stockCount: 4,
    image: 'https://images.unsplash.com/photo-1563865436874-9aef32095afd?w=600&auto=format&fit=crop&q=80',
    badge: 'Handmade'
  },
  {
    id: 'prod-6',
    name: 'Fresh Rosemary & Thyme Herb Bundle',
    description: 'Freshly clipped culinary herb bundle tied with natural twine. Fragrant and lush, perfect for roasting chicken, potatoes, or herbal teas.',
    price: 3.00,
    unit: 'Generous fresh bunch',
    category: 'Garden & Herbs',
    inStock: true,
    stockCount: 10,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-7',
    name: 'Brown Butter Dark Chocolate Chip Cookies',
    description: 'Soft-baked gourmet cookies made with nutty browned butter, 70% dark chocolate chunks, and finished with crunchy Maldon sea salt flakes.',
    price: 6.00,
    unit: 'Box of 4 large cookies',
    category: 'Bakery & Bread',
    inStock: true,
    stockCount: 4,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    badge: 'Neighbor Favorite'
  },
  {
    id: 'prod-8',
    name: 'Crisp Garden Salad Greens & Radish',
    description: 'Washed and spun mix of baby romaine, red oak leaf, arugula, and thinly sliced garden French breakfast radishes. Tender and peppery.',
    price: 4.00,
    unit: '200g sealed bag',
    category: 'Fresh Produce',
    inStock: false,
    stockCount: 0,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
  }
];
