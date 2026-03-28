from fastapi import APIRouter
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from comet import download_model, load_from_checkpoint
import os
import deepl

router = APIRouter()

# ✅ Load DeepL API key safely
api_key = os.getenv("DEEPL_API_KEY")

translator = None
if api_key:
    try:
        translator = deepl.Translator(api_key)
    except Exception as e:
        print("DeepL Init Error:", e)

# ✅ Load COMET model (only once)
model_path = download_model("wmt20-comet-da")
model = load_from_checkpoint(model_path)

# ✅ Request schema
class Request(BaseModel):
    src: str
    ref: str
    source_lang: str = "de"
    target_lang: str = "en"

# ✅ API endpoint
@router.post("/analyze")
async def analyze(req: Request):

    # 🔹 Google Translation
    google_text = GoogleTranslator(
        source=req.source_lang,
        target=req.target_lang
    ).translate(req.src)

    # 🔹 DeepL Translation (safe)
    try:
        if translator:
            deepl_text = translator.translate_text(
                req.src,
                target_lang="EN-US"
            ).text
        else:
            deepl_text = "No API Key"
    except Exception as e:
        print("DeepL Error:", e)
        deepl_text = "Unavailable"

    # 🔹 Google Score
    g_score = model.predict([{
        "src": req.src,
        "mt": google_text,
        "ref": req.ref
    }])['scores'][0]

    # 🔹 DeepL Score (only if valid)
    d_score = None
    if deepl_text not in ["Unavailable", "No API Key"]:
        try:
            d_score = model.predict([{
                "src": req.src,
                "mt": deepl_text,
                "ref": req.ref
            }])['scores'][0]
        except Exception as e:
            print("COMET DeepL Error:", e)

    # 🔹 Response
    return {
        "google": {
            "text": google_text,
            "score": g_score
        },
        "deepl": {
            "text": deepl_text,
            "score": d_score
        }
    }