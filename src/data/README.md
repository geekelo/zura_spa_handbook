# Handbook content

Edit JSON only. The app loads every file in these folders automatically.

```
src/data/
  categories/
    about/
      category.json          ← category name and description
      topics/
        our-story.json       ← one file per topic
        our-values.json
    standards/
      category.json
      topics/
        ...
  site/
    pages.json               ← screen titles and labels
    updates.json
    more-resources.json
```

## Edit a topic

Open `categories/<category>/topics/<topic>.json` and change the quoted text.

## Add a topic

1. Add a new JSON file in that category’s `topics/` folder.
2. Use a unique `id` (kebab-case, same as the file name).
3. Set `order` so it appears in the right place.
4. Use `"type": "scenario"` for situation pages, otherwise `"article"`.

```json
{
  "id": "new-topic",
  "title": "Title",
  "summary": "Short list description.",
  "type": "article",
  "order": 3,
  "steps": [
    { "title": "Step title", "body": "Step details." }
  ],
  "remember": "Optional closing note."
}
```

## Add a category

1. Create `categories/<id>/category.json`.
2. Create `categories/<id>/topics/` and add at least one topic file.
3. Set `order` on the category to control list position.

## Routine topics

Routine files live in `categories/routines/topics/` and use:

```json
{
  "id": "client-reception-routine",
  "title": "Client Reception Routine",
  "summary": "Short list description.",
  "type": "routine",
  "order": 1,
  "relevance": [
    "Why this routine matters."
  ],
  "procedure": [
    { "title": "Step title", "body": "How to do the step." }
  ]
}
```
