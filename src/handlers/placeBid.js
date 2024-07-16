import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";

import commonMiddleware from "../lib/commonMiddleware.js";
const db = new DynamoDBClient();

async function placeBid(event, context) {

  const { id } = event.pathParameters;
  const { amount } = event.body;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: { S: id } },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: { 
      ":amount": {N: amount.toString()},
    },
    ReturnValues: "ALL_NEW",
  };

  const auction = await getAuctionById(id);

  const isBidSmaller = amount <= auction.highestBid.amount;
  const isAuctionClosed = auction.status.S === "CLOSED";

  const isError = isBidSmaller || isAuctionClosed;

  if (isError) {
    let errorMsg;
    if (isBidSmaller) errorMsg = `Your bid must be higher than {$auction.highestBid.amount}!`;
    else if (isAuctionClosed) errorMsg = "You cannot bid on a closed auction!";
    throw new createError.Forbidden(errorMsg);
  }

  let updatedAuction;

  try {
    const result = await db.send(new UpdateItemCommand(params));
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ updatedAuction }),
  }
}

export const handler = commonMiddleware(placeBid);
