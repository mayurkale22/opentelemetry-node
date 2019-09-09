//const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const opentelemetry = require('@opentelemetry/core');
const { BasicTracer, InMemorySpanExporter, SimpleSpanProcessor } = require('@opentelemetry/basic-tracer');
const { NoopScopeManager } = require('@opentelemetry/scope-base');

const options = {
  serviceName: 'my-service'
}
const exporter = new InMemorySpanExporter();
const tracer = new BasicTracer({scopeManager: new NoopScopeManager()});
tracer.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Initialize the OpenTelemetry APIs to use the BasicTracer bindings
opentelemetry.initGlobalTracer(tracer);

main();

function main () {
  // Create a span. A span must be closed.
  const span = opentelemetry.getTracer().startSpan('main');
  for (let i = 0; i < 10; i++) {
    doWork(span);
  }
  // Be sure to end the span.
  span.end();

  // Add short delay to allow data to export.
  setTimeout(() => {
  }, 2000);
}

function doWork (parent) {
  // Start another span. In this example, the main method already started a
  // span, so that'll be the parent span, and this will be a child span.
  const span = opentelemetry.getTracer().startSpan('doWork', {
    parent: parent
  });

  console.log('doing busy work');
  for (let i = 0; i <= 40000000; i++) {} // short delay

  // Annotate our span to capture metadata about our operation
  span.addEvent('invoking doWork').end();
}
