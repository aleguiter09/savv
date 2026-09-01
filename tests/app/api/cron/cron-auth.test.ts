import { afterEach, describe, expect, it } from "vitest";
import { isCronAuthorized } from "@/app/api/cron/cron-auth";
import { mockRequest, withCronSecret } from "../../../helpers/mocks/request";

describe("isCronAuthorized", () => {
  afterEach(() => {
    withCronSecret()();
  });

  it("returns missing_secret when CRON_SECRET is not configured", () => {
    delete process.env.CRON_SECRET;

    expect(isCronAuthorized(mockRequest())).toEqual({
      authorized: false,
      reason: "missing_secret",
    });
  });

  it("returns missing_header when Authorization is absent", () => {
    const restore = withCronSecret();

    expect(isCronAuthorized(mockRequest())).toEqual({
      authorized: false,
      reason: "missing_header",
    });

    restore();
  });

  it("authorizes valid Bearer token", () => {
    const restore = withCronSecret("my-secret");

    expect(
      isCronAuthorized(
        mockRequest({ authorization: "Bearer my-secret" }),
      ),
    ).toEqual({ authorized: true });

    restore();
  });
});
