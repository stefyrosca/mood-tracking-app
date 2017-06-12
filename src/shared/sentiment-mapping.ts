const AVAILABLE_THEME_NAMES = {
  RED: "red-theme",
  BLUE: "blue-theme",
  // ORANGE: "orange-theme",
  PURPLE: "purple-theme",
  GREEN: "green-theme",
  YELLOW: "yellow-theme"
};

const SENTIMENTS = {
  DEPRESSED: "depressed",
  SAD: "sad",
  NEUTRAL: "neutral",
  HAPPY: "happy",
  EXCITED: "excited"
};

export const availableThemes = [
  {className: AVAILABLE_THEME_NAMES.RED, display: "Red"},
  {className: AVAILABLE_THEME_NAMES.BLUE, display: "Blue"},
  // {className: AVAILABLE_THEME_NAMES.ORANGE, display: "Orange"},
  {className: AVAILABLE_THEME_NAMES.PURPLE, display: "Purple"},
  {className: AVAILABLE_THEME_NAMES.GREEN, display: "Green"},
  {className: AVAILABLE_THEME_NAMES.YELLOW, display: "Yellow"}
];

export const SENTIMENT_MAPPING = {
  [SENTIMENTS.DEPRESSED]: AVAILABLE_THEME_NAMES.RED,
  [SENTIMENTS.SAD]: AVAILABLE_THEME_NAMES.YELLOW,
  [SENTIMENTS.NEUTRAL]: AVAILABLE_THEME_NAMES.BLUE,
  [SENTIMENTS.HAPPY]: AVAILABLE_THEME_NAMES.GREEN,
  [SENTIMENTS.EXCITED]: AVAILABLE_THEME_NAMES.PURPLE,
};
