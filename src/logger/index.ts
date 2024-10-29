const colours = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
        crimson: '\x1b[38m', // Scarlet
    },
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        gray: '\x1b[100m',
        crimson: '\x1b[48m',
    },
};

const redLog = function (...strings: string[]) {
    console.log(colours.fg.red, ...strings, colours.reset);
};

const blueLog = function (...strings: string[]) {
    console.log(colours.fg.cyan, ...strings, colours.reset);
};

const yellowLog = function (...strings: string[]) {
    console.log(colours.fg.yellow, ...strings, colours.reset);
};

const greenLog = function (...strings: string[]) {
    console.log(colours.fg.green, ...strings, colours.reset);
};

const redBgLog = function (...strings: string[]) {
    console.log(colours.bg.red, ...strings, colours.reset);
};

const blueBgLog = function (...strings: string[]) {
    console.log(colours.bg.cyan, ...strings, colours.reset);
};

const yellowBgLog = function (...strings: string[]) {
    console.log(colours.bg.yellow, ...strings, colours.reset);
};

const greenBgLog = function (...strings: string[]) {
    console.log(colours.bg.green, ...strings, colours.reset);
};

export { redLog, redBgLog, yellowLog, yellowBgLog, blueLog, blueBgLog, greenLog, greenBgLog };
