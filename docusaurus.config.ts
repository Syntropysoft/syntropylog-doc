import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const LATEST_VERSION = '0.7.0';

const config: Config = {
  title: 'SyntropyLog',
  tagline: 'From Chaos to Clarity - The Observability Framework for High-Performance Teams',
  favicon: '/favicon.ico',
  
  // Version information
  customFields: {
    version: LATEST_VERSION,
    releaseDate: '2025-07-25',
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://syntropysoft.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/syntropylog-doc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Syntropysoft', // Usually your GitHub org/user name.
  projectName: 'syntropylog-doc', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Syntropysoft/SyntropyLog/tree/main/docs-docusaurus/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/syntropylog-social-card.jpg',
    navbar: {
      title: 'SyntropyLog',
      logo: {
        alt: 'SyntropyLog Logo',
        src: 'img/beaconLog-2-new.png',
        width: 40,
        height: 40,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/examples', label: 'Examples', position: 'left' },
        {
          href: 'https://github.com/Syntropysoft/SyntropyLog',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/syntropylog',
          label: 'NPM',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value: `<span class="version-badge">v${LATEST_VERSION}</span>`,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/',
            },
            {
              label: 'Examples',
              to: '/examples',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Syntropysoft/SyntropyLog',
            },
            {
              label: 'NPM Package',
              href: 'https://www.npmjs.com/package/syntropylog',
            },
            {
              label: 'Issues',
              href: 'https://github.com/Syntropysoft/SyntropyLog/issues',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Examples Repository',
              href: 'https://github.com/Syntropysoft/syntropylog-examples-',
            },
            {
              label: 'Adapters Package',
              href: 'https://www.npmjs.com/package/@syntropylog/adapters',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Syntropysoft. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
