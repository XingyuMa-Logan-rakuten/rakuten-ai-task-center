"""User Input Tool - Interactive preference collection forms.

This module generates dynamic, interactive forms to collect user preferences and
requirements before conducting product searches. The forms adapt to different
product categories and use cases, gathering contextual information that helps
the agent provide more personalized recommendations.

The user input tool provides:
- Multiple choice questions with single or multi-select
- Text input fields for open-ended responses
- Category-specific question sets (e.g., coffee makers, backpacks)
- Visual form design with icons and progress indicators
- Form submission handling with structured output
- Integration with category_overview for personalized results

Forms are designed to be conversational and guide users through decision-making
without overwhelming them. Collected preferences are formatted as structured text
that can be passed to other tools for personalized recommendations.

Example:
    Generate a preference form:

        result = user_input(
            category="coffee machine",
            questions=[
                {"text": "What's your budget?", "type": "choice",
                 "options": ["Under 10000 yen", "10000-30000 yen", "30000+ yen"]},
                {"text": "Primary use?", "type": "choice",
                 "options": ["Daily espresso", "Occasional brewing", "Office use"]}
            ]
        )

Note:
    Form responses are returned as structured text strings that can be parsed
    by LLMs for contextual understanding and personalized recommendations.
"""

import logging
from typing import Dict, Any, List, Union
from langchain_core.tools import tool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


USER_INPUT_CSS = """
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f5f5f7;
    padding: 16px;
}

.form-container {
    max-width: 680px;
    width: 100%;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.form-header {
    background: white;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0f0f0;
}

.header-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
}

.header-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #AE2418 0%, #8b1d14 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.header-text h2 {
    font-size: 22px;
    font-weight: 700;
    color: #1d1d1f;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
}

.header-text .subtitle {
    font-size: 15px;
    color: #86868b;
    line-height: 1.4;
}

.progress-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.progress-label {
    font-size: 11px;
    font-weight: 600;
    color: #86868b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.progress-count {
    font-size: 14px;
    font-weight: 600;
    color: #AE2418;
}

.progress-bar-container {
    margin-top: 8px;
    height: 3px;
    background: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #AE2418 0%, #d93025 100%);
    transition: width 0.3s ease;
}

.form-content {
    padding: 24px;
}

.question-block {
    margin-bottom: 24px;
    display: none;
}

.question-block.active {
    display: block;
}

.question-block:last-of-type {
    margin-bottom: 0;
}

.question-label {
    font-size: 20px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 16px;
    display: block;
    letter-spacing: -0.3px;
}

.question-required {
    color: #AE2418;
    margin-left: 2px;
}

.options-grid {
    display: grid;
    gap: 10px;
}

.option-item {
    position: relative;
}

.option-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.option-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: #fafafa;
    border: 2px solid transparent;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    color: #1d1d1f;
    line-height: 1.4;
}

.option-label:hover {
    background: #f5f5f5;
}

.option-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.option-emoji {
    font-size: 24px;
    line-height: 1;
}

.option-text {
    font-weight: 500;
}

.option-radio {
    width: 24px;
    height: 24px;
    border: 2px solid #d2d2d7;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.2s ease;
    position: relative;
}

.option-input:checked + .option-label {
    background: #fef2f2;
    border-color: #AE2418;
}

.option-input:checked + .option-label .option-radio {
    border-color: #AE2418;
    background: #AE2418;
}

.option-input:checked + .option-label .option-radio::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
}

.text-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    border: 2px solid #d2d2d7;
    border-radius: 12px;
    background: #fafafa;
    color: #1d1d1f;
    transition: all 0.2s ease;
    font-family: inherit;
}

.text-input:focus {
    outline: none;
    border-color: #AE2418;
    background: white;
}

.text-input::placeholder {
    color: #86868b;
}

.form-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

.btn-primary {
    background: linear-gradient(135deg, #e8b4ae 0%, #d99d96 100%);
    color: #1d1d1f;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #e0a79f 0%, #d18f88 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-secondary {
    background: white;
    color: #86868b;
    border: 2px solid #f0f0f0;
}

.btn-secondary:hover {
    background: #fafafa;
}

.error-message {
    color: #ff3b30;
    font-size: 13px;
    margin-top: 8px;
    display: none;
    font-weight: 500;
}

.error-message.show {
    display: block;
}

.helper-text {
    font-size: 14px;
    color: #86868b;
    margin-top: 6px;
    line-height: 1.4;
}
"""

