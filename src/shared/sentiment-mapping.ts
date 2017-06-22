const AVAILABLE_THEME_NAMES = {
  RED: "red-theme",
  BLUE: "blue-theme",
  ORANGE: "orange-theme",
  PURPLE: "purple-theme",
  GREEN: "green-theme",
  YELLOW: "yellow-theme"
};

const COLORS = {
  RED: 'red',
  BLUE: 'blue',
  ORANGE: 'orange',
  PURPLE: 'purple',
  GREEN: 'green',
  YELLOW: 'yellow'
};

export const SENTIMENTS = {
  DEPRESSED: "depressed",
  SAD: "sad",
  NEUTRAL: "neutral",
  HAPPY: "happy",
  EXCITED: "excited",
  BORED: "bored"
};

export const availableThemes = [
  {className: AVAILABLE_THEME_NAMES.RED, display: "Red"},
  {className: AVAILABLE_THEME_NAMES.BLUE, display: "Blue"},
  {className: AVAILABLE_THEME_NAMES.ORANGE, display: "Orange"},
  {className: AVAILABLE_THEME_NAMES.PURPLE, display: "Purple"},
  {className: AVAILABLE_THEME_NAMES.GREEN, display: "Green"},
  {className: AVAILABLE_THEME_NAMES.YELLOW, display: "Yellow"}
];

export const SENTIMENT_MAPPING = {
  [SENTIMENTS.DEPRESSED]: AVAILABLE_THEME_NAMES.RED,
  [SENTIMENTS.SAD]: AVAILABLE_THEME_NAMES.YELLOW,
  [SENTIMENTS.NEUTRAL]: AVAILABLE_THEME_NAMES.BLUE,
  [SENTIMENTS.BORED]: AVAILABLE_THEME_NAMES.ORANGE,
  [SENTIMENTS.HAPPY]: AVAILABLE_THEME_NAMES.GREEN,
  [SENTIMENTS.EXCITED]: AVAILABLE_THEME_NAMES.PURPLE,
};

export const SENTIMENT_COLOR_MAPPING = {
  [SENTIMENTS.DEPRESSED]: COLORS.RED,
  [SENTIMENTS.SAD]: COLORS.YELLOW,
  [SENTIMENTS.NEUTRAL]: COLORS.BLUE,
  [SENTIMENTS.BORED]: COLORS.ORANGE,
  [SENTIMENTS.HAPPY]: COLORS.GREEN,
  [SENTIMENTS.EXCITED]: COLORS.PURPLE,
};
