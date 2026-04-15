---
name: make-presentation
description: Create PowerPoint (.pptx) presentations using python-pptx. Use when the user asks to create slides, a deck, or a presentation.
license: MIT
compatibility: python-pptx>=1.0
allowed-tools: execute write_file read_file
---

# make-presentation Skill

## When to Use
- User asks to create a PowerPoint, slide deck, or presentation
- User wants to export content as .pptx

## Workflow

1. **Clarify** the title, number of slides, and content if not already specified.
2. **Write a Python script** to `/tmp/make_slides.py` using `write_file`.
3. **Execute it** with `execute("python /tmp/make_slides.py")`.
4. **Report** the output path to the user.

## Script Template

```python
from pptx import Presentation
from pptx.util import Inches, Pt

prs = Presentation()

# Title slide (layout 0)
slide = prs.slides.add_slide(prs.slide_layouts[0])
slide.shapes.title.text = "Presentation Title"
slide.placeholders[1].text = "Subtitle or author"

# Content slide (layout 1)
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Slide Title"
tf = slide.placeholders[1].text_frame
tf.text = "First bullet point"
p = tf.add_paragraph()
p.text = "Second bullet point"

prs.save("/tmp/output.pptx")
print("Saved to /tmp/output.pptx")
```

## Notes
- Always save to `/tmp/` so the file is accessible after execution.
- `python-pptx` must be installed in the environment.
- For branded decks, ask for a `.pptx` template and open it with `Presentation("template.pptx")`.
- Layout indices: 0 = title slide, 1 = title+content, 2 = section header.
