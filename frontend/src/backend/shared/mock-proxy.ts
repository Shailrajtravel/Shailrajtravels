// A proxy that absorbs all property accesses and function calls
const noop = () => {};
const proxy = new Proxy(noop, {
  get: () => proxy,
  apply: () => proxy,
  construct: () => proxy
});
export default proxy;
