import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_gemini():
    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file")
        return

    print(f"Found API Key: {api_key[:5]}...{api_key[-5:]}")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        print("Sending test prompt to Gemini...")
        response = model.generate_content("Hello! Are you working? Reply with 'Yes, I am online.'")
        
        print("\nResponse from Gemini:")
        print("-" * 20)
        print(response.text)
        print("-" * 20)
        print("\nTest passed successfully!")
        
    except Exception as e:
        print(f"\nError testing Gemini: {e}")

if __name__ == "__main__":
    test_gemini()
