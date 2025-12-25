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

  /**
   * Create a new product
   */
  async createProduct(data: any) {
    // Validate required fields
    if (!data.name || !data.sku || !data.cashPrice || !data.categoryId) {
      throw new Error('Missing required fields');
    }

    // Check if SKU exists
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing) {
      throw new Error('Product with this SKU already exists');
    }

    return await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        cashPrice: data.cashPrice,
        oldPrice: data.oldPrice,
        stockQty: data.stockQty || 0,
        brand: data.brand,
        categoryId: data.categoryId,
        warranty: data.warranty,
        specs: data.specs,
        badges: data.badges,
        imageUrl: data.imageUrl || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, data: any) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // If updating SKU, check uniqueness
    if (data.sku && data.sku !== product.sku) {
      const existing = await prisma.product.findUnique({
        where: { sku: data.sku },
      });

      if (existing) {
        throw new Error('Product with this SKU already exists');
      }
    }

    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Delete (soft delete) a product
   */
  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Soft delete by setting isActive to false
    return await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}

export default new ProductsService();
