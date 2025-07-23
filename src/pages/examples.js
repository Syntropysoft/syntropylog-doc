import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';

function ExamplesHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Examples
        </Heading>
        <p className="hero__subtitle">
          Learn SyntropyLog progressively with real-world examples
        </p>
      </div>
    </header>
  );
}

const ExampleCategories = [
  {
    title: 'Foundation Examples (00-09)',
    description: 'Start here if you\'re new to SyntropyLog',
    examples: [
      { number: '00', title: 'Setup & Initialization', description: 'Basic initialization patterns' },
      { number: '01', title: 'Hello World', description: 'Your first SyntropyLog application' },
      { number: '02', title: 'Basic Context', description: 'Understanding context management' },
      { number: '03', title: 'TypeScript Context', description: 'Type-safe context with TypeScript' },
      { number: '04', title: 'Logging Levels & Transports', description: 'Different log formats and levels' },
      { number: '05', title: 'Configuration Patterns', description: 'Advanced configuration strategies' },
      { number: '06', title: 'Error Handling', description: 'Best practices for error logging' },
      { number: '07', title: 'Performance Monitoring', description: 'Monitoring application performance' },
      { number: '08', title: 'Testing Strategies', description: 'How to test with SyntropyLog' },
      { number: '09', title: 'Best Practices', description: 'Production-ready patterns' },
    ]
  },
  {
    title: 'HTTP & Redis Examples (10-13)',
    description: 'Learn HTTP instrumentation and Redis integration',
    examples: [
      { number: '10', title: 'Basic HTTP Correlation', description: 'HTTP client instrumentation' },
      { number: '11', title: 'Custom HTTP Adapters', description: 'Creating custom HTTP adapters' },
      { number: '12', title: 'HTTP + Redis + Axios', description: 'Full-stack with Express' },
      { number: '13', title: 'HTTP + Redis + Fastify', description: 'Full-stack with Fastify' },
    ]
  },
  {
    title: 'Message Broker Examples (20-24)',
    description: 'Advanced patterns with message brokers',
    examples: [
      { number: '20', title: 'Basic Kafka Correlation', description: 'Kafka integration' },
      { number: '21', title: 'Basic RabbitMQ Broker', description: 'RabbitMQ integration' },
      { number: '22', title: 'Basic NATS Broker', description: 'NATS integration' },
      { number: '23', title: 'Kafka Full Stack', description: 'Complete Kafka application' },
      { number: '24', title: 'NATS Full Stack', description: 'Complete NATS microservices' },
    ]
  }
];

function ExampleCard({ example }) {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className="card">
        <div className="card__header">
          <h3>{example.number} - {example.title}</h3>
        </div>
        <div className="card__body">
          <p>{example.description}</p>
        </div>
        <div className="card__footer">
          <Link
            className="button button--primary button--block"
            to={`/docs/examples/${example.number.toLowerCase().replace(' ', '-')}`}>
            View Example
          </Link>
        </div>
      </div>
    </div>
  );
}

function ExampleCategory({ category }) {
  return (
    <div className="margin-bottom--xl">
      <Heading as="h2">{category.title}</Heading>
      <p className="margin-bottom--lg">{category.description}</p>
      <div className="row">
        {category.examples.map((example, idx) => (
          <ExampleCard key={idx} example={example} />
        ))}
      </div>
    </div>
  );
}

export default function Examples() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Examples - SyntropyLog"
      description="Learn SyntropyLog progressively with real-world examples">
      <ExamplesHeader />
      <main>
        <div className="container margin-top--xl">
          {ExampleCategories.map((category, idx) => (
            <ExampleCategory key={idx} category={category} />
          ))}
          
          <div className="margin-top--xl padding--lg" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px'}}>
            <Heading as="h2">Running Examples</Heading>
            <p>Each example includes:</p>
            <ul>
              <li>✅ <strong>Complete source code</strong> - Ready to run</li>
              <li>✅ <strong>Docker setup</strong> - For services like Redis, Kafka, etc.</li>
              <li>✅ <strong>Step-by-step instructions</strong> - Clear explanations</li>
              <li>✅ <strong>Expected output</strong> - Know what to expect</li>
            </ul>
            
            <Heading as="h3">Quick Start</Heading>
            <div className="margin-bottom--md">
              <code>
                # Navigate to any example<br/>
                cd sub-modules/examples/01-hello-world<br/><br/>
                # Install dependencies<br/>
                npm install<br/><br/>
                # Run the example<br/>
                npm start
              </code>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
} 