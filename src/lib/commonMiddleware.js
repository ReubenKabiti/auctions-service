import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import middy from "@middy/core";

export default handler => middy(handler).use([ httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler() ]);
