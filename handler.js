"use strict";
const parser = require("./lib/parser");
const textToAudio = require("./lib/textToAudio");
const db = require("./lib/db");

module.exports.get = async event => {
  try {
    const url = event.queryStringParameters.url;
    const collection = event.queryStringParameters.collection;

    const articleText = await parser(url);
    const {
      ssl,
      title,
      byline,
      excerpt,
      length,
      dir,
      source,
      content
    } = articleText;
    const resultAudio = await textToAudio(ssl);
    const { TaskId, OutputUri } = resultAudio.SynthesisTask;
    const resultDb = await db({
      id: TaskId,
      source,
      collection,
      audio: OutputUri,
      content,
      ssl,
      length,
      title,
      excerpt,
      byline,
      dir
    });
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: resultDb,
          input: event
        },
        null,
        2
      )
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: 401,
      body: JSON.stringify(
        {
          message: JSON.stringify(err),
          input: event
        },
        null,
        2
      )
    };
  }
};