USER_INPUT_JS = """
console.log('[User Input Form] Script loaded');

let form, questions, continueBtn, skipBtn, currentQuestionIndex = 0;
const responses = {};

// Wait for DOM to be ready
function initForm() {
    console.log('[User Input Form] Initializing form');

    form = document.getElementById('userInputForm');
    questions = JSON.parse(document.getElementById('questionsData').textContent);
    continueBtn = document.querySelector('.btn-primary');
    skipBtn = document.querySelector('.btn-secondary');

    console.log('[User Input Form] Elements found:', {
        form: !!form,
        questions: questions.length,
        continueBtn: !!continueBtn,
        skipBtn: !!skipBtn
    });

    if (!form || !continueBtn || !skipBtn) {
        console.error('[User Input Form] Required elements not found!');
        return;
    }

    // Show first question
    showQuestion(0);

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    console.log('[User Input Form] Setting up event listeners');

    // Continue button
    continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleContinue();
    });

    // Skip button
    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        skipForm();
    });

    console.log('[User Input Form] Event listeners attached');
}

// Initialize when DOM is ready
function ensureInit() {
    if (!form) {
        initForm();
    }
}

if (document.readyState === 'loading') {
    console.log('[User Input Form] Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initForm);
} else {
    console.log('[User Input Form] DOM already loaded, calling initForm()');
    initForm();
}

setTimeout(ensureInit, 100);

function showQuestion(index) {
    currentQuestionIndex = index;

    // Hide all questions
    const questionBlocks = document.querySelectorAll('.question-block');
    questionBlocks.forEach(block => block.classList.remove('active'));

    // Show current question
    if (questionBlocks[index]) {
        questionBlocks[index].classList.add('active');
    }

    // Update button text
    if (index === questions.length - 1) {
        continueBtn.textContent = 'Submit';
    } else {
        continueBtn.textContent = 'Continue';
    }
}

function handleContinue() {
    const questionId = 'q' + currentQuestionIndex;
    const question = questions[currentQuestionIndex];

    // Validate current question
    if (question.type === 'single_choice') {
        const selected = document.querySelector('input[name="' + questionId + '"]:checked');
        if (question.required && !selected) {
            showError(questionId);
            return;
        }
        responses[question.question] = selected ? selected.value : null;
        hideError(questionId);
    } else if (question.type === 'multiple_choice') {
        const selected = Array.from(document.querySelectorAll('input[name="' + questionId + '"]:checked'))
            .map(el => el.value);
        if (question.required && selected.length === 0) {
            showError(questionId);
            return;
        }
        responses[question.question] = selected;
        hideError(questionId);
    } else if (question.type === 'text') {
        const input = document.getElementById(questionId);
        if (question.required && !input.value.trim()) {
            showError(questionId);
            return;
        }
        responses[question.question] = input.value.trim() || null;
        hideError(questionId);
    }

    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    } else {
        submitForm();
    }
}

function skipForm() {
    console.log('[User Input Form] Form skipped');

    // Send skip message to parent
    try {
        const message = {
            type: 'user_input_response',
            payload: {
                skipped: true
            }
        };
        console.log('[User Input Form] Sending skip message to parent:', message);

        if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*');
            console.log('[User Input Form] Skip message posted to parent');
        }
    } catch (error) {
        console.error('[User Input Form] Error posting skip message:', error);
    }

    // Show skipped state
    continueBtn.innerHTML = 'Skipped';
    continueBtn.disabled = true;
    skipBtn.disabled = true;
}

function submitForm() {
    console.log('[User Input Form] All validations passed, responses:', responses);

    // Ensure ALL questions are included in responses, even if not answered
    // This ensures skipped questions show as null in the final message
    const completeResponses = {};
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionText = question.question;

        // If this question was answered, use the answer; otherwise, use null
        if (questionText in responses) {
            completeResponses[questionText] = responses[questionText];
        } else {
            // Question was never visited/answered - mark as null
            if (question.type === 'multiple_choice') {
                completeResponses[questionText] = [];  // Empty array for multiple choice
            } else {
                completeResponses[questionText] = null;  // null for single choice and text
            }
        }
    }

    console.log('[User Input Form] Complete responses with skipped questions:', completeResponses);

    // Send responses to parent
    try {
        const message = {
            type: 'user_input_response',
            payload: {
                responses: completeResponses
            }
        };
        console.log('[User Input Form] Sending message to parent:', message);

        if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*');
            console.log('[User Input Form] Message posted to parent');
        } else {
            console.error('[User Input Form] No parent window found');
        }
    } catch (error) {
        console.error('[User Input Form] Error posting message:', error);
    }

    // Show success state
    continueBtn.innerHTML = '<span class="success-icon">✓</span> Submitted!';
    continueBtn.disabled = true;
    skipBtn.disabled = true;
    continueBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    continueBtn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
}

function showError(questionId) {
    const errorEl = document.getElementById(questionId + '_error');
    if (errorEl) {
        errorEl.classList.add('show');
    }
}

function hideError(questionId) {
    const errorEl = document.getElementById(questionId + '_error');
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}
"""


