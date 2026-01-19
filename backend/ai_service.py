from groq import Groq
from typing import Optional
import os


class AIService:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
    
    def generate_summary(self, title: str, content: str) -> str:
        """Generate AI summary of article using Groq"""
        if not content or len(content.strip()) < 100:
            return "Content too short to summarize."
        
        prompt = f"""Please provide a concise summary (2-3 paragraphs) of the following article:

Title: {title}

Content:
{content[:4000]}

Focus on the main points, key insights, and takeaways. Keep the summary clear and informative."""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes articles clearly and concisely."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content.strip()
            return summary
            
        except Exception as e:
            print(f"Error generating summary: {e}")
            return "Unable to generate summary at this time."
    
    def analyze_article(self, title: str, content: str) -> dict:
        """Perform deeper analysis on article"""
        if not content or len(content.strip()) < 100:
            return {"key_points": [], "themes": []}
        
        prompt = f"""Analyze the following article and provide:
1. 3-5 key bullet points
2. 3-4 main themes or topics

Title: {title}

Content:
{content[:3000]}

Format your response as:
Key Points:
- [point 1]
- [point 2]
- [point 3]

Themes:
- [theme 1]
- [theme 2]
- [theme 3]"""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes articles and extracts key information."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.3
            )
            
            result = response.choices[0].message.content.strip()
            
            # Parse the response
            key_points = []
            themes = []
            
            lines = result.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if line.startswith('Key Points:'):
                    current_section = 'key_points'
                elif line.startswith('Themes:'):
                    current_section = 'themes'
                elif line.startswith('-'):
                    point = line[1:].strip()
                    if point and current_section == 'key_points':
                        key_points.append(point)
                    elif point and current_section == 'themes':
                        themes.append(point)
            
            return {
                "key_points": key_points,
                "themes": themes
            }
            
        except Exception as e:
            print(f"Error analyzing article: {e}")
            return {"key_points": [], "themes": []}
