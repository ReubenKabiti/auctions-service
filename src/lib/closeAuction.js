import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient();

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: { S: auction.id.S }},
    UpdateExpression: "set #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": {S: "CLOSED"}
    },
  };

  const result = await db.send(new UpdateItemCommand(params));
  return result;
}
