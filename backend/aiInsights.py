# AI insights module
# Generate AI insights for weather data

import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json
from pydantic import BaseModel

def generate_insight(weather_data: str):
    load_dotenv()
    client = genai.Client(
        api_key=os.getenv("GOOGLE_API_KEY"),
    )

    model = "gemini-3.1-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""
    Here is todays weather data: {weather_data}
                                     
  - Task 1: Give an insight into how today's weather is.
  - Task 2: What hour range is the best solar production time (inclusive)?
  - Task 3: Observe the total_kwh. Give 4 homeowner-friendly, realistic,
    real-world analogies of what could be powered with today's total energy
    production.
                                     
    
"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level="LOW",
        ),
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type=genai.types.Type.OBJECT,
            required=["Task 1", "Task 2", "Task 3"],
            properties={
                "Task 1": genai.types.Schema(
                    type=genai.types.Type.STRING,
                ),
                "Task 2": genai.types.Schema(
                    type=genai.types.Type.STRING,
                ),
                "Task 3": genai.types.Schema(
                    type=genai.types.Type.ARRAY,
                    items=genai.types.Schema(
                        type=genai.types.Type.STRING,
                    ),
                ),
            },
        ),
        system_instruction=[
            types.Part.from_text(
                text="""Role: Solar energy expert who communicates in simple, universal language. Speak in the present tense

You are given three tasks. Follow these rules for each.

- FORMATTING RULES FOR TASK 1: 
- PAY ATTENTION to the weather_description field. Speak as a weather reporter giving insight on todays weather
- Keep responses two sentences max, 
- no more than 150 characters. 
- Use data only from provided weather data and do not use external weather data. 
- Keep language simple and readable, responses must be short and straight-forward. 
- Start off with Today, and speak in the present tone. 


Some example outputs for task 1:

\"Today is mostly sunny with rain showers in the afternoon\"
\"Today is sunny with little cloud coverage. Expect high solar production around 2:00pm\"
\"Today is rainy with high cloud coverage. Cloud cover expected after 3 PM\"

- Task 2: Respond in one sentence (120 chars max) Do not repeat the question in your answer.

- Task 3: Think in terms of a single, typical family home using a realistic combination of items for a normal day. To account for multiple items, use reasonable household caps (e.g., \"a family of 4 charging all their smartphones for a week\" or \"running 10 LED light bulbs simultaneously for X hours\").  NEVER use massive, abstract numbers like \"100,000 smartphones\" or \"600 hours of a single light bulb.\" Keep the scale strictly matched to a single-family home's daily or weekly routine. Be specific about the types of devices.

FORMATTING RULES FOR TASK 3:
- Format responses into a bulleted list.
- Each list item must be exactly one sentence.
- Maximum 120 characters per list item.
- Start off with an action verb
- Keep it concise and straight to the point
- Use literal numbers instead of number words
"""
            ),
        ],
    )

    output = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if text := chunk.text:
            output += text

    output = json.loads(output)
    return output
