const reset = '\x1b[0m';

const ColorFG = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
} as const;

const ColorBG = {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
};

interface ChromaOptions {
    bg?: keyof typeof ColorBG;
    fg?: keyof typeof ColorFG;
}

function chroma(message: string, options?: ChromaOptions) {
    if (!options) return '';
    if (!options.bg && !options.fg) return '';
    const { bg, fg } = options;
    if (bg) message = ColorBG[bg] + message;
    if (fg) message = ColorFG[fg] + message;
    return message + reset;
}

export { chroma };
