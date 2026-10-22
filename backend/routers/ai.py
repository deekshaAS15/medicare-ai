import os
import re

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    messages: list[str]
    department: str | None = None
    emergency: bool = False


def detect_emergency(message: str) -> bool:
    message = message.lower()

    emergency_phrases = [
        "severe chest pain",
        "chest pain and difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "difficulty breathing",
        "severe breathing difficulty",
        "unconscious",
        "loss of consciousness",
        "heavy bleeding",
        "severe bleeding",
        "stroke",
        "face drooping",
        "slurred speech",
        "sudden weakness",
        "seizure",
    ]

    return any(
        phrase in message
        for phrase in emergency_phrases
    )


def detect_department(message: str) -> str:
    message = message.lower()

    if any(word in message for word in [
        "chest pain",
        "chest discomfort",
        "heart",
        "palpitation",
        "blood pressure"
    ]):
        return "Cardiology"

    if any(word in message for word in [
        "headache",
        "migraine",
        "seizure",
        "dizziness",
        "memory"
    ]):
        return "Neurology"

    if any(word in message for word in [
        "bone",
        "joint",
        "knee",
        "back pain",
        "fracture",
        "shoulder"
    ]):
        return "Orthopedics"

    if any(word in message for word in [
        "child",
        "baby",
        "kid"
    ]):
        return "Pediatrics"

    if any(word in message for word in [
        "tooth",
        "teeth",
        "gum",
        "dental"
    ]):
        return "Dental Care"

    if any(word in message for word in [
        "eye",
        "vision",
        "blurred vision"
    ]):
        return "Ophthalmology"

    if any(word in message for word in [
        "pregnancy",
        "period",
        "menstrual",
        "gynecology"
    ]):
        return "Gynecology"

    return "General Medicine"


def clean_ai_response(reply: str) -> list[str]:
    """
    Convert the AI's response into short chat messages.
    """

    # Remove the department line from the visible messages
    reply = re.sub(
        r"DEPARTMENT\s*:\s*.+",
        "",
        reply,
        flags=re.IGNORECASE
    )

    # Remove markdown bullets
    reply = re.sub(r"^[\-\*\•]\s*", "", reply, flags=re.MULTILINE)

    # Split by paragraphs
    parts = re.split(r"\n\s*\n+", reply.strip())

    messages = []

    for part in parts:
        part = part.strip()

        if not part:
            continue

        # Split long paragraphs into sentences
        sentences = re.split(r"(?<=[.!?])\s+", part)

        for sentence in sentences:
            sentence = sentence.strip()

            if sentence:
                messages.append(sentence)

    return messages


@router.post("/chat", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest):

    if not request.message.strip():
        return {
            "messages": [
                "Please describe your health concern."
            ],
            "department": None,
            "emergency": False
        }

    is_emergency = detect_emergency(request.message)

    department = detect_department(request.message)

    system_prompt = """
You are MediCare AI, a healthcare information assistant.

Your job is to:
- Understand the patient's health-related message.
- Provide simple general health information.
- Never diagnose a disease.
- Never prescribe medicines or dosages.
- Do not claim certainty about a patient's condition.
- Give short, clear responses suitable for a chat interface.
- Use simple language.
- Keep each sentence reasonably short.
- Do not write long paragraphs.
- Give practical general information.

If symptoms may indicate a medical emergency:
- Clearly advise the user to seek immediate emergency medical care.
- Do not tell them to wait for an appointment.
- Do not provide reassurance that could delay emergency care.

Choose one department from:

Cardiology
Neurology
Orthopedics
Pediatrics
General Medicine
Dental Care
Ophthalmology
Gynecology
General Consultation

At the end of your response, write exactly:

DEPARTMENT: <department name>

Do not use markdown headings.
Do not use bullet points.
Write conversational sentences suitable for separate chat bubbles.
"""

    if is_emergency:
        system_prompt += """

IMPORTANT:
The user's message may describe an emergency.
Prioritize immediate emergency-care guidance.
"""

    # Build conversation messages BEFORE calling Groq
    conversation = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    # Add previous conversation
    for chat_message in request.history:
        conversation.append({
            "role": chat_message.role,
            "content": chat_message.content
        })

    # Add current user message
    conversation.append({
        "role": "user",
        "content": request.message
    })

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=conversation,
            temperature=0.3,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        messages = clean_ai_response(reply)

        if not messages:
            messages = [
                "I'm sorry, I couldn't generate a response."
            ]

        return {
            "messages": messages,
            "department": department,
            "emergency": is_emergency
        }

    except Exception as error:

        print("AI Error:", error)

        return {
            "messages": [
                "I'm sorry, I couldn't process your request right now."
            ],
            "department": None,
            "emergency": False
        }