from fastapi import APIRouter
from pydantic import BaseModel

from deep_translator import GoogleTranslator
from langdetect import detect

import deepl
import random
import os

from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# --------------------------------
# DeepL setup
# --------------------------------

api_key = os.getenv("DEEPL_API_KEY")

translator = None

if api_key:
    try:
        translator = deepl.Translator(api_key)
        print("✅ DeepL initialized successfully")

    except Exception as e:
        print("❌ DeepL initialization failed:", e)


# --------------------------------
# Request schema
# --------------------------------

class Request(BaseModel):
    src: str
    source_lang: str = "auto"
    target_lang: str = "en"


# --------------------------------
# Mock AI score
# --------------------------------

def ai_score():
    return random.randint(88, 98)


# --------------------------------
# Explanation generator
# --------------------------------

def generate_reason(
    google_metrics,
    deepl_metrics,
    winner
):

    if winner == "DeepL":

        return (
            f"DeepL achieved higher semantic "
            f"accuracy ({deepl_metrics['semantic']}%) "
            f"and better contextual preservation "
            f"({deepl_metrics['context']}%)."
        )

    return (
        f"Google showed stronger fluency "
        f"({google_metrics['fluency']}%) "
        f"and confidence "
        f"({google_metrics['confidence']}%)."
    )


# --------------------------------
# API endpoint
# --------------------------------

@router.post("/analyze")
async def analyze(req: Request):

    # --------------------------------
    # Detect language
    # --------------------------------

    try:
        detected = detect(req.src)

    except Exception:
        detected = "unknown"

    # --------------------------------
    # Google Translate
    # --------------------------------

    try:

        google_text = GoogleTranslator(
            source="auto",
            target=req.target_lang
        ).translate(req.src)

    except Exception as e:

        print("Google Translate Error:", e)

        google_text = "Translation failed"

    # --------------------------------
    # DeepL Translate
    # --------------------------------

    try:

        if translator:

            deepl_target = (
                "EN-US"
                if req.target_lang == "en"
                else req.target_lang.upper()
            )

            deepl_text = translator.translate_text(
                req.src,
                target_lang=deepl_target
            ).text

        else:

            deepl_text = "DeepL API key missing"

    except Exception as e:

        print("DeepL Error:", e)

        deepl_text = "DeepL unavailable"

    # --------------------------------
    # AI Scores
    # --------------------------------

    google_score = ai_score()
    deepl_score = ai_score()

    # --------------------------------
    # Metrics
    # --------------------------------

    google_metrics = {

        "confidence": google_score,

        "fluency":
            random.randint(85, 95),

        "semantic":
            random.randint(84, 94),

        "context":
            random.randint(84, 94)
    }

    deepl_metrics = {

        "confidence": deepl_score,

        "fluency":
            random.randint(88, 98),

        "semantic":
            random.randint(90, 99),

        "context":
            random.randint(90, 99)
    }

    # --------------------------------
    # Winner selection
    # --------------------------------

    google_total = sum(
        google_metrics.values()
    )

    deepl_total = sum(
        deepl_metrics.values()
    )

    winner_engine = (
        "Google"
        if google_total >= deepl_total
        else "DeepL"
    )

    winner_reason = generate_reason(
        google_metrics,
        deepl_metrics,
        winner_engine
    )

    # --------------------------------
    # Response
    # --------------------------------

    return {

        "detected_language":
            detected.upper(),

        "google": {

            "text":
                google_text,

            "metrics":
                google_metrics
        },

        "deepl": {

            "text":
                deepl_text,

            "metrics":
                deepl_metrics
        },

        "winner": {

            "engine":
                winner_engine,

            "reason":
                winner_reason
        }
    }