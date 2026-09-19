// Site Configuration
// Centralize all settings here, do not hardcode in components.

export const siteConfig = {
  // Site title — displayed in nav, footer, and page titles
  title: "Digital Garden🍂",

  // Site heading - displayed in heading page
  heading: "Welcome to my Digital Garden🍂",

  // Site description — used in meta tags and hero section
  description: "This is where I planted all the interseting things rattling around in my head before they disappear. Second brain, digital garden, open scratchpad, whatever the label, it's where my ideas get room to breathe.",

  // Author name — used in footer and meta author tag
  author: "Lukman",

  // Site URL — set before deployment (e.g., https://example.com)
  // Used for RSS feed and SEO
  site: "https://belajar-jarkom.netlify.app",

  // HTML lang attribute — affects SEO and accessibility
  lang: "en",

  // Navigation links — displayed in capsule nav bar
  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Tags", href: "/tags" },
  ],

  // Social links — leave empty to hide
  social: {
    github: "https://github.com/thheor",
  },

  // Feature toggles
  features: {
    readingProgress: true, // Show reading progress bar on post pages
    backToTop: true, // Show back to top button
    callout: true, // Show callout components in blog posts
    lightbox: true, // Enable image lightbox on click
    rss: true, // Enable RSS feed
    search: true, // Enable client-side search (Fuse.js)
  },
};

export type SiteConfig = typeof siteConfig;
