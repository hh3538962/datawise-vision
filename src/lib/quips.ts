// Subtle Gen-Z / data-science humor. Witty, not cringe.

export const greetings = [
  "Hey bestie, ready to train some models?",
  "Your dataset survived preprocessing. Big win.",
  "Random Forest is foresting again.",
  "Loading intelligence… hopefully.",
  "Your accuracy is looking kinda premium today.",
  "Machine learning, but emotionally stable.",
  "Gradient Boosting carrying the team as usual.",
  "Welcome back — the data missed you.",
  "Today's vibe: low bias, low variance.",
  "Imputing missing values and good intentions.",
];

export const trainingQuips = [
  "This model cooked.",
  "Decision Tree trying its absolute best.",
  "R² entered the chat.",
  "Accuracy increased — dopamine activated.",
  "Confusion matrix looking… emotionally confusing.",
  "Loss curve descending like it pays rent.",
  "Cross-validation said 'trust the process.'",
];

export const emptyStates = {
  prediction: {
    title: "No predictions yet, bestie.",
    body: "Fill the form and the model will tell you what it thinks.",
  },
  upload: {
    title: "The AI is waiting dramatically.",
    body: "Drop a CSV with the right schema to retrain everything.",
  },
  comparison: {
    title: "Feed the model some data.",
    body: "Run a benchmark to populate the leaderboard.",
  },
};

const seedRandom = (key: string) => {
  // Per-day stable, but fresh on hard refresh of a new day.
  const today = new Date().toDateString();
  const s = `${key}::${today}::${Math.random()}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const pickGreeting = () => greetings[seedRandom("g") % greetings.length];
export const pickTrainingQuip = () => trainingQuips[seedRandom("t") % trainingQuips.length];
