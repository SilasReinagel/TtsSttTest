// @ts-check
import axios from "axios";

// // Doc Link: https://docs.tavily.com/docs/tavily-api/rest_api
export const getWebResearch = async (prompt) => {
  try {
    const response = await axios.post('https://api.tavily.com/search', JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: prompt,
      search_depth: 'advanced',
      include_answer: true,
      include_images: false,
      include_raw_content: true,
      max_results: 5
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { data } = response;
    return data;
  } catch (error) {
    console.error('Error fetching research data:', error);
    throw error;
  }  
}
