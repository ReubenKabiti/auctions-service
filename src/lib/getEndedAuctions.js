import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient();

export async function getEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": {S: "OPEN"},
      ":now": {S: now.toISOString()},
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await db.send(new QueryCommand(params));
  return result.Items;
}