class Question(BaseModel):
    """A single question in the form."""
    question: str = Field(description="The question text")
    type: str = Field(description="Question type: 'single_choice', 'multiple_choice', or 'text'")
    options: List[Union[str, Dict[str, str]]] = Field(default=[], description="Options for choice questions (can be strings or dicts with 'text' and 'emoji' keys)")
    required: bool = Field(default=True, description="Whether the question is required")
    placeholder: str = Field(default="", description="Placeholder text for text inputs")
    helper_text: str = Field(default="", description="Helper text shown below the question")


class UserInputInput(BaseModel):
    """Input schema for user_input tool."""
    title: str = Field(description="Form title (e.g., 'Find the right backpack')")
    icon: str = Field(default="🎯", description="Emoji icon to display in the header")
    subtitle: str = Field(default="", description="Optional subtitle text")
    questions: List[Question] = Field(description="List of questions to ask the user")


def generate_question_html(question: Question, index: int) -> str:
    """Generate HTML for a single question."""
    question_id = f"q{index}"
    required_mark = '<span class="question-required">*</span>' if question.required else ''
    helper_text = f'<div class="helper-text">{question.helper_text}</div>' if question.helper_text else ''

    if question.type == "single_choice":
        options_html = ""
        for i, option in enumerate(question.options):
            option_id = f"{question_id}_opt{i}"

            # Handle both string and dict format
            if isinstance(option, str):
                option_text = option
                option_emoji = ""
                option_value = option
            elif isinstance(option, dict):
                option_text = option.get('text', str(option))
                option_emoji = option.get('emoji', '')
                option_value = option_text
            else:
                option_text = str(option)
                option_emoji = ""
                option_value = option_text

            emoji_html = f'<span class="option-emoji">{option_emoji}</span>' if option_emoji else ""

            options_html += f"""
            <div class="option-item">
                <input type="radio" name="{question_id}" id="{option_id}" value="{option_value}" class="option-input">
                <label for="{option_id}" class="option-label">
                    <div class="option-content">
                        {emoji_html}
                        <span class="option-text">{option_text}</span>
                    </div>
                    <div class="option-radio"></div>
                </label>
            </div>
            """

        return f"""
        <div class="question-block">
            <label class="question-label">
                {question.question}{required_mark}
            </label>
            {helper_text}
            <div class="options-grid">
                {options_html}
            </div>
            <div class="error-message" id="{question_id}_error">Please select an option</div>
        </div>
        """

    elif question.type == "multiple_choice":
        options_html = ""
        for i, option in enumerate(question.options):
            option_id = f"{question_id}_opt{i}"

            # Handle both string and dict format
            if isinstance(option, str):
                option_text = option
                option_emoji = ""
                option_value = option
            elif isinstance(option, dict):
                option_text = option.get('text', str(option))
                option_emoji = option.get('emoji', '')
                option_value = option_text
            else:
                option_text = str(option)
                option_emoji = ""
                option_value = option_text

            emoji_html = f'<span class="option-emoji">{option_emoji}</span>' if option_emoji else ""

            options_html += f"""
            <div class="option-item">
                <input type="checkbox" name="{question_id}" id="{option_id}" value="{option_value}" class="option-input">
                <label for="{option_id}" class="option-label">
                    <div class="option-content">
                        {emoji_html}
                        <span class="option-text">{option_text}</span>
                    </div>
                    <div class="option-radio"></div>
                </label>
            </div>
            """

        return f"""
        <div class="question-block">
            <label class="question-label">
                {question.question}{required_mark}
            </label>
            {helper_text}
            <div class="options-grid">
                {options_html}
            </div>
            <div class="error-message" id="{question_id}_error">Please select at least one option</div>
        </div>
        """

    elif question.type == "text":
        placeholder = question.placeholder or "Type your answer here..."
        return f"""
        <div class="question-block">
            <label class="question-label" for="{question_id}">
                {question.question}{required_mark}
            </label>
            {helper_text}
            <input
                type="text"
                id="{question_id}"
                class="text-input"
                placeholder="{placeholder}"
            >
            <div class="error-message" id="{question_id}_error">Please provide an answer</div>
        </div>
        """

    return ""


