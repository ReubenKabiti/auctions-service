import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";

const db = new DynamoDBClient();

async function getAuction(event, context) {

  const { id } = event.pathParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: { S: id } },
    UpdateExpression: { S: "set highestBid.amount = :amount"},
  }

  try {

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  }
}

export const handler = commonMiddleware(getAuction);
