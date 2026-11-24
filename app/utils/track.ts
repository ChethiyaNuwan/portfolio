// Thin wrapper over PostHog so components can record events without caring whether analytics is on. Calls made before
// PostHog has loaded (it loads when the browser is idle) are queued; with no key configured they are dropped.
type Props = Record<string, string | number | boolean | undefined>;
type Sink = (event: string, props?: Props) => void;

let sink: Sink | null = null;
let queue: [string, Props | undefined][] = [];

export function setTrackSink(fn: Sink | null) {
  sink = fn;
  if (fn) for (const [e, p] of queue.splice(0)) fn(e, p);
  else queue = [];
}

export function track(event: string, props?: Props) {
  if (!import.meta.client) return;
  if (sink) sink(event, props);
  else if (queue.length < 50) queue.push([event, props]);
}
