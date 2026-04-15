"""show_widget tool — renders an HTML/SVG widget inline in the chat via iframe."""

import logging
from langchain_core.tools import tool
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Elicitation CSS — .elicit class system provided to every widget
# ---------------------------------------------------------------------------
ELICIT_CSS = """
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fff;
  color: #111;
  padding: 0;
  overflow-x: hidden;
}

.elicit {
  padding: 16px 18px;
}

.elicit-group {
  margin-bottom: 18px;
}
.elicit-group:last-of-type {
  margin-bottom: 0;
}

.elicit-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

/* Pills */
.elicit-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.elicit-pill {
  padding: 6px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 999px;
  background: #fafafa;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
  user-select: none;
  outline: none;
  font-family: inherit;
  line-height: 1.4;
}
.elicit-pill:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}
.elicit-pill[aria-pressed="true"] {
  border-color: #BF0000;
  background: #fff1f1;
  color: #BF0000;
  font-weight: 600;
}

/* Other-reveal input */
.elicit-other-input {
  display: none;
  margin-top: 8px;
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color 0.12s;
}
.elicit-other-input:focus {
  border-color: #BF0000;
  background: #fff;
}

/* Textarea */
.elicit-textarea {
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111;
  background: #fafafa;
  resize: vertical;
  outline: none;
  transition: border-color 0.12s;
}
.elicit-textarea:focus {
  border-color: #BF0000;
  background: #fff;
}

/* Text input */
.elicit-input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color 0.12s;
}
.elicit-input:focus {
  border-color: #BF0000;
  background: #fff;
}

/* Footer */
.elicit-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #f3f4f6;
}

.elicit-submit {
  padding: 8px 20px;
  border: none;
  border-radius: 999px;
  background: #BF0000;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s, transform 0.1s;
}
.elicit-submit:hover { background: #a30000; transform: translateY(-1px); }
.elicit-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.elicit-skip {
  padding: 8px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 999px;
  background: transparent;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s;
}
.elicit-skip:hover { background: #f9fafb; }
.elicit-skip:disabled { opacity: 0.4; cursor: not-allowed; }
"""

