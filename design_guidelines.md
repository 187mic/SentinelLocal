# Sentinel Local - Design Guidelines

## Design Approach

**Selected Approach**: Modern SaaS Design System
**Rationale**: Sentinel Local is a business productivity tool handling critical marketing data and ROI decisions. The design must prioritize clarity, trust, and efficiency over visual flair. Drawing inspiration from Linear's precision, Stripe Dashboard's data clarity, and modern B2B tools' professional polish.

**Core Principles**:
1. **Trust & Professionalism** - Business owners are entrusting their marketing budget; design must feel reliable and competent
2. **Information Hierarchy** - Dense data (metrics, reviews, campaigns) must be instantly scannable
3. **Action-Oriented** - Every screen enables quick decisions (approve, escalate, optimize)
4. **Status Clarity** - Visual indicators for campaign status, review state, optimization health

---

## Typography

**Font Stack**:
- Primary: `Inter` (Google Fonts) - Clean, professional, excellent readability for data
- Monospace: `JetBrains Mono` (for metrics, numbers, codes)

**Hierarchy**:
- **Page Titles**: text-2xl, font-semibold (Dashboard, Reviews, Chat)
- **Card Headers**: text-lg, font-medium
- **Metric Values**: text-3xl, font-bold, font-mono (spend, leads, revenue numbers)
- **Metric Labels**: text-sm, font-medium, uppercase tracking-wide, text-gray-600
- **Body Text**: text-base, font-normal
- **Table Headers**: text-xs, font-semibold, uppercase tracking-wider
- **Captions/Meta**: text-sm, text-gray-500

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistency
- Component padding: p-6
- Card spacing: gap-6 between cards
- Section spacing: space-y-8 between major sections
- Form elements: space-y-4
- Tight groupings: gap-2 or gap-3

**Container Strategy**:
- Dashboard: max-w-7xl mx-auto px-6
- Forms (Login/Register): max-w-md mx-auto
- Tables: Full width within container

**Grid Patterns**:
- Dashboard Cards: grid-cols-1 md:grid-cols-3 gap-6 (three metric cards across)
- Active Campaigns: Two-column layout on desktop (status left, actions right)

---

## Component Library

### Cards & Containers
**Metric Cards** (This Week's Results, Reputation Health, Open Fires):
- Background: bg-white
- Border: border border-gray-200
- Rounded: rounded-xl
- Padding: p-6
- Shadow: shadow-sm hover:shadow-md transition-shadow
- Structure: Label on top (small caps), large number below, optional trend indicator

**Active Campaigns Section**:
- Slightly elevated card: bg-white border border-gray-200 rounded-xl p-8
- Two-column grid: Status badges left, Recent actions list right
- Include "Optimize" buttons with distinct treatment

### Status Indicators
**Badges**:
- Live/Active: bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold
- Paused/Draft: bg-yellow-50 text-yellow-700 border border-yellow-200
- Escalated/Issue: bg-red-50 text-red-700 border border-red-200
- New/Pending: bg-blue-50 text-blue-700 border border-blue-200

**Star Ratings**: 
- Use filled/unfilled star icons (Heroicons solid/outline)
- Color: text-yellow-400 for filled, text-gray-300 for empty

### Tables (Reviews Page)
- Header: bg-gray-50 border-b border-gray-200
- Rows: border-b border-gray-100, hover:bg-gray-50 transition
- Cell padding: px-6 py-4
- Compact ratings column (60px), wider content column, AI reply column with textarea readonly, actions column (120px)

### Buttons
**Primary Action** (Approve, Send, Optimize):
- bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm

**Secondary Action** (Escalate):
- bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium

**Danger Action** (rare):
- bg-red-600 hover:bg-red-700 text-white

**Icon-only buttons**: p-2 rounded-lg hover:bg-gray-100 transition

### Forms (Login/Register)
- Input fields: border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
- Labels: text-sm font-medium text-gray-700 mb-2
- Form container: bg-white border border-gray-200 rounded-xl p-8 shadow-sm
- Centered on page with max-w-md

### Chat Interface
**Message Bubbles**:
- Owner messages: bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 ml-auto max-w-lg
- Assistant messages: bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 mr-auto max-w-lg
- Timestamps: text-xs text-gray-500 mt-1
- Container: space-y-4, scrollable with h-[calc(100vh-16rem)]

**Input Box**:
- Fixed bottom position
- bg-white border-t border-gray-200 p-4
- Input: rounded-full border border-gray-300 px-6 py-3 with send button inside right edge

### Navigation
**Top Bar**:
- bg-white border-b border-gray-200 h-16
- Logo/Brand left: font-semibold text-xl
- Nav links center: text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100
- User menu right: Avatar circle + dropdown

### Optimization Actions List
- Timeline-style vertical list
- Each action: flex with timestamp badge left, action summary center, impact note as subtle text-sm text-gray-600
- Dividers: border-l-2 border-gray-200 connecting items

---

## Visual Enhancements

**Empty States**: 
- Centered icon (Heroicons outline, w-12 h-12, text-gray-400)
- Heading: text-gray-900 text-lg font-medium
- Description: text-gray-500 text-sm
- CTA button below

**Loading States**:
- Skeleton screens: bg-gray-200 animate-pulse rounded matching component shape

**Micro-interactions**:
- Smooth transitions on hover: transition-all duration-200
- Scale on button click: active:scale-95
- Minimal - only where it aids feedback

**Icons**: Use **Heroicons** (outline for navigation/secondary, solid for primary actions and status)

---

## Page-Specific Layouts

### Dashboard
1. Top bar navigation
2. Page title + breadcrumb
3. Three metric cards in grid (equal height)
4. Active Campaigns card below (full width)
5. Optimize buttons positioned within campaigns card

### Reviews Page
1. Page title with filter tabs (All / New / Escalated)
2. Full-width table
3. Inline action buttons per row
4. Pagination footer if needed

### Chat Page
1. Minimal header (just "Marketing Manager AI")
2. Scrollable message history (flex-1)
3. Fixed input at bottom
4. Sidebar could show quick action chips ("Show last week's spend", "Review top keywords")

---

## Images
**No hero images or photography needed** - this is a data-first business tool. All visual interest comes from well-organized information, clear typography, and subtle depth through shadows and borders.