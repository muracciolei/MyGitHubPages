# GitHub Pages Dashboard - Specification

## 1. Project Overview

- **Project name**: GitHub Pages Dashboard
- **Type**: Single-page web application (vanilla HTML/CSS/JS)
- **Core functionality**: Fetch and display GitHub repositories with GitHub Pages enabled for a given user/organization
- **Target users**: Developers wanting to showcase their GitHub Pages websites

## 2. UI/UX Specification

### Layout Structure

- **Header**: Fixed top navigation bar (height: 64px)
  - Logo/title on left
  - Search input centered
  - View toggle + sort dropdown on right
- **Main content**: 
  - Stats bar (repo count, pages count)
  - Filter bar (language filter dropdown)
  - Repository grid/list
- **Footer**: Minimal footer with credits

### Responsive Breakpoints
- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Visual Design

**Color Palette (Dark Theme - Default)**
- Background: #0d1117 (GitHub dark)
- Surface: #161b22
- Surface elevated: #21262d
- Border: #30363d
- Primary: #58a6ff (GitHub blue)
- Primary hover: #79c0ff
- Accent: #238636 (green for stars)
- Text primary: #f0f6fc
- Text secondary: #8b949e
- Text muted: #6e7681

**Color Palette (Light Theme)**
- Background: #ffffff
- Surface: #f6f8fa
- Surface elevated: #ffffff
- Border: #d0d7de
- Primary: #0969da
- Primary hover: #0550ae
- Accent: #1a7f37
- Text primary: #1f2328
- Text secondary: #656d76
- Text muted: #8c959f

**Typography**
- Font family: `'JetBrains Mono', 'Fira Code', monospace` for headings
- Font family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` for body
- Heading sizes: h1: 28px, h2: 22px, h3: 18px
- Body: 14px
- Small: 12px

**Spacing System**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

**Visual Effects**
- Card shadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`
- Hover shadow: `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`
- Border radius: 6px (cards), 6px (buttons), 8px (inputs)
- Transitions: 200ms ease-out

### Components

**Navigation Bar**
- Logo: "Pages Dashboard" text with icon
- Search input: 300px width, icon prefix
- Theme toggle: sun/moon icon button
- View toggle: grid/list icon buttons
- Sort dropdown: Stars, Updated, Name options

**Stats Bar**
- Total repos count pill
- Pages enabled count pill
- Horizontal layout, centered

**Repository Card**
- Repository name (link, primary color on hover)
- Description (2 lines max, ellipsis overflow)
- Language badge with color dot
- Stars count with star icon
- Last updated relative time
- "View Site" button linking to GitHub Pages URL

**Repository List Item**
- Same info as card but horizontal layout
- Name on left, details on right

**Pagination**
- Previous/Next buttons
- Page number display
- Simple numeric pagination

**Empty State**
- Icon + message when no repos found

**Error State**
- Alert box for API errors
- Rate limit message with reset time

## 3. Functionality Specification

### Core Features

1. **Fetch Repositories**
   - Use GitHub REST API: `GET /users/{username}/repos?per_page=100&sort=updated`
   - Filter client-side for `has_pages: true`
   - Support pagination viaLink header for >100 repos

2. **Search**
   - Filter repos by name (case-insensitive)
   - Real-time filtering as user types (debounced 300ms)

3. **Language Filter**
   - Dropdown populated from repos' languages
   - "All Languages" default option

4. **Sort**
   - Stars (descending)
   - Last updated (descending)
   - Name (alphabetical)

5. **View Toggle**
   - Grid view (default): 3 columns desktop
   - List view: horizontal cards

6. **Theme Toggle**
   - Dark/Light theme switch
   - Persist preference in localStorage

7. **Pagination**
   - 10 repos per page
   - Previous/Next navigation

### User Interactions
- Click card title → navigate to repo on GitHub
- Click "View Site" → open GitHub Pages URL in new tab
- Click language badge → filter by that language
- Click theme toggle → switch theme
- Hover card → subtle lift effect

### Data Handling
- Cache repos in memory during session
- Display loading skeleton while fetching
- Format dates as relative time ("2 days ago")

### Edge Cases
- No GitHub Pages repos: Show empty state message
- API rate limit: Display error with estimated reset time
- Network error: Show retry button
- Missing description: Show "No description"
- Missing language: Show "Unknown"

## 4. Acceptance Criteria

- [ ] Page loads within 3 seconds
- [ ] Shows all repos with has_pages: true for user muracciolei
- [ ] Search filters repos by name in real-time
- [ ] Language filter works correctly
- [ ] Sort changes order correctly
- [ ] Grid/List view toggle works
- [ ] Theme toggle persists preference
- [ ] Pagination shows 10 repos per page
- [ ] Cards show all required info
- [ ] Responsive at all breakpoints
- [ ] Error states display appropriately
- [ ] Empty state shows when no pages repos found

## 5. Configuration

### User Customization
To display a different user's repositories, edit line in `js/app.js`:
```javascript
const GITHUB_USERNAME = 'muracciolei'; // Change this value
```