const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function green(text) {
  return `${GREEN}${text}${RESET}`;
}

function yellow(text) {
  return `${YELLOW}${text}${RESET}`;
}

function red(text) {
  return `${RED}${text}${RESET}`;
}

function bold(text) {
  return `${BOLD}${text}${RESET}`;
}

function dim(text) {
  return `${DIM}${text}${RESET}`;
}

module.exports = { green, yellow, red, bold, dim };
