"use strict";

const { toXML } = require("jstoxml");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const storage = require("./lib/podcastFeedDb");

const url = process.env.PODCAST_FEED_XML_URL;

module.exports.trigger = async event => {
  const newItem = event.Records[0].dynamodb.NewImage;
  const xml = await getPodcast(url);

  const splitSml = xml.split("</channel>");

  const channelAndItems = splitSml[0];
  const footer = splitSml[1];

  const finalXml =
    channelAndItems + createNewItemXML(newItem) + "</channel>" + footer;

  const result = await storage(finalXml);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "done",
        input: event
      },
      null,
      2
    )
  };
};

function createNewItemXML(newItem) {
  return `<item>
            <title>${newItem.source.S}: ${newItem.title.S}</title>
            <itunes:author>Jamie Brown</itunes:author>
            <itunes:subtitle>subtitle</itunes:subtitle>
            <itunes:summary>Summary</itunes:summary>
            <itunes:image>image.jpg</itunes:image>
            <enclosure url="${
              newItem.audio.S
            }" length="8727310" type="audio/x-m4a"/>
            <guid>${newItem.audio.S}</guid>
            <pubDate>${new Date().toUTCString()}</pubDate>
            <itunes:duration>7:04</itunes:duration>
            <itunes:keywords>salt, pepper, shaker, exciting</itunes:keywords>
        </item>`;
}

async function getPodcast() {
  var getParams = {
    Bucket: process.env.PODCAST_FEED,
    Key: "index.xml"
  };

  const xml = await s3.getObject(getParams).promise();
  const objectData = xml.Body.toString("utf-8");

  return objectData;
}

function formatExistingItems(existingItems) {
  return existingItems.map(item => {
    return (
      {
        title: item.title[0]
      },
      {
        "itunes:author": item["itunes:author"][0]
      },
      {
        "itunes:subtitle": item["itunes:subtitle"][0]
      },
      {
        "itunes:summary": item["itunes:summary"][0]
      },
      {
        "itunes:image": "image.jpg"
      },
      {
        _name: "enclosure",
        _attrs: {
          url: item.enclosure[0]["$"].url,
          length: "8727310",
          type: "audio/x-m4a"
        }
      },
      {
        guid: item["guid"][0]
      },
      {
        pubDate: "Wed, 15 Jun 2011 19:00:00 GMT"
      },
      {
        "itunes:duration": "7:04"
      }
    );
  });
}
