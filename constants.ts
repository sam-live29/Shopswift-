
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'mobiles', name: 'Mobiles', icon: '📱' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'appliances', name: 'Appliances', icon: '🧊' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'toys', name: 'Toys', icon: '🧸' },
];

export const CATEGORY_METADATA: Record<string, { 
  brands: string[], 
  budgetFilters: number[],
  groups: { name: string, items: string[] }[]
}> = {
  mobiles: {
    brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
    budgetFilters: [10000, 20000, 30000, 50000],
    groups: [
      { name: 'Smartphones', items: ['Premium Flagships', 'Budget 5G', 'Gaming Phones'] },
      { name: 'Accessories', items: ['Cases & Covers', 'Screen Protectors', 'Power Banks', 'Chargers'] },
      { name: 'Tablets', items: ['iPads', 'Samsung Tabs', 'Budget Tablets'] }
    ]
  },
  fashion: {
    brands: ['Nike', 'Puma', 'Adidas', 'Levi\'s', 'Roadster'],
    budgetFilters: [499, 999, 1499, 2999],
    groups: [
      { name: 'Men\'s Wear', items: ['T-shirts', 'Shirts', 'Jeans', 'Trousers'] },
      { name: 'Women\'s Wear', items: ['Ethnic Wear', 'Western Wear', 'Dresses', 'Sarees'] },
      { name: 'Footwear', items: ['Sports Shoes', 'Casual Shoes', 'Heels', 'Slippers'] }
    ]
  },
  electronics: {
    brands: ['Sony', 'Dell', 'HP', 'ASUS', 'boAt'],
    budgetFilters: [999, 4999, 9999, 24999],
    groups: [
      { name: 'Audio', items: ['Earbuds', 'Headphones', 'Speakers', 'Soundbars'] },
      { name: 'Computers', items: ['Laptops', 'Desktops', 'Monitors', 'Printers'] },
      { name: 'Gaming', items: ['Consoles', 'Gaming Mice', 'Keyboards', 'Controllers'] }
    ]
  },
  home: {
    brands: ['Sleepwell', 'IKEA', 'Pepperfry', 'Home Centre'],
    budgetFilters: [499, 1999, 4999, 9999],
    groups: [
      { name: 'Furniture', items: ['Sofas', 'Beds', 'Dining Tables', 'Chairs'] },
      { name: 'Decor', items: ['Wall Decor', 'Clocks', 'Vases', 'Paintings'] },
      { name: 'Kitchen', items: ['Cookware', 'Storage', 'Tools', 'Bakeware'] }
    ]
  },
  appliances: {
    brands: ['Whirlpool', 'LG', 'Samsung', 'Haier', 'Panasonic'],
    budgetFilters: [4999, 9999, 19999, 39999],
    groups: [
      { name: 'Large Appliances', items: ['Refrigerators', 'Washing Machines', 'Air Conditioners'] },
      { name: 'Small Kitchen', items: ['Microwaves', 'Mixer Grinders', 'Water Purifiers'] },
      { name: 'Cleaning', items: ['Vacuum Cleaners', 'Iron', 'Air Purifiers'] }
    ]
  },
  beauty: {
    brands: ['Lakme', 'L\'Oreal', 'MAC', 'The Body Shop'],
    budgetFilters: [199, 499, 999, 1999],
    groups: [
      { name: 'Makeup', items: ['Lipstick', 'Foundation', 'Eyeliner', 'Nail Polish'] },
      { name: 'Personal Care', items: ['Face Wash', 'Moisturizers', 'Sunscreen', 'Hair Oil'] },
      { name: 'Fragrances', items: ['Perfumes', 'Deodorants', 'Body Mists'] }
    ]
  },
  toys: {
    brands: ['LEGO', 'Mattel', 'Hasbro', 'Hot Wheels'],
    budgetFilters: [299, 599, 999, 1999],
    groups: [
      { name: 'Learning', items: ['Puzzles', 'Educational Sets', 'STEM Toys'] },
      { name: 'Action', items: ['Action Figures', 'Remote Control', 'Outdoor Games'] },
      { name: 'Plush', items: ['Soft Toys', 'Dolls', 'Character Sets'] }
    ]
  }
};

