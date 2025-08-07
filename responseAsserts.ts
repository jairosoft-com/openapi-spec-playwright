import { AxiosError, AxiosResponse } from "axios";

export function isAxiosErrorResponse<T>(
  response: unknown
): asserts response is AxiosError & { response: AxiosResponse } {
  if (
    !(response instanceof Error) ||
    !("isAxiosError" in response) ||
    !(response as AxiosError)
  ) {
    throw new Error(`The error is not an AxiosError`);
  }

  if (!(response as AxiosError).response) {
    throw new Error(`The AxiosError does not contain a response`);
  }
}

export function isAxiosResponse<T>(
  response: unknown
): asserts response is AxiosResponse<T> {
  if (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    "data" in response &&
    "headers" in response
  ) {
    return;
  }
  throw new Error(`The error is not an AxiosResponse`);
}
