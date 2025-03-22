import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1099,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
      "https://images.unsplash.com/photo-1695048133196-5ac88925872f",
      "https://images.unsplash.com/photo-1695048133246-b23f8784e2bf"
    ],
    rating: 4.8,
    reviews: 256,
    category: "Smartphones",
    stock: 50,
    description: "Experience the pinnacle of mobile technology with the iPhone 15 Pro Max. Featuring a stunning display, powerful A17 Pro chip, and an advanced camera system.",
    specifications: {
      "Display": "6.7-inch Super Retina XDR OLED",
      "Processor": "A17 Pro chip",
      "RAM": "8GB",
      "Storage": "256GB",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      "Battery": "4422mAh",
      "OS": "iOS 17"
    }
  },
  {
    id: 2,
    name: "MacBook Pro 16",
    brand: "Apple",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef"
    ],
    rating: 4.9,
    reviews: 189,
    category: "Laptops",
    stock: 25,
    description: "The most powerful MacBook Pro ever is here. With the blazing-fast M2 Pro chip, stunning Liquid Retina XDR display, and exceptional battery life.",
    specifications: {
      "Display": "16.2-inch Liquid Retina XDR",
      "Processor": "M2 Pro",
      "RAM": "32GB",
      "Storage": "1TB SSD",
      "Graphics": "19-core GPU",
      "Battery": "Up to 22 hours",
      "OS": "macOS Sonoma"
    }
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
      "https://images.unsplash.com/photo-1678911820864-e5c06d1a3f42",
      "https://images.unsplash.com/photo-1678911820856-96c8ec7c1925"
    ],
    rating: 4.7,
    reviews: 167,
    category: "Smartphones",
    stock: 45,
    description: "The Galaxy S24 Ultra sets new standards with its advanced AI capabilities, stunning camera system, and the most powerful Galaxy performance yet.",
    specifications: {
      "Display": "6.8-inch QHD+ Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Storage": "512GB",
      "Camera": "200MP Main + 12MP Ultra Wide + 50MP Telephoto",
      "Battery": "5000mAh",
      "OS": "Android 14 with One UI 6.1"
    }
  },
  {
    id: 4,
    name: "Dell XPS 15",
    brand: "Dell",
    price: 1999,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"
    ],
    rating: 4.6,
    reviews: 142,
    category: "Laptops",
    stock: 30,
    description: "The Dell XPS 15 combines powerful performance with a stunning 4K OLED display in a premium, compact design perfect for creators and professionals.",
    specifications: {
      "Display": "15.6-inch 4K OLED Touch",
      "Processor": "Intel Core i9-13900H",
      "RAM": "32GB DDR5",
      "Storage": "1TB NVMe SSD",
      "Graphics": "NVIDIA RTX 4070",
      "Battery": "86Whr",
      "OS": "Windows 11 Pro"
    }
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399,
    originalPrice: 449,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
    ],
    rating: 4.8,
    reviews: 312,
    category: "Accessories",
    stock: 75,
    description: "Industry-leading noise cancellation meets premium comfort and exceptional sound quality in these flagship wireless headphones.",
    specifications: {
      "Type": "Over-ear Wireless",
      "Battery Life": "Up to 30 hours",
      "Noise Cancellation": "Advanced ANC",
      "Connectivity": "Bluetooth 5.2",
      "Charging": "USB-C",
      "Weight": "250g",
      "Features": "Multipoint connection, Touch controls"
    }
  },
  {
    id: 6,
    name: "iPad Pro 12.9",
    brand: "Apple",
    price: 1099,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
    ],
    rating: 4.9,
    reviews: 203,
    category: "Tablets",
    stock: 40,
    description: "The ultimate iPad experience with the M2 chip, stunning mini-LED display, and pro-level features for demanding creative workflows.",
    specifications: {
      "Display": "12.9-inch Liquid Retina XDR",
      "Processor": "M2 chip",
      "Storage": "256GB",
      "Camera": "12MP Wide + 10MP Ultra Wide",
      "Features": "Face ID, Apple Pencil 2 support",
      "Connectivity": "Wi-Fi 6E, 5G",
      "OS": "iPadOS 17"
    }
  }
];

export const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    description: "Latest mobile phones from top brands",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569"
  },
  {
    id: "laptops",
    name: "Laptops",
    description: "Powerful laptops for work and play",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
  },
  {
    id: "tablets",
    name: "Tablets",
    description: "Versatile tablets for creativity and entertainment",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Essential accessories for your devices",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
  }
];