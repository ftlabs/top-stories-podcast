const AWS = require("aws-sdk");
const polly = new AWS.Polly();

module.exports = async text => {
  var params = {
    // OutputFormat: json | mp3 | ogg_vorbis | pcm /* required */,
    OutputFormat: "mp3" /* required */,
    OutputS3BucketName: process.env.AUDIO_STORAGE /* required */,
    Text: text /* required */,
    VoiceId: "Emma" /* required */,
    Engine: "neural",
    LanguageCode: "en-GB",
    // LexiconNames: [
    //   'STRING_VALUE',
    //   /* more items */
    // ],
    // OutputS3KeyPrefix: 'STRING_VALUE',
    // SampleRate: 'STRING_VALUE',
    // SnsTopicArn: 'STRING_VALUE',
    // SpeechMarkTypes: ["word"],
    TextType: "ssml"
  };
  const result = await polly.startSpeechSynthesisTask(params).promise();
  return result;
};
