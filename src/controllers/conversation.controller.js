const { generateToken } = require("../utils/utils");
const emailService = require("../services/email-sending");
const bcrypt = require("bcryptjs");
const message = require("../json/message.json");
const emailTemplate = require("../templates/emailTemplate");
const { ConversationModel } = require("../models");
const apiResponse = require("../utils/api.response");
const moment = require("moment");
const logger = require("../config/logger");
const axios = require("axios");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * POST: Login (User)
 */
module.exports = {
  createConversation: async (req, res) => {
    try {
      const { conversation_id, uid, metadata } = req.body;
      let data = {
        conversation_id: conversation_id,
        uid: uid,
        metadata: JSON.stringify(metadata),
      };
      const createConversation = await ConversationModel.create(data);
      return apiResponse.OK({
        res,
        message: message.created,
        data: createConversation,
      });
    } catch (err) {
      logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  createReport: async (req, res) => {
    try {
      let conversation_id = req.query.conversation_id;
      const findConversation = await ConversationModel.findOne({
        conversation_id: conversation_id,
      });
      if (!findConversation) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Conversation not found.",
        });
      }

      const metadata = JSON.parse(findConversation.metadata);
      const transcript = metadata.properties.transcript;
      const transcriptString = JSON.stringify(transcript);

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `
      Act as an expert in inspecting and analyzing human speech patterns. Your role is to evaluate the speech of the user, detecting various elements such as filler words (\"a\", \"aaa\", etc.). You will focus on the following:\n\nGuidelines:\nFiller Words: Track occurrences of fillers like \"a\", \"aaa\", \"um\", \"uh\", etc.\nEvaluate Trainer's Response for the following criterias:\nConfidence: How confident did the trainer appear during the session? Was the tone assertive or hesitant?\nClarity: Was the trainer's speech clear and well-articulated? Were there any areas where the trainer struggled to express themselves?\nEngagement: Did the trainer employ effective techniques to engage participants (e.g., interactive activities, questions, discussions)?\nExpertise: Did the trainer demonstrate thorough knowledge and expertise on the subject matter?\nAdaptability: Was the trainer able to adapt to participants' needs, questions, and any unforeseen challenges during the session?\nOverall Recommendation:\nProvide an overall recommendation for the trainer. To perform above task you will be provided with a JSON object of a conversation, and your task is to extract only the messages from the user, which are specified as \"role\": \"user\".\n\nOutput Format: {\n  \"Filler Words Count\": \"\",\n  \"Filler Words Breakdown\": {\"\":, \"\":,. . .},\n  \"Confidence\": \"[Excellent/Good/Average/Fair/Needs Improvement]\",\n  \"Clarity\": \"[Excellent/Good/Average/Fair/Needs Improvement]\",\n  \"Engagement\": \"[Excellent/Good/Average/Fair/Needs Improvement]\",\n  \"Expertise\": \"[Excellent/Good/Average/Fair/Needs Improvement]\",\n  \"Adaptability\": \"[Excellent/Good/Average/Fair/Needs Improvement]\",\n  \"Overall Recommendation\": \"\"\n}
  
      Conversation:
      ${transcriptString}
      `;

      // Send the prompt to OpenAI GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const csvDowloadContent = JSON.parse(completion.choices[0].message.content);
      
    // Generate CSV content in column format
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Filler Words Count', csvDowloadContent['Filler Words Count']],
      ['Confidence', csvDowloadContent['Confidence']],
      ['Clarity', csvDowloadContent['Clarity']],
      ['Engagement', csvDowloadContent['Engagement']],
      ['Expertise', csvDowloadContent['Expertise']],
      ['Adaptability', csvDowloadContent['Adaptability']],
      ['Overall Recommendation', csvDowloadContent['Overall Recommendation']],
    ];

    // Break down "Filler Words Breakdown" into individual rows
    const fillerWordsBreakdown = csvDowloadContent['Filler Words Breakdown'];
    if (fillerWordsBreakdown && typeof fillerWordsBreakdown === 'object') {
      Object.entries(fillerWordsBreakdown).forEach(([word, count]) => {
        rows.push([`Filler Word: ${word}`, count]);
      });
    }

    // Write the CSV content
    const fileName = `report_${conversation_id}.csv`;
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create upload directory if it doesn't exist
    }

    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(headers.join(',') + '\n');
    rows.forEach((row) => {
      fileStream.write(
        row
          .map((field) =>
            typeof field === 'number' ? `"${field}"` : `"${field}"` // Ensure numbers are treated as text
          )
          .join(',') + '\n'
      );
    });
    fileStream.end();

      // Send file to the client
      fileStream.on('finish', () => {
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error('Error sending the file:', err);
          }
          // Cleanup the file after download
          fs.unlinkSync(filePath);
        });
      });
        
      // console.log('completion', completion.choices[0].message.content)

      // const csvContent = Array(JSON.parse(completion.choices[0].message.content));
      // console.log('csvContent', Array(csvContent))

      // // const parsedJson = parseCSVtoJSON(csvContent);

      // // // Function to parse CSV content to JSON (if needed)
      // // function parseCSVtoJSON(csv) {
      // //   const lines = csv.split("\n");
      // //   const headers = lines[0].split(",");
      // //   const result = [];

      // //   for (let i = 1; i < lines.length; i++) {
      // //     const obj = {};
      // //     const currentLine = lines[i].split(",");

      // //     for (let j = 0; j < headers.length; j++) {
      // //       obj[headers[j]] = currentLine[j];
      // //     }

      // //     result.push(obj);
      // //   }

      // //   return result;
      // // }

      // const fileName = "user_messages.csv";
      // const filePath = path.join(uploadDir, fileName);

      // const headers = "Filler Words Count,Filler Words Breakdown,Confidence,Clarity,Engagement,Expertise,Adaptability,Overall Recommendation\n";
      // const rows = csvContent
      // .map(item => {
      //   const record = item[0]; // Get the first object in the array (record)

      //   if (!record) {
      //     return ''; // If record is undefined, return an empty row
      //   }

      //   // Map through the keys and values of the record and escape quotes if necessary
      //   return Object.keys(record)
      //     .map(key => {
      //       let value = record[key];

      //       // If the value is an array (like 'Filler Words Breakdown'), join it into a string
      //       if (Array.isArray(value)) {
      //         value = value.join('; '); // Join array elements into a string
      //       }

      //       // Escape double quotes in the value
      //       value = value.replace(/"/g, '""');

      //       // Return the key and value as CSV format
      //       return `"${value}"`; // Wrap value in quotes to handle commas in the value
      //     })
      //     .join(','); // Join each key-value pair by a comma
      // })
      // .join("\n");
      // console.log(rows,"------------ rows -----------")
      // const csvContentData = headers + rows;

      // // Write CSV content to a file
      // fs.writeFileSync(filePath, csvContentData);

      // try {
      //   const fileUrl = `http://localhost:${7003}/download/${fileName}`;
      //   res.download(filePath, (err) => {
      //     if (err) {
      //       console.error("Error sending the file:", err);
      //     } // Cleanup the file after download
      //     fs.unlinkSync(filePath);
      //   });
      // } catch (error) {
      //   res.status(500).send("Error generating CSV file");
      //   console.error(error);
      // }
      // return apiResponse.OK({ res, message: message.created, data: JSON.parse(completion.choices[0].message.content) })
    } catch (err) {
      console.log(err, "--------- Catch error ---------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  getConversation: async (req, res) => {
    try {
      let { conversation_id, uid } = req.query;

      const findConversation = await ConversationModel.find({
        conversation_id: conversation_id,
        uid: uid,
      });
      if (!findConversation) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Conversation not found!",
        });
      }
      return apiResponse.OK({
        res,
        message: "Get conversation",
        data: findConversation,
      });
    } catch (error) {
      console.log(error, "---------- Catch error --------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  updateConversation: async (req, res) => {
    try {
      let { conversation_id, uid } = req.query;
      const findConversation = await ConversationModel.findOne({
        conversation_id: conversation_id,
        uid: uid,
      });
      if (!findConversation) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Conversation not found!",
        });
      }
      const updateConversation = await ConversationModel.findOneAndUpdate(
        { conversation_id: conversation_id, uid: uid },
        req.body,
        { new: true }
      );
      return apiResponse.OK({
        res,
        message: message.updated,
        data: updateConversation,
      });
    } catch (error) {
      console.log(error, "---------- Catch error ----------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  deleteConversation: async (req, res) => {
    try {
      let id = req.query.id;
      const findConversation = await ConversationModel.findOne({ _id: id });
      if (!findConversation) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Conversation not found!",
        });
      }
      await ConversationModel.findOneAndDelete({ _id: id });
      return apiResponse.OK({ res, message: "Success!" });
    } catch (err) {
      console.log(err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },
};
