const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async ({
  id,
  source,
  collection,
  audio,
  content,
  ssl,
  length,
  title,
  excerpt,
  byline,
  dir
}) => {
  const timestamp = new Date().getTime();
  var params = {
    TableName: process.env.ARTICLE_STORAGE,
    Item: {
      id,
      source,
      collection,
      audio,
      content,
      ssl,
      length,
      title,
      excerpt,
      byline,
      dir,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    ConditionExpression: "attribute_not_exists(id)"
  };
  const result = await dynamoDb.put(params).promise();
  return result;
};
