const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports = async feed => {
  const result = await s3
    .putObject({
      Bucket: process.env.PODCAST_FEED,
      Key: "index.xml",
      Body: feed,
      ACL: "public-read",
      ContentType: "application/xml"
    })
    .promise();
  return result;
};
