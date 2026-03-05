# Omni-Dashboard (OmniMap) - ScrollVerse Real-Time Intelligence

## Overview

The Omni-Dashboard (OmniMap) is a centralized, real-time dashboard interface built with Next.js that provides comprehensive visualization of ScrollVerse operational data across all 50 compounds. It displays critical metrics including yield flows, security status, and deployment progress.

## Features

### 1. Yield-Flow Tracker
**Purpose**: Displays ScrollCoin Zakat Flow (7.77%) across all 50 compounds

**Key Metrics**:
- Total number of compounds (50)
- Total yield across all compounds
- Zakat flow at 7.77% rate
- Individual compound yield breakdowns
- Real-time yield visualization

**Visualizations**:
- Line chart showing yield and zakat trends across recent compounds
- Summary statistics cards
- Detailed table of recent compound yields

### 2. Security Health Map
**Purpose**: Shows real-time statuses for ScrollVerse Security Protocols

**Key Metrics**:
- Number of secure protocols
- Warning count
- Alert count
- Overall system health percentage

**Features**:
- Real-time status monitoring (updates every 10 seconds)
- Color-coded status indicators (Secure/Warning/Alert)
- Last check timestamps
- Protocol uptime percentages
- Individual protocol health cards

**Monitored Protocols**:
- ScrollVerse Data Integrity
- SDIC TimeLock Protocol
- Family Access Control
- Yield Flow Protection
- Compound Security Layer
- Network Redundancy
- Encryption Gateway
- Access Logging System

### 3. Deployment Status Tracker
**Purpose**: Visualizes OmniTensor deployment progress and operational yields

**Key Metrics**:
- Active nodes count
- Nodes being activated
- Pending deployments
- Offline nodes
- Total operational yield
- Deployment progress percentage

**Visualizations**:
- Bar chart of active node yields
- Status breakdown cards
- Individual node deployment cards with hardware details
- Real-time yield calculations per cycle

**Hardware Types**:
- OmniTensor-X1
- OmniTensor-X2
- OmniTensor-Pro
- OmniTensor-Elite

## Technology Stack

### Frontend Framework
- **Next.js 16.0.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **Lucide React**: Icon library for modern, consistent icons
- **Recharts**: Composable charting library for data visualization

### Key Libraries
```json
{
  "next": "^16.0.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "lucide-react": "^0.469.0",
  "recharts": "^2.15.0",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.0.0"
}
```

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Setup Steps

1. **Navigate to the dashboard directory**:
```bash
cd omni-dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

5. **Start production server**:
```bash
npm start
```

## Project Structure

```
omni-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   └── dashboard/
│       ├── YieldFlowTracker.tsx           # Yield flow visualization
│       ├── SecurityHealthMap.tsx          # Security status monitoring
│       └── DeploymentStatusTracker.tsx    # Deployment progress tracking
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── next.config.ts         # Next.js configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server (default: http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Component Development

All dashboard components are located in `components/dashboard/` and follow these patterns:

1. **Client-Side Components**: All dashboard components use `'use client'` directive for interactive features
2. **TypeScript**: Full type safety with interfaces for data structures
3. **Responsive Design**: Mobile-first approach with Tailwind CSS
4. **Real-Time Updates**: Components update periodically to simulate live data

### Customization

#### Updating Data Sources

To connect real data sources instead of simulated data:

1. **Yield Flow Tracker** (`YieldFlowTracker.tsx`):
   - Replace `generateYieldData()` function with API calls to your yield data service
   - Update the data structure to match your backend format

2. **Security Health Map** (`SecurityHealthMap.tsx`):
   - Replace `generateSecurityProtocols()` with real security monitoring API
   - Adjust refresh interval as needed (currently 10 seconds)

3. **Deployment Status Tracker** (`DeploymentStatusTracker.tsx`):
   - Replace `generateDeploymentData()` with actual OmniTensor node status API
   - Update hardware types and node configurations as needed

#### Styling Customization

