import assert from "assert";
import { AxiosError } from "axios";
import { CurlHelper } from "./curlHelper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...args: any[]) => any;

type TryCatchWrapper<F extends GenericFunction> = (
  ...args: Parameters<F>
) => Promise<ReturnType<F> | AxiosError>;

export async function sendRequest<F extends GenericFunction>(
  fn: F,
  ...args: Parameters<F>
): Promise<ReturnType<F> | AxiosError> {
  try {
    const response = await fn(...args);
    const curl = new CurlHelper(response.config);
    console.log("Request", curl.generateCommand());
    console.log("Response", JSON.stringify(response.data));
    return response as ReturnType<F>;
  } catch (error) {
    assert(error instanceof AxiosError);
    if (error.config) {
      const curl = new CurlHelper(error.config);
      console.log("Request", curl.generateCommand());
    }
    console.log(
      "Response",
      `Response error. Status code: ${error.response?.status}`
    );
    console.log("Response", JSON.stringify(error.response?.data));
    return error;
  }
}
