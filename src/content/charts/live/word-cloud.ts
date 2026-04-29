import type { LiveChart } from "@/content/chart-schema";

export const wordCloud: LiveChart = {
  id: "word-cloud",
  name: "Word Cloud",
  family: "comparison",
  sectors: ["infographics"],
  dataShapes: ["categorical"],
  tileSize: "L",
  status: "live",
  synopsis:
    "Arranges words at sizes proportional to their frequency so the dominant terms read first.",
  whenToUse:
    "Reach for a word cloud when you want an immediate impression of what a body of text is about — opening a talk, seeding a discussion, skimming survey free-text. Do not reach for one when the reader needs to compare counts. Readers cannot reliably judge that a word set 2× larger than another was said twice as often, and every real corpus has a long tail that the cloud flattens.",
  howToRead:
    "Read the big words first, then scan the medium tier. Font size encodes frequency, usually via sqrt or log scaling so a 10×-more-common word doesn't render as a 10×-tall monster. Colour and orientation are almost always decorative — treat them as rhythm, not meaning. If the biggest words are 'the', 'that', 'and', you are looking at a stopword-unfiltered cloud, which tells you almost nothing about the text.",
  example: {
    title: "Lincoln's Gettysburg Address (272 words)",
    description:
      "Of the speech's 272 words, 'the' appears 12 times and 'that' 10 — more than 'nation' (5), 'dedicated' (5), or 'liberty' (1). A cloud that keeps stopwords is therefore dominated by grammar, not meaning. Strip them and the cloud becomes honest about what Lincoln actually said: dedicated, nation, dead, people.",
  },
  elements: [
    {
      selector: "largest-word",
      label: "Largest word",
      explanation:
        "The most-frequent word in the corpus, rendered at the maximum font size. Its visual dominance is the chart's first read — and often the first warning sign that stopwords weren't filtered, because 'the' is almost always the most-frequent word in English prose.",
    },
    {
      selector: "size-encoding",
      label: "Size encoding",
      explanation:
        "Font size is proportional to sqrt(count), not raw count. Sqrt is the standard honest choice because readers perceive glyph area (which grows as size²), not height. Even with sqrt scaling, viewers consistently misjudge 2:1 ratios by 20-40% — word clouds are for vibes, not numbers.",
    },
    {
      selector: "stopword-bias",
      label: "Stopword bias",
      explanation:
        "In any natural-language corpus, the top 10 words are grammar: articles, pronouns, prepositions. A word cloud that includes them tells you the text is in English; a cloud that strips them tells you what the text is about. Most published word clouds filter a stopword list before counting.",
    },
    {
      selector: "colour",
      label: "Colour",
      explanation:
        "In this chart colour is opacity variation only — not an encoded dimension. Many word clouds map colour to sentiment, part-of-speech, or source document, but colour alone is a weak channel here because the reader can't map a hue back to a category without a legend.",
    },
    {
      selector: "layout",
      label: "Layout",
      explanation:
        "The position of each word carries no data — it's a packing decision. Most implementations spiral outward from the largest word, trying random orientations until a non-overlapping slot opens. Different runs of the same algorithm produce visually different clouds from identical counts.",
    },
    {
      selector: "smallest-word",
      label: "Smallest word",
      explanation:
        "The long-tail word — something that appeared once or twice. Readers often miss these entirely at thumbnail scale. If a word in your tail matters, the word cloud is the wrong chart; use a bar chart of the top-20 or a frequency table.",
    },
  ],
};