Colors and themes can be customized in:
- `tailwind.config.ts` - Tailwind theme configuration
- `app/globals.css` - Global CSS styles
- Component-level styling using Tailwind classes

## Deployment

### Vercel Deployment (Recommended)

The dashboard is optimized for Vercel deployment:

1. **Push to GitHub**:
```bash
git add omni-dashboard/
git commit -m "Add Omni-Dashboard"
git push
```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Set root directory to `omni-dashboard`
   - Deploy with default Next.js settings

### Docker Deployment

Create a `Dockerfile` in the omni-dashboard directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t omni-dashboard .
docker run -p 3000:3000 omni-dashboard
```

### Environment Variables

For production deployments, consider adding environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.scrollverse.com
NEXT_PUBLIC_REFRESH_INTERVAL=10000
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Integration with SDIC

The Omni-Dashboard is designed to work seamlessly with the SDIC_TimeLock smart contract:

1. **Data Integrity**: All displayed data can be verified against the SDIC blockchain ledger
2. **Real-Time Sync**: Dashboard can subscribe to SDIC contract events for live updates
3. **Audit Trail**: Every data point can be traced back to a specific SDIC entry

### Connecting to SDIC

To enable blockchain integration:

1. Install Web3 libraries:
```bash
npm install ethers
```

2. Create a Web3 context provider to connect to your Ethereum node

3. Use contract events to update dashboard data in real-time:
```typescript
const contract = new ethers.Contract(contractAddress, abi, provider);
contract.on("DataStored", (entryId, dataHash, timestamp, submitter, dataType) => {
  // Update dashboard data
});
```

## Performance Optimization

### Current Optimizations
- Static page generation where possible
- Component-level code splitting
- Image optimization with Next.js Image component
- CSS optimization with Tailwind purging

### Recommended Enhancements
- Implement data caching with React Query or SWR
- Add service workers for offline capability
- Enable incremental static regeneration for semi-static data
- Implement virtual scrolling for large data lists

## Browser Support

The dashboard supports all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

The dashboard follows WCAG 2.1 Level AA guidelines:
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Security

### Best Practices Implemented
- No sensitive data stored in client-side code
- Environment variables for configuration
- HTTPS enforced in production
- Content Security Policy headers
- XSS protection through React's built-in escaping

### Recommendations for Production
- Enable rate limiting on API endpoints
- Implement authentication/authorization
- Use secure WebSocket connections for real-time data
- Regular security audits and dependency updates

## Monitoring and Analytics

Consider adding:
- Google Analytics or similar for usage tracking
- Error tracking with Sentry
- Performance monitoring with Vercel Analytics
- Custom event tracking for user interactions

## Troubleshooting

### Common Issues

**Build Fails**:
- Ensure Node.js version is 18.x or higher
- Clear `.next` directory and `node_modules`, then reinstall
- Check for TypeScript errors with `npm run lint`

**Styles Not Loading**:
- Verify Tailwind CSS is properly configured
- Check `globals.css` is imported in layout
- Clear browser cache

**Charts Not Rendering**:
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors
- Verify data format matches component expectations

## Future Enhancements

Planned features for future versions:
- WebSocket integration for true real-time updates
- Historical data charts and trend analysis
- Custom alert thresholds and notifications
- Multi-user support with role-based access
- Export functionality (PDF, CSV reports)
- Mobile app version
- Advanced filtering and search capabilities
- Integration with additional ScrollVerse protocols

## Contributing

For contributions:
1. Follow the existing code structure and patterns
2. Maintain TypeScript type safety
3. Use Tailwind CSS for styling consistency
4. Test responsive design on multiple screen sizes
5. Document any new components or features

## License

MIT License - See LICENSE file for details

## Author

**Chais Kenyatta Hill**  
Founder, Omnitech1™  
Architect of ScrollVerse Infinity Loop

## Support

For issues or questions about the Omni-Dashboard, please refer to the main repository documentation or create an issue on GitHub.

---

**ScrollVerse Infinity Loop** | Omnitech1™ | © 2025
