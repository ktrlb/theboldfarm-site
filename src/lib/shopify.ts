import { GraphQLClient } from 'graphql-request';

// Shopify Storefront API endpoint
const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!SHOPIFY_STOREFRONT_URL || !SHOPIFY_STOREFRONT_TOKEN) {
  console.warn('Shopify Storefront API credentials not configured');
}

// Create GraphQL client for Shopify
export const shopifyClient = new GraphQLClient(
  SHOPIFY_STOREFRONT_URL || 'https://your-store.myshopify.com/api/2024-01/graphql.json',
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN || '',
    },
  }
);

// GraphQL queries for products
export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
          tags
          productType
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      tags
      productType
    }
  }
`;

// Types for Shopify data
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  tags: string[];
  productType: string;
}

export interface ShopifyProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Helper function to fetch products
export async function fetchShopifyProducts(first: number = 20, after?: string) {
  try {
    if (!SHOPIFY_STOREFRONT_URL || !SHOPIFY_STOREFRONT_TOKEN) {
      throw new Error('Shopify Storefront API not configured');
    }

    const variables = { first, after };
    const data = await shopifyClient.request<ShopifyProductsResponse>(GET_PRODUCTS_QUERY, variables);
    return data;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

// Helper function to fetch a single product
export async function fetchShopifyProduct(handle: string) {
  try {
    if (!SHOPIFY_STOREFRONT_URL || !SHOPIFY_STOREFRONT_TOKEN) {
      throw new Error('Shopify Storefront API not configured');
    }

    const variables = { handle };
    const data = await shopifyClient.request<{ product: ShopifyProduct }>(GET_PRODUCT_BY_HANDLE_QUERY, variables);
    return data.product;
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    throw error;
  }
}