@tool("user_input", args_schema=UserInputInput)
def user_input(title: str, questions: List[Question], icon: str = "🎯", subtitle: str = "") -> Dict[str, Any]:
    """
    Generate an interactive form to collect user preferences and information.

    Use this tool when you need to gather specific information from the user
    before conducting a product search. This provides a better UX than asking
    multiple back-and-forth questions.

    Args:
        title: The form title (e.g., "Find the right backpack")
        icon: Emoji icon for the header (e.g., "🎒")
        subtitle: Optional subtitle for additional context
        questions: List of questions with their types and options

    Returns:
        A UI resource containing an interactive form
    """
    import json

    # Generate HTML for all questions
    questions_html = "\n".join([
        generate_question_html(q, i) for i, q in enumerate(questions)
    ])

    # Serialize questions for JavaScript
    questions_json = json.dumps([q.dict() for q in questions])

    # Calculate progress (currently showing question 1)
    total_questions = len(questions)
    progress_percentage = (1 / total_questions * 100) if total_questions > 0 else 100

    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        {USER_INPUT_CSS}
    </style>
</head>
<body>
    <div class="form-container">
        <!-- Header removed for cleaner UI -->

        <div class="form-content">
            <form id="userInputForm">
                {questions_html}

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">
                        Skip
                    </button>
                    <button type="button" class="btn btn-primary">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script id="questionsData" type="application/json">
        {questions_json}
    </script>
    <script>
        {USER_INPUT_JS}
    </script>
</body>
</html>
"""

    # Return minimal result for LLM context (to save tokens)
    # The form_data is sufficient for frontend rendering - no need for HTML in LLM context
    result = {
        "type": "ui_resource",
        "_handle": "user_input",  # Backend will append counter to make semantic handle
        "question_count": len(questions),
        "summary": f"✓ Displayed form to user with {len(questions)} question(s). Waiting for their input.",
        # Include raw data for native frontend rendering (this goes to frontend, not LLM context)
        "form_data": {
            "title": title,
            "icon": icon,
            "subtitle": subtitle,
            "questions": [q.dict() for q in questions]
        }
    }

    logger.info(f"[USER_INPUT] Returning ui_resource with {len(questions)} questions")
    logger.info(f"[USER_INPUT] Return type: {type(result)}, keys: {list(result.keys())}")
    logger.info(f"[USER_INPUT] Minimal result for LLM (no HTML), full form_data for frontend")

    return result
