let openai = require('openai');

openai = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function genrateImage(prompt) {
  const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
  });
    console.log(`---response--`,response);
    return response
}

module.exports = genrateImage