# Shopify Integration Setup Guide

This guide will help you set up Shopify integration with your The Bold Farm website.

## Prerequisites

1. A Shopify store (Basic plan or higher)
2. Access to your Shopify admin panel

## Step 1: Enable Storefront API

1. **Log into your Shopify admin panel**
2. **Go to Settings > Apps and sales channels**
3. **Click "Develop apps"**
4. **Click "Create an app"**
5. **Give your app a name** (e.g., "The Bold Farm Website")
6. **Click "Create app"**

## Step 2: Configure Storefront API

1. **In your app, click "Configure Admin API scopes"**
2. **Scroll down to "Storefront API" section**
3. **Click "Configure"**
4. **Enable the following scopes:**
   - `unauthenticated_read_product_listings` - Read products
   - `unauthenticated_read_product_inventory` - Read inventory
   - `unauthenticated_read_product_tags` - Read product tags
   - `unauthenticated_read_product_categories` - Read product categories
5. **Click "Save"**

## Step 3: Generate Storefront Access Token

1. **Go back to your app overview**
2. **Click "Install app"**
3. **Click "Install"**
4. **Go to "API credentials" tab**
5. **Under "Storefront API", click "Install"**
6. **Copy the "Storefront access token"**

## Step 4: Get Your Store URL

1. **In your Shopify admin, go to Settings > Domains**
2. **Note your primary domain** (e.g., `your-store.myshopify.com`)
3. **Your Storefront API URL will be:** `https://your-store.myshopify.com/api/2024-01/graphql.json`

## Step 5: Set Environment Variables

### For Development (.env.local)
```bash
NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL=https://your-store.myshopify.com/api/2024-01/graphql.json
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token-here
```

### For Production (Vercel)
1. **Go to your Vercel project dashboard**
2. **Click "Settings" > "Environment Variables"**
3. **Add the same variables:**
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

## Step 6: Add Products to Shopify

1. **In Shopify admin, go to Products > Add product**
2. **Fill in product details:**
   - Title
   - Description
   - Images
   - Price
   - Product type (category)
   - Tags (use "featured" for featured products)
3. **Set inventory and variants as needed**
4. **Publish the product**

## Step 7: Test the Integration

1. **Restart your development server**
2. **Visit `/shop` page**
3. **You should see your Shopify products**
4. **Test the cart functionality**

## Features Included

✅ **Product Display** - Shows all products from Shopify
✅ **Search & Filter** - Search by name, description, or tags
✅ **Category Filtering** - Filter by product type
✅ **Sorting** - Sort by name, price, or date
✅ **Shopping Cart** - Add/remove items, adjust quantities
✅ **Responsive Design** - Works on all devices
✅ **Image Support** - Displays product images from Shopify

## Cart & Checkout

The current implementation includes:
- **Local cart storage** (persists between page refreshes)
- **Add to cart functionality**
- **Cart management** (quantity, remove items)
- **Cart display** in navigation

**Note:** Checkout is currently a placeholder. To enable real checkout:
1. **Set up Shopify checkout in your store**
2. **Modify the checkout function in `src/components/cart.tsx`**
3. **Redirect to Shopify checkout with cart items**

## Troubleshooting

### Products Not Loading
- Check your environment variables
- Verify Storefront API scopes are enabled
- Check browser console for errors
- Ensure products are published in Shopify

### Cart Not Working
- Check if localStorage is enabled in browser
- Verify cart component is properly imported
- Check for JavaScript errors in console

### Images Not Displaying
- Ensure products have images in Shopify
- Check image URLs in browser network tab
- Verify image permissions in Shopify

## Advanced Customization

### Custom Product Fields
To add custom fields (e.g., farm origin, ingredients):
1. **Use Shopify metafields**
2. **Update GraphQL queries in `src/lib/shopify.ts`**
3. **Modify product display components**

### Inventory Management
The integration automatically shows stock status based on Shopify inventory.

### Product Variants
Currently uses the first available variant. To support multiple variants:
1. **Update the product display to show variant options**
2. **Modify add to cart to handle variant selection**

## Support

If you encounter issues:
1. **Check the browser console for errors**
2. **Verify Shopify API credentials**
3. **Test with a simple product first**
4. **Check Shopify API documentation**

## Next Steps

Once basic integration is working:
1. **Add more products to Shopify**
2. **Customize product display styling**
3. **Implement real checkout flow**
4. **Add product reviews/ratings**
5. **Set up abandoned cart recovery**
