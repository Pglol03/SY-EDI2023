import openai_secret_manager
import openai

# Get the API key for OpenAI
secrets = openai_secret_manager.get_secrets("openai")
openai.api_key = secrets["api_key"]

# Get the API key for Google
secrets = openai_secret_manager.get_secrets("google")

# Import the required libraries
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client.service_account import ServiceAccountCredentials

# Define the prompt for the GPT-3 model
prompt = (f"Please suggest an image for a slide about diversity and inclusion in the workplace.")

# Use the GPT-3 model to generate the text
completions = openai.Completion.create(
    engine="text-davinci-002",
    prompt=prompt,
    max_tokens=1024,
    n=1,
    stop=None,
    temperature=0.5,
)

# Get the generated text
text = completions.choices[0].text

# Authenticate using the API key
credentials = ServiceAccountCredentials.from_json_keyfile_dict(secrets, ['https://www.googleapis.com/auth/presentations'])

# Create a new presentation
presentation_service = build('slides', 'v1', credentials=credentials)
presentation = presentation_service.presentations().create(body={
    'title': 'Diversity and Inclusion in the Workplace'
}).execute()

# Get the ID of the new presentation
presentation_id = presentation.get('presentationId')

# Upload the image file
file_name = 'image.jpg'
try:
    with open(file_name, 'rb') as f:
        image_data = f.read()
except FileNotFoundError:
    # Handle the error if the image file is not found
    pass
else:
    # Insert the image into the presentation
    request = presentation_service.presentations().pages().get(presentationId=presentation_id, pageId=presentation.get('pageIds')[0])
    response = request.execute()
    images = response.get('pageElements', [])

    request = presentation_service.presentations().pages().insertPageElement(presentationId=presentation_id, pageId=presentation.get('pageIds')[0], body={
        'requests': [{
            'createImage': {
                'elementProperties': {
                    'pageObjectId': presentation.get('pageIds')[0],
                    'size': {
                        'width': {
                            'magnitude': 600,
                            'unit': 'PT'
                        },
                        'height': {
                            'magnitude': 400,
                            'unit': 'PT'
                        }
                    },
                    'transform': {
                        'scaleX': 1,
                        'scaleY': 1,
                        'translateX': 350,
                        'translateY': 100,
                        'unit': 'PT'
                    }
                }
            }
        }]
    }
    )

