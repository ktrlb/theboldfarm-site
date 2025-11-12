# The Bold Farm Website

A modern, responsive website for The Bold Farm homestead, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach that works beautifully on all devices
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Content Management**: Simple admin panel for managing animals and products
- **E-commerce Ready**: Product catalog with pricing and inventory management
- **Animal Catalog**: Goat inventory with detailed information and pricing
- **Contact Forms**: Easy communication with potential customers
- **SEO Optimized**: Proper meta tags and structured content

## Pages

- **Home**: Hero section with farm overview and featured services
- **About**: Farm story, values, and mission
- **Our Animals**: Gallery showcasing goats, cows, chickens, and farm dogs
- **Goats for Sale**: Detailed catalog with pricing and deposit system
- **Shop**: Homestead products like soap, t-shirts, and farm goods
- **Contact**: Contact form and farm information
- **Admin**: Content management panel for farm updates

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Icons**: Lucide React
- **Database**: Neon
- **Payments**: Stripe (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd theboldfarm-site
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Content Management

The website includes a simple admin panel at `/admin` for managing:

- **Goats**: Add, edit, and remove goats from your inventory
- **Products**: Manage shop items, pricing, and availability

### Adding New Goats

1. Navigate to `/admin`
2. Click "Add Goat"
3. Fill in the details:
   - Name, type, age, price
   - Registration status
   - Dam/Sire information
   - Bio and description
   - Availability status

### Managing Products

1. Navigate to `/admin`
2. Click "Add Product"
3. Fill in the details:
   - Name, category, price
   - Description
   - Stock status
   - Featured status

## Customization

### Colors and Branding

The color scheme is defined in `src/app/globals.css`. The current theme uses warm, earthy tones perfect for a farm website:

- Primary: Orange (#f97316)
- Background: Cream/white
- Text: Dark gray/black

### Adding New Pages

1. Create a new file in `src/app/` directory
2. Follow the existing page structure with Navigation and Footer components
3. Add the route to the navigation component

### Adding New Components

1. Create components in `src/components/`
2. Use Shadcn UI components for consistency
3. Follow the established patterns for styling and structure

## Future Enhancements

- **Payment Processing**: Integrate Stripe for deposits and product purchases
- **Blog/News**: Add a blog section for farm updates
- **Workshop Registration**: Online booking for future workshops
- **Inventory Tracking**: Advanced inventory management system

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push



## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/            # About page
│   ├── admin/            # Admin panel
│   ├── animals/          # Animals showcase
│   ├── contact/          # Contact page
│   ├── goats/            # Goats for sale
│   ├── shop/             # Shop page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── admin-panel.tsx   # Admin interface
│   ├── footer.tsx        # Site footer
│   └── navigation.tsx    # Site navigation
└── lib/                  # Utility functions
    └── utils.ts          # Shadcn UI utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, contact:
- Email: karlie@theboldfarm.com
- Website: [theboldfarm.com](https://theboldfarm.com)

---

Built with ❤️ for The Bold Farm
