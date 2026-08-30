from fastapi import APIRouter
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from comet import download_model, load_from_checkpoint
import translators as ts
import os
import deepl

router = APIRouter()


# ============================================================
# DeepL
# ============================================================

api_key = os.getenv("DEEPL_API_KEY")

translator = None

if api_key:
    try:
        translator = deepl.Translator(api_key)
    except Exception as e:
        print("DeepL Init Error:", e)


# ============================================================
# COMET-KIWI
# Reference-free translation quality evaluation
# ============================================================

model_path = download_model("Unbabel/wmt22-cometkiwi-da")
model = load_from_checkpoint(model_path)


# ============================================================
# Request model
# ============================================================

class Request(BaseModel):
    src: str
    source_lang: str = "de"
    target_lang: str = "en"


# ============================================================
# Google Translation
# ============================================================

def google_translate(
    src: str,
    source_lang: str,
    target_lang: str
):
    # First attempt: translators package
    try:
        result = ts.translate_text(
            src,
            translator="google",
            from_language=source_lang,
            to_language=target_lang
        )

        if result:
            return result

    except Exception as e:
        print("Google translators package error:", e)


    # Fallback: deep-translator
    try:
        result = GoogleTranslator(
            source=source_lang,
            target=target_lang
        ).translate(src)

        if result:
            return result

    except Exception as e:
        print("Google deep-translator error:", e)


    return None


# ============================================================
# COMET-KIWI scoring
# ============================================================

def cometkiwi_score(
    src: str,
    translation: str
):
    try:
        result = model.predict(
            [
                {
                    "src": src,
                    "mt": translation
                }
            ]
        )

        return float(result["scores"][0])

    except Exception as e:
        print("COMET-KIWI Error:", e)
        return None


# ============================================================
# Analyze endpoint
# ============================================================

@router.post("/analyze")
async def analyze(req: Request):

    # --------------------------------------------------------
    # Google Translation
    # --------------------------------------------------------

    google_text = google_translate(
        req.src,
        req.source_lang,
        req.target_lang
    )

    google_score = None

    if google_text:
        google_score = cometkiwi_score(
            req.src,
            google_text
        )


    # --------------------------------------------------------
    # DeepL Translation
    # --------------------------------------------------------

    deepl_text = None
    deepl_score = None

    try:

        if translator:

            deepl_text = translator.translate_text(
                req.src,
                target_lang="EN-US"
            ).text

            deepl_score = cometkiwi_score(
                req.src,
                deepl_text
            )

        else:

            deepl_text = "No API Key"

    except Exception as e:

        print("DeepL Error:", e)

        deepl_text = "Unavailable"


    # --------------------------------------------------------
    # Determine winner
    # --------------------------------------------------------

    if (
        google_score is not None
        and deepl_score is not None
    ):

        if google_score >= deepl_score:

            winner_engine = "Google"

            winner_reason = (
                "Google achieved the higher "
                "COMET-KIWI quality score."
            )

        else:

            winner_engine = "DeepL"

            winner_reason = (
                "DeepL achieved the higher "
                "COMET-KIWI quality score."
            )


    elif google_score is not None:

        winner_engine = "Google"

        winner_reason = (
            "Google was the only translation "
            "engine with a valid quality score."
        )


    elif deepl_score is not None:

        winner_engine = "DeepL"

        winner_reason = (
            "DeepL was the only translation "
            "engine with a valid quality score."
        )


    else:

        winner_engine = "Not evaluated"

        winner_reason = (
            "Neither translation engine produced "
            "a valid COMET-KIWI quality score."
        )


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "google": {
            "text": google_text or "Unavailable",
            "score": google_score
        },

        "deepl": {
            "text": deepl_text or "Unavailable",
            "score": deepl_score
        },

        "winner": {
            "engine": winner_engine,
            "reason": winner_reason
        }
    }