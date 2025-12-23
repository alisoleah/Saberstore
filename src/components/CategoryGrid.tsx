import { Smartphone, Laptop, Tv, Home, UtensilsCrossed, Wind } from 'lucide-react';

const categories = [
  { name: 'Mobiles', icon: Smartphone, count: 245, color: 'bg-blue-500' },
  { name: 'Laptops', icon: Laptop, count: 189, color: 'bg-purple-500' },
  { name: 'TVs', icon: Tv, count: 156, color: 'bg-pink-500' },
  { name: 'Large Appliances', icon: Home, count: 312, color: 'bg-green-500' },
  { name: 'Small Appliances', icon: UtensilsCrossed, count: 267, color: 'bg-yellow-500' },
  { name: 'Air Conditioners', icon: Wind, count: 98, color: 'bg-cyan-500' },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <div
            key={category.name}
            className="bg-white rounded-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-[#1A1A1A] text-center mb-1">
              {category.name}
            </h3>
            <p className="text-[#666666] text-center">
              {category.count} items
            </p>
          </div>
        );
      })}
    </div>
  );
}
