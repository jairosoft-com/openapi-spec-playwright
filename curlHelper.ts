import { AxiosRequestConfig } from "axios";

export class CurlHelper {
  request: AxiosRequestConfig;

  constructor(config: AxiosRequestConfig) {
    this.request = config;
  }

  getHeaders() {
    let headers = this.request.headers,
      curlHeaders = "";

    if (Object.prototype.hasOwnProperty.call(headers, "common")) {
      headers = this.request?.headers?.[this.request.method as string];
    }

    for (const property in headers) {
      const header = `${property}:${headers[property]}`;
      curlHeaders = `${curlHeaders} -H "${header}"`;
    }

    return curlHeaders.trim();
  }

  getMethod() {
    return `-X ${this.request.method?.toUpperCase()}`;
  }

  getBody() {
    if (
      typeof this.request.data !== "undefined" &&
      this.request.data !== "" &&
      Object.keys(this.request.data).length &&
      this.request.method?.toUpperCase() !== "GET"
    ) {
      const data =
        typeof this.request.data === "object" ||
        Object.prototype.toString.call(this.request.data) === "[object Array]"
          ? JSON.stringify(this.request.data)
          : this.request.data;
      return `--data '${data}'`.trim();
    } else {
      return "";
    }
  }

  getUrl() {
    return `${this.request.url}`;
  }

  getQueryString() {
    let params = "",
      i = 0;
    for (const param in this.request.params) {
      if (i != 0) {
        params += `&${param}=${this.request.params[param]}`;
      } else {
        params = `?${param}=${this.request.params[param]}`;
      }
      i++;
    }
    return params;
  }

  getBuiltURL() {
    let url = this.getUrl();
    if (this.getQueryString() != "") {
      url = url.endsWith("/") ? url.substring(0, url.length - 1) : url;
      url += this.getQueryString();
    }

    return url.trim();
  }

  generateCommand() {
    return `curl ${this.getMethod()} ${this.getHeaders()} ${this.getBody()} "${this.getBuiltURL()}"`
      .trim()
      .replace(/\s{2,}/g, " ");
  }
}
