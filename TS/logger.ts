import { chroma } from './chroma';

const enum LogLevel {
    Silent,
    Info,
    Warning,
    Error,
}

class Logger {
    private level: LogLevel;
    private static instance?: Logger;

    private constructor(logLevel: LogLevel = LogLevel.Info) {
        this.level = logLevel;
    }

    private static getInstance() {
        if (!Logger.instance) Logger.instance = new Logger();

        return Logger.instance;
    }

    static setLevel(logLevel: LogLevel) {
        if (!Logger.instance) {
            Logger.instance = new Logger(logLevel);
        } else {
            Logger.instance.level = logLevel;
        }
    }

    static info(...message: any[]) {
        const logger = Logger.getInstance();
        if (logger.level <= LogLevel.Info) {
            console.log(chroma('[LOG]:', { fg: 'yellow' }), ...message);
        }
    }

    static warn(...message: any[]) {
        const logger = Logger.getInstance();
        if (logger.level <= LogLevel.Warning) {
            console.warn(chroma('[WARN]:', { fg: 'red' }), ...message);
        }
    }

    static error(...message: any[]) {
        const logger = Logger.getInstance();
        if (logger.level <= LogLevel.Error) {
            console.error(
                chroma('[WARN]:', { fg: 'black', bg: 'red' }),
                ...message
            );
        }
    }
}

export { LogLevel, Logger };
