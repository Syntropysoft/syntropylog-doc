// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SyntropyLog',
  tagline: 'The Observability Framework for High-Performance Teams',
  favicon: './assets/favicon.ico',

  // Set the production url of your site here
  url: 'https://syntropylog.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/syntropylog-doc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Syntropysoft', // Usually your GitHub org/user name.
  projectName: 'SyntropyLog', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Syntropysoft/SyntropyLog/tree/main/docs-docusaurus/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Syntropysoft/SyntropyLog/tree/main/docs-docusaurus/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
          {to: '/examples', label: 'Examples', position: 'left'},
          {to: '/api', label: 'API', position: 'left'},
          {to: '/quality', label: 'Quality', position: 'left'},
          {
            href: 'https://github.com/Syntropysoft/SyntropyLog',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Examples',
                to: '/examples',
              },
              {
                label: 'API Reference',
                to: '/api',
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
                label: 'Issues',
                href: 'https://github.com/Syntropysoft/SyntropyLog/issues',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/Syntropysoft/SyntropyLog/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Quality & CI/CD',
                to: '/quality',
              },
              {
                label: 'NPM Package',
                href: 'https://www.npmjs.com/package/syntropylog',
              },
              {
                label: 'Adapters Package',
                href: 'https://www.npmjs.com/package/@syntropylog/adapters',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} SyntropySoft. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['typescript', 'bash', 'json'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config; 