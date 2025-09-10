import dotenv from 'dotenv';
dotenv.config();

// OpenAI Configuration
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1'
};

// Model Configuration for OpenAI
const MODEL_CONFIG = {
  GPT4: {
    name: "gpt-4-turbo-preview",
    temperature: 0.7,
    max_tokens: 4000,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1
  },
  GPT4_CREATIVE: {
    name: "gpt-4-turbo-preview", 
    temperature: 0.9,
    max_tokens: 4000,
    top_p: 0.95,
    frequency_penalty: 0.2,
    presence_penalty: 0.3
  },
  GPT4_ANALYTICAL: {
    name: "gpt-4-turbo-preview",
    temperature: 0.3,
    max_tokens: 4000,
    top_p: 0.8,
    frequency_penalty: 0.1,
    presence_penalty: 0.1
  }
};

export const SELECTED_MODEL = MODEL_CONFIG.GPT4;
export const CREATIVE_MODEL = MODEL_CONFIG.GPT4_CREATIVE;
export const ANALYTICAL_MODEL = MODEL_CONFIG.GPT4_ANALYTICAL;

// Generic OpenAI completion function
export const createCompletion = async (
  prompt: string, 
  modelConfig = SELECTED_MODEL,
  systemMessage?: string
) => {
  try {
    const messages: any[] = [];
    
    if (systemMessage) {
      messages.push({ role: "system", content: systemMessage });
    }
    
    messages.push({ role: "user", content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: modelConfig.name,
        messages,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        top_p: modelConfig.top_p,
        frequency_penalty: modelConfig.frequency_penalty,
        presence_penalty: modelConfig.presence_penalty
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI API.");
    }

    return content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to clean JSON responses
export const cleanAndParseJSON = (content: string) => {
  let cleanedContent = content.trim();
  
  // Remove markdown formatting if present
  if (cleanedContent.startsWith('```json')) {
    cleanedContent = cleanedContent.replace(/```json\n?/, '').replace(/```\n?/, '');
  }
  if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/```\n?/, '').replace(/```\n?/, '');
  }

  try {
    return JSON.parse(cleanedContent);
  } catch (parseError) {
    // Try to extract JSON from the response
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (extractError) {
        throw new Error("AI response could not be parsed as JSON even after extraction");
      }
    } else {
      throw new Error("AI response could not be parsed as JSON and no JSON found");
    }
  }
};
