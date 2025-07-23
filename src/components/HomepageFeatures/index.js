import clsx from 'clsx';
import Heading from '@theme/Heading';

const FeatureList = [
  {
    title: '🚀 Production Ready',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        94.1% test coverage, comprehensive examples, and battle-tested in production environments.
        Built for high-performance teams who need reliability.
      </>
    ),
  },
  {
    title: '🔄 Framework Agnostic',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Works seamlessly across Express, Fastify, Koa, NestJS, and any Node.js application type.
        No vendor lock-in, no framework dependencies.
      </>
    ),
  },
  {
    title: '🔗 Automatic Correlation',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Distributed tracing with correlation IDs across services, HTTP calls, and message brokers.
        Zero configuration required.
      </>
    ),
  },
  {
    title: '🎯 Zero Boilerplate',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Get started in 30 seconds with automatic context propagation and structured logging.
        Focus on your business logic, not observability setup.
      </>
    ),
  },
  {
    title: '🛡️ Security First',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Built-in data masking, secure configurations, and compliance-ready logging.
        Protect sensitive data automatically.
      </>
    ),
  },
  {
    title: '⚡ High Performance',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
              <>
          Optimized for production with minimal overhead and intelligent log scoping.
          45,000+ ops/sec with less than 1ms latency.
        </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={clsx('featureSvg')} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={clsx('margin-top--xl')}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
} 