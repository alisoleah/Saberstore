import prisma from '../config/database';

interface ProductFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}

export class ProductsService {
  /**
   * Get all products with filters
   */
  async getProducts(filters: ProductFilters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Apply filters
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.cashPrice = {};
      if (filters.minPrice !== undefined) {
        where.cashPrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.cashPrice.lte = filters.maxPrice;
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.inStock !== undefined && filters.inStock) {
      where.stockQty = { gt: 0 };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        marketplaceListings: {
          include: {
            channel: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Search products
   */
  async searchProducts(query: string, limit = 10) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
      take: limit,
    });

    return products;
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: {
            isActive: true,
            stockQty: { gt: 0 },
          },
          take: 20,
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        stockQty: { gt: 0 },
        badges: {
          path: '$',
          array_contains: ['Featured'],
        },
      },
      include: {
        category: true,
      },
      take: limit,
      orderBy: {
        rating: 'desc',
      },
    });
  }

  /**
   * Get products by budget (monthly installment)
   */
  async getProductsByBudget(monthlyBudget: number, durationMonths = 24, limit = 20) {
    // Calculate max product price based on budget
    // monthlyPayment = totalAmount / durationMonths
    // totalAmount = monthlyPayment * durationMonths
    const maxPrice = monthlyBudget * durationMonths;

    return await prisma.product.findMany({
      where: {
        isActive: true,
        stockQty: { gt: 0 },
        cashPrice: {
          lte: maxPrice,
        },
      },
      include: {
        category: true,
      },
      take: limit,
      orderBy: {
        cashPrice: 'asc',
      },
    });
  }
}

export default new ProductsService();
