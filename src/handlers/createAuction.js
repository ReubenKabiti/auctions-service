import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const db = new DynamoDBClient();

async function createAuction(event, context) {
  let { title } = event.body;

  const now = new Date(Date.now());

  const auction = {
    id: {S: uuid()},
    title: {S: title},
    status: {S: "OPEN"},
    createdAt: {S: now.toISOString()},
    highestBid: {M: {
      amount: {N: 0},
    }},
  };

  try {
    await db.send(new PutItemCommand({
      TableName: process.env.AUCTIONS_TABLE_NAME, 
      Item: auction
    }));
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(createAuction);


