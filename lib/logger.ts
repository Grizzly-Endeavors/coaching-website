// Simple structured logger with environment-based log levels

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    // Don't log debug in production
    if (level === 'debug' && this.isProduction) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    };

    if (this.isDevelopment) {
      // Development: pretty print with colors
      const levelColors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      console.log(
        `${levelColors[level]}[${level.toUpperCase()}]${reset} ${entry.timestamp} - ${message}`,
        context ? context : '',
        error ? error : ''
      );
    } else {
      // Production: JSON for log aggregation
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, contextOrError?: Record<string, unknown> | Error, errorArg?: Error) {
    let context: Record<string, unknown> | undefined;
    let error: Error | undefined;

    if (contextOrError instanceof Error) {
      error = contextOrError;
    } else {
      context = contextOrError;
      error = errorArg;
    }

    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
