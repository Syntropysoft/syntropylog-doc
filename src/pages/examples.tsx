import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Examples(): React.JSX.Element {
  return (
    <Layout
      title="SyntropyLog Examples"
      description="Complete examples demonstrating SyntropyLog features from basic to enterprise patterns">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <h1>SyntropyLog Examples</h1>
            <p className="text--lg">
              Complete examples demonstrating SyntropyLog features from basic setup to enterprise patterns.
              All examples are production-ready and include comprehensive documentation.
            </p>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h2>✅ Complete & Tested Examples</h2>
            <p className="text--lg">
              These examples are fully functional and ready for production use. All include complete boilerplate, 
              context propagation, structured logging, and automatic termination.
            </p>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>🚀 Core Framework Features (00-09)</h3>
            <div className="row">
              <div className="col col--6">
                <h4>Basic Setup</h4>
                <ul>
                  <li><strong>00-setup-initialization</strong> - Basic framework initialization</li>
                  <li><strong>01-hello-world</strong> - Simple logging example</li>
                  <li><strong>02-basic-context</strong> - Context management basics</li>
                  <li><strong>03-context-ts</strong> - TypeScript context patterns</li>
                </ul>
              </div>
              <div className="col col--6">
                <h4>Configuration</h4>
                <ul>
                  <li><strong>04-logging-levels-transports</strong> - Log levels and transports</li>
                  <li><strong>05-universal-context-patterns</strong> - Universal context patterns</li>
                  <li><strong>06-error-handling</strong> - Error handling strategies</li>
                  <li><strong>07-logger-configuration</strong> - Advanced logger configuration</li>
                  <li><strong>08-logging-matrix</strong> - Smart context logging matrix</li>
                  <li><strong>09-http-configuration</strong> - HTTP client configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>🌐 HTTP & Redis Integration (10-13)</h3>
            <div className="row">
              <div className="col col--6">
                <h4>HTTP Configuration</h4>
                <ul>
                  <li><strong>10-basic-http-correlation</strong> - HTTP request correlation</li>
                  <li><strong>11-custom-adapter</strong> - Custom HTTP adapters</li>
                </ul>
              </div>
              <div className="col col--6">
                <h4>Framework Integration</h4>
                <ul>
                  <li><strong>12-http-redis-axios</strong> - HTTP + Redis + Express</li>
                  <li><strong>13-http-redis-fastify</strong> - Framework agnosticism demo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>📡 Message Brokers & Correlation (20-24)</h3>
            <div className="row">
              <div className="col col--6">
                <h4>Basic Integration</h4>
                <ul>
                  <li><strong>20-basic-kafka-correlation</strong> - Kafka integration</li>
                  <li><strong>21-basic-rabbitmq-broker</strong> - RabbitMQ integration</li>
                  <li><strong>22-basic-nats-broker</strong> - NATS integration</li>
                </ul>
              </div>
              <div className="col col--6">
                <h4>Advanced Patterns</h4>
                <ul>
                  <li><strong>23-kafka-full-stack</strong> - Kafka distributed tracing</li>
                  <li><strong>24-full-stack-nats</strong> - Advanced NATS microservices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h2>🚧 In Development Examples</h2>
            <p className="text--lg">
              These examples are currently in development and will be available in future releases.
            </p>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>🔧 Advanced Framework Features (14-19)</h3>
            <div className="row">
              <div className="col col--6">
                <h4>Framework Integration</h4>
                <ul>
                  <li><strong>14-http-redis-nestjs</strong> - NestJS framework integration</li>
                  <li><strong>15-http-redis-koa</strong> - Koa framework integration</li>
                  <li><strong>16-http-redis-hapi</strong> - Hapi framework integration</li>
                </ul>
              </div>
              <div className="col col--6">
                <h4>Custom Features</h4>
                <ul>
                  <li><strong>17-custom-serializers</strong> - Custom data serialization patterns</li>
                  <li><strong>18-custom-transports</strong> - Custom logging transport patterns</li>
                  <li><strong>19-doctor-cli</strong> - Configuration validation with Doctor CLI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>🏢 Enterprise Patterns (25-27)</h3>
            <div className="row">
              <div className="col col--12">
                <ul>
                  <li><strong>25-production-configuration</strong> - Production-ready configuration patterns</li>
                  <li><strong>26-advanced-context</strong> - Advanced context management patterns</li>
                  <li><strong>27-complete-enterprise-app</strong> - Complete enterprise application example</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h2>🎯 Getting Started</h2>
            <div className="alert alert--info">
              <h4>Ready to try the examples?</h4>
              <p>
                All examples are available in the{' '}
                <a href="https://github.com/Syntropysoft/syntropylog-examples-">
                  syntropylog-examples repository
                </a>
                . Each complete example includes:
              </p>
              <ul>
                <li>✅ Complete boilerplate with graceful shutdown</li>
                <li>✅ Context propagation with correlation IDs</li>
                <li>✅ Structured logging with ClassicConsoleTransport</li>
                <li>✅ Automatic termination without manual intervention</li>
                <li>✅ Real integration with external services (Redis, Kafka, etc.)</li>
                <li>✅ Progressive learning from basic to advanced concepts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12">
            <h3>🐳 Docker Services</h3>
            <p>
              Some examples require external services. We provide Docker Compose files for easy setup:
            </p>
            <div className="row">
              <div className="col col--6">
                <h4>Redis Examples (12, 13)</h4>
                <pre><code>docker-compose up -d redis</code></pre>
              </div>
              <div className="col col--6">
                <h4>Message Brokers (20, 21, 22, 23, 24)</h4>
                <pre><code>docker-compose up -d</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-vert--lg">
          <div className="col col--12 text--center">
            <Link
              className="button button--primary button--lg"
              href="https://github.com/Syntropysoft/syntropylog-examples-">
              View All Examples on GitHub
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
} 