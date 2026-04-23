import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import ChatWindow from '@/components/chat-window';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Data produk statis dengan gambar dari Unsplash
const products = [
    {
        id: 1,
        name: 'Premium Leather Jacket',
        category: 'Outerwear',
        price: 899000,
        originalPrice: 1299000,
        rating: 4.8,
        reviewCount: 234,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
        badge: 'Sale',
        isNew: false,
    },
    {
        id: 2,
        name: 'Classic White Sneakers',
        category: 'Footwear',
        price: 459000,
        originalPrice: 659000,
        rating: 4.9,
        reviewCount: 567,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        badge: 'Best Seller',
        isNew: false,
    },
    {
        id: 3,
        name: 'Cashmere Sweater',
        category: "Men's Tops",
        price: 349000,
        originalPrice: 599000,
        rating: 4.7,
        reviewCount: 189,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop',
        badge: 'Limited',
        isNew: true,
    },
    {
        id: 4,
        name: 'Slim Fit Jeans',
        category: 'Denim & Jeans',
        price: 399000,
        originalPrice: 599000,
        rating: 4.6,
        reviewCount: 432,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',
        badge: '',
        isNew: false,
    },
    {
        id: 5,
        name: 'Floral Summer Dress',
        category: "Women's Tops",
        price: 289000,
        originalPrice: 459000,
        rating: 4.8,
        reviewCount: 321,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
        badge: 'Trending',
        isNew: true,
    },
    {
        id: 6,
        name: 'Running Shoes',
        category: 'Activewear',
        price: 529000,
        originalPrice: 789000,
        rating: 4.9,
        reviewCount: 678,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        badge: 'Best Seller',
        isNew: false,
    },
    {
        id: 7,
        name: 'Minimalist Backpack',
        category: 'Accessories',
        price: 329000,
        originalPrice: 499000,
        rating: 4.7,
        reviewCount: 245,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        badge: '',
        isNew: false,
    },
    {
        id: 8,
        name: 'Wool Fedora Hat',
        category: 'Accessories',
        price: 189000,
        originalPrice: 299000,
        rating: 4.5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=500&fit=crop',
        badge: 'Sale',
        isNew: false,
    },
    {
        id: 9,
        name: 'Sports Bra',
        category: 'Activewear',
        price: 159000,
        originalPrice: 259000,
        rating: 4.8,
        reviewCount: 456,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=500&fit=crop',
        badge: 'Trending',
        isNew: true,
    },
];

// Fungsi format harga
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

// Komponen Product Card
function ProductCard({ product }: { product: typeof products[0] }) {
    const [isHovered, setIsHovered] = useState(false);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <div
            className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge */}
            <div className="absolute left-3 top-3 z-10 flex gap-2">
                {product.badge && (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
                        {product.badge}
                    </span>
                )}
                {product.isNew && (
                    <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
                        New
                    </span>
                )}
                {discount > 0 && !product.badge && (
                    <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                        Quick View
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1">
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {product.rating}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard | Product Catalog" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">Welcome to Style Store</h1>
                        <p className="mt-2 text-blue-100">Discover the latest fashion trends and exclusive collections</p>
                        <button className="mt-4 rounded-lg bg-white px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                            Shop Now →
                        </button>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                        <PlaceholderPattern className="h-full w-full" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                        <p className="text-sm text-gray-500">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                        <p className="text-sm text-gray-500">Categories</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length - 1}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                        <p className="text-sm text-gray-500">Best Sellers</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                        <p className="text-sm text-gray-500">On Sale</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                                    selectedCategory === category
                                        ? 'bg-gray-900 text-white dark:bg-gray-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                {category === 'all' ? 'All Products' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
                        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-gray-500">No products found</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                            }}
                            className="mt-2 text-sm text-blue-500 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            <ChatWindow />
        </AppLayout>
    );
}
