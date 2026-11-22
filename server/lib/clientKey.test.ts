import { describe, expect, test } from "bun:test";
import { clientKey } from "./clientKey";

describe("clientKey", () => {
  test("without a trusted proxy the forwarded header is ignored", () => {
    expect(clientKey({ forwardedFor: "6.6.6.6", socketIp: "10.0.0.5", trustProxy: false })).toBe("10.0.0.5");
    expect(clientKey({ forwardedFor: "6.6.6.6", socketIp: undefined, trustProxy: false })).toBe("unknown");
  });

  test("with a trusted proxy the rightmost entry (appended by the proxy) is used, so a spoofed leftmost value cannot rotate the key", () => {
    expect(clientKey({ forwardedFor: "1.1.1.1, 2.2.2.2", socketIp: "", trustProxy: true })).toBe("2.2.2.2");
    expect(clientKey({ forwardedFor: "random-a, 9.9.9.9", socketIp: "", trustProxy: true })).toBe("9.9.9.9");
    expect(clientKey({ forwardedFor: "random-b, 9.9.9.9", socketIp: "", trustProxy: true })).toBe("9.9.9.9");
  });

  test("trusted proxy without a header falls back to the socket address then unknown", () => {
    expect(clientKey({ forwardedFor: undefined, socketIp: "10.0.0.5", trustProxy: true })).toBe("10.0.0.5");
    expect(clientKey({ forwardedFor: " ", socketIp: undefined, trustProxy: true })).toBe("unknown");
  });
});
