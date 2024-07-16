import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const db = new DynamoDBClient();

async function getAuctions(event, context) {
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
  };

  try {

    const result = await db.send(new ScanCommand(params));

    auctions = result.Items;
    
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ auctions }),
  }
}

export const handler = commonMiddleware(getAuctions);