export const SUBCATEGORIES: Record<string, string[]> = {
  mobiles: ['Premium Flagships', 'Budget 5G', 'Tablets'],
  fashion: ['Mens Wear', 'Womens Wear', 'Footwear'],
  electronics: ['Audio Essentials', 'Laptops', 'Gaming Gears'],
  home: ['Living Room', 'Bedroom', 'Decor'],
  appliances: ['Kitchen', 'Cooling', 'Cleaning'],
  beauty: ['Skincare', 'Makeup', 'Fragrance'],
  toys: ['Board Games', 'Action Figures', 'Action Sets'],
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const brands: Record<string, string[]> = {
    mobiles: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
    fashion: ['Roadster', 'Levi\'s', 'Nike', 'Puma', 'Adidas'],
    electronics: ['Sony', 'Dell', 'HP', 'ASUS', 'boAt'],
    home: ['Sleepwell', 'IKEA', 'Pepperfry', 'Home Centre'],
    appliances: ['Whirlpool', 'LG', 'Samsung', 'Haier', 'Panasonic'],
    beauty: ['Lakme', 'L\'Oreal', 'MAC', 'The Body Shop'],
    toys: ['LEGO', 'Mattel', 'Hasbro', 'Hot Wheels'],
  };

  const nameParts: Record<string, { p: string[], s: string[] }> = {
    mobiles: { 
      p: ['Galaxy', 'iPhone', 'Pixel', 'Edge', 'Nord'], 
      s: ['Pro Max', 'Ultra', '5G Plus', 'Lite Edition'] 
    },
    fashion: { 
      p: ['Slim Fit', 'Cotton', 'Casual', 'Regular'], 
      s: ['Shirt', 'Jeans', 'T-shirt', 'Jacket'] 
    },
    electronics: { 
      p: ['Wireless', 'Noise Cancelling', 'Ultra HD', 'Gaming'], 
      s: ['Headphones', 'Monitor', 'Keyboard', 'Mouse'] 
    },
    home: { 
      p: ['Orthopedic', 'Modern', 'Wooden', 'Soft'], 
      s: ['Sofa', 'Bed', 'Curtain', 'Coffee Table'] 
    },
    appliances: { 
      p: ['Front Load', 'Inverter', 'Direct Cool', 'Smart'], 
      s: ['Washing Machine', 'Refrigerator', 'Microwave', 'Mixer Grinder'] 
    },
    beauty: { 
      p: ['Matte', 'Hydrating', 'Organic', 'Natural'], 
      s: ['Lipstick', 'Foundation', 'Perfume', 'Serum'] 
    },
    toys: { 
      p: ['Educational', 'Remote Control', 'Plush', 'Building'], 
      s: ['Set', 'Figure', 'Car', 'Board Game'] 
    },
  };

  const specKeys: Record<string, string[]> = {
    mobiles: ['RAM', 'Storage', 'Processor', 'Display'],
    fashion: ['Material', 'Fit', 'Occasion', 'Pattern'],
    electronics: ['Interface', 'Color', 'Battery Life', 'Warranty'],
    home: ['Material', 'Dimensions', 'Assembly', 'Color'],
    appliances: ['Capacity', 'Star Rating', 'Type', 'Warranty'],
    beauty: ['Skin Type', 'Benefit', 'Quantity', 'Finish'],
    toys: ['Age Group', 'Material', 'Theme', 'Skills'],
  };

  let idCounter = 1;

  CATEGORIES.forEach(category => {
    const count = 10;
    const currentSubCats = SUBCATEGORIES[category.id];
    
    for (let i = 0; i < count; i++) {
      const brand = brands[category.id][i % brands[category.id].length];
      const prefix = nameParts[category.id].p[i % nameParts[category.id].p.length];
      const suffix = nameParts[category.id].s[i % nameParts[category.id].s.length];
      const subCategory = currentSubCats[i % currentSubCats.length];
      
      const priceBase = 
        category.id === 'mobiles' ? 15000 : 
        category.id === 'electronics' ? 5000 : 
        category.id === 'appliances' ? 10000 : 500;
      
      const priceRandom = Math.floor(Math.random() * (priceBase * 2));
      const price = priceBase + priceRandom;
      const discount = Math.floor(Math.random() * 30) + 10;
      const oldPrice = Math.floor(price / (1 - discount / 100));

      const specifications: Record<string, string> = {};
      specKeys[category.id].forEach(key => {
        specifications[key] = 'Premium Quality';
      });

      products.push({
        id: idCounter.toString(),
        name: `${brand} ${prefix} ${suffix}`,
        category: category.id,
        subCategory,
        price,
        oldPrice,
        discount: `${discount}% OFF`,
        rating: Number((Math.random() * 1 + 4.0).toFixed(1)),
        reviewsCount: Math.floor(Math.random() * 5000) + 100,
        image: `https://picsum.photos/seed/${idCounter + 100}/400/400`,
        description: `Experience the best of ${category.name} with this ${brand} ${prefix}. Features cutting edge technology and premium build quality.`,
        brand,
        specifications,
        isAssured: Math.random() > 0.3,
        stock: Math.floor(Math.random() * 50), 
      });
      idCounter++;
    }
  });

  return products;
};

export const PRODUCTS = generateProducts();
