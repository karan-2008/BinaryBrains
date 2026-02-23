"""
Text parser utilities.

Handles cleanup of LLM responses, specifically stripping
<think>...</think> blocks from Ollama/deepseek output.
"""

import re


def sanitize_ai_response(raw_text: str) -> str:
    """
    Strips <think>...</think> tags and their contents from the AI response.
    Ensures only the final, clean markdown/text is returned to the frontend.
    """
    clean_text = re.sub(r'<think>.*?</think>', '', raw_text, flags=re.DOTALL)
    return clean_text.strip()


# Backward-compatible alias
strip_think_tags = sanitize_ai_response