# ---------------------------------------------------------------------------
# Elicitation JS shell — pill toggling, Other-reveal, submit serialization,
# resize notification
# ---------------------------------------------------------------------------
ELICIT_JS = """
// ── sendPrompt: post text back to the parent chat ──
function sendPrompt(text) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'widget_prompt', text: text }, '*');
  }
}

// ── notifyResize: tell parent the current content height ──
function notifyResize() {
  var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'widget_resize', height: h }, '*');
  }
}

// ── Pill toggle ──
document.addEventListener('click', function(e) {
  var pill = e.target.closest('.elicit-pill');
  if (!pill) return;
  var pillsEl = pill.closest('.elicit-pills');
  if (!pillsEl) return;

  var multi = pillsEl.dataset.mode === 'multi';
  if (!multi) {
    // single-select: clear siblings
    pillsEl.querySelectorAll('.elicit-pill').forEach(function(p) {
      p.setAttribute('aria-pressed', 'false');
    });
  }
  var wasPressed = pill.getAttribute('aria-pressed') === 'true';
  pill.setAttribute('aria-pressed', String(!wasPressed));

  // "Other" pill: reveal sibling .elicit-other-input
  if (pill.dataset.other === 'true') {
    var group = pillsEl.closest('.elicit-group') || pillsEl.parentElement;
    var otherInput = group ? group.querySelector('.elicit-other-input') : null;
    if (otherInput) {
      var nowPressed = pill.getAttribute('aria-pressed') === 'true';
      otherInput.style.display = nowPressed ? 'block' : 'none';
      if (nowPressed) otherInput.focus();
    }
  }
  notifyResize();
});

// ── Submit: serialise all [data-name] fields → sendPrompt ──
document.addEventListener('click', function(e) {
  if (!e.target.closest('.elicit-submit')) return;

  var root = document.querySelector('[data-title]') || document.querySelector('.elicit');
  var title = root ? (root.dataset.title || '') : '';
  var parts = [];

  document.querySelectorAll('[data-name]').forEach(function(el) {
    var name = el.dataset.name;
    var value = '';

    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      value = el.value.trim();
    } else if (el.classList.contains('elicit-pills')) {
      var pressed = Array.from(el.querySelectorAll('.elicit-pill[aria-pressed="true"]'));
      var vals = pressed.map(function(p) {
        if (p.dataset.other === 'true') {
          var group = el.closest('.elicit-group') || el.parentElement;
          var inp = group ? group.querySelector('.elicit-other-input') : null;
          return (inp && inp.value.trim()) ? inp.value.trim() : (p.dataset.value || p.textContent.trim());
        }
        return p.dataset.value || p.textContent.trim();
      });
      value = vals.join(', ');
    } else {
      // generic container — look inside for inputs
      var inp = el.querySelector('input, textarea');
      if (inp) value = inp.value.trim();
    }

    if (value) parts.push(name + ': ' + value);
  });

  var body = parts.join(' · ');
  var text = title ? title + ' — ' + body : body;
  if (!text.trim()) text = '(submitted)';

  sendPrompt(text);

  // visual submitted state
  document.querySelectorAll('.elicit-submit, .elicit-skip').forEach(function(b) {
    b.disabled = true;
  });
  var btn = document.querySelector('.elicit-submit');
  if (btn) {
    btn.textContent = 'Sent ✓';
    btn.style.background = '#16a34a';
  }
});

// ── Skip ──
document.addEventListener('click', function(e) {
  if (!e.target.closest('.elicit-skip')) return;
  sendPrompt('(skipped)');
  document.querySelectorAll('.elicit-submit, .elicit-skip').forEach(function(b) {
    b.disabled = true;
  });
});

// ── Auto-resize on load + mutation ──
document.addEventListener('DOMContentLoaded', function() { setTimeout(notifyResize, 0); });
setTimeout(notifyResize, 80);
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(notifyResize).observe(document.body);
}
"""


class ShowWidgetInput(BaseModel):
    html: str = Field(
        description=(
            "The widget body HTML fragment using .elicit CSS classes. "
            "Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags — "
            "only the inner content."
        )
    )


@tool("show_widget", args_schema=ShowWidgetInput)
def show_widget(html: str) -> dict:
    """
    Render a custom interactive HTML widget inline in the chat.

    Use this to display rich elicitation forms with pill-based selections,
    text areas, and styled action buttons.

    The widget body must use the provided .elicit CSS class system:
    - .elicit — root container (add data-title="Title" for submit prefix)
    - .elicit-group — wraps a label + inputs
    - .elicit-label — question label text
    - .elicit-pills[data-mode="single"|"multi"] + data-name="field" — pill group
    - .elicit-pill[aria-pressed="false"][data-value="val"] — each pill option
    - .elicit-pill[data-other="true"] — reveals .elicit-other-input when pressed
    - .elicit-other-input — free-text input revealed by "Other" pill
    - .elicit-textarea[data-name="field"] — multi-line text field
    - .elicit-input[data-name="field"] — single-line text field
    - .elicit-footer — row containing action buttons
    - .elicit-submit — submit button (auto-serialises all [data-name] fields)
    - .elicit-skip — skip button

    On submit, the JS shell collects all [data-name] fields into:
      "Title — field: value · field: value"
    and sends it back as a user message.

    Args:
        html: Widget body fragment (no full-document wrapper).
    """
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
{ELICIT_CSS}
  </style>
</head>
<body>
{html}
  <script>
{ELICIT_JS}
  </script>
</body>
</html>"""

    logger.info(f"[SHOW_WIDGET] Returning widget ({len(full_html)} chars)")

    return {
        "type": "ui_resource",
        "widget_type": "html",
        "html": full_html,
        "summary": "✓ Widget displayed to user. Waiting for their response.",
    }
