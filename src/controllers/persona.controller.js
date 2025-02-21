const { generateToken } = require("../utils/utils");
const emailService = require("../services/email-sending");
const bcrypt = require("bcryptjs");
const message = require("../json/message.json");
const emailTemplate = require("../templates/emailTemplate");
const { PersonaModel, UserModel, ConversationModel } = require("../models");
const apiResponse = require("../utils/api.response");
const moment = require("moment");
const logger = require("../config/logger");
const axios = require("axios");

/**
 * POST: Login (User)
 */
module.exports = {
  createPersona: async (req, res) => {
    try {
      const {
        persona_name,
        email,
        system_prompt,
        context,
        apiKey,
        default_replica_id,
        trainerTitle,
        trainerDescription,
        category_id,
        code
      } = req.body;

      const personaData = {
        persona_name: persona_name,
        // email: email,
        system_prompt: system_prompt,
        context: context,
        default_replica_id: default_replica_id ?? "r79e1c033f",
      };

      const createPersonaUrl = "https://tavusapi.com/v2/personas";
      // const apiKey = process.env.TAVUS_API_KEY;
      let createPersona;

      axios
        .post(createPersonaUrl, personaData, {
          // headers: {
          //   Authorization: `Bearer ${apiKey}`,
          //   "Content-Type": "application/json",
          // },
          headers: {
            "x-api-key": `${apiKey ? apiKey : process.env.TAVUS_API_KEY}`,
            "Content-Type": "application/json",
          },
          // timeout: 120000,
        })
        .then(async (response) => {
          console.log("Persona Created:", response.data);

          const persona = {
            persona_name: persona_name,
            email: email,
            system_prompt: system_prompt,
            context: context,
            persona_id: response.data.persona_id,
            default_replica_id: default_replica_id ?? "r4c41453d2",
            apiKey: apiKey ?? process.env.TAVUS_API_KEY,
            trainerTitle: trainerTitle,
            trainerDescription: trainerDescription,
            category_id: category_id,
            code: code
          };

          createPersona = await PersonaModel.create(persona);
          return apiResponse.OK({
            res,
            message: "Persona create successfully",
            data: createPersona,
          });
        })
        .catch((error) => {
          console.log(error, "---------- error ------------");
          console.error(
            "Error creating persona:",
            error.response ? error.response.data : error.message
          );
          return apiResponse.BAD_REQUEST({
            res,
            message: "Persona can't create",
          });
        });
    } catch (err) {
      logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  getPersona: async (req, res) => {
    const {id} = req.query;
    const query = { isActive: true };
    if (id) {
      query.category_id = id;
    }
    try {
      const findAllPersona = await PersonaModel.find(query);
      if (!findAllPersona.length) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Persona not found!",
        });
      }
      return apiResponse.OK({
        res,
        message: "Get all persona",
        data: findAllPersona,
      });
    } catch (error) {
      console.log(error, "---------- Catch error --------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  deletePersona: async (req, res) => {
    const {id} = req.query;
    const query = { isActive: true };
    if (id) {
      query.category_id = id;
    }
    try {
      await PersonaModel.deleteMany(query);
      return apiResponse.OK({ res, message: "Success!" });
    } catch (err) {
      console.log(err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  webhook: async (req, res) => {
    try {
      console.log(req.body, "------------- Body ------------");
      console.log(
        req.body.properties.transcript,
        "------------- transcript ------------"
      );
      const findUser = await UserModel.findOne({
        conversation_Id: req?.body?.conversation_id,
      });
      if (req?.body?.properties?.transcript?.length > 1) {
        let data = {
          conversation_id: req?.body?.conversation_id,
          metadata: JSON.stringify(req?.body),
          uid: findUser?._id,
        };
        const createConversation = await ConversationModel.create(data);
        return apiResponse.OK({
          res,
          message: message.created,
          data: createConversation,
        });
      }
    } catch (error) {
      console.log(error, "---------- Catch error --------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },
};
