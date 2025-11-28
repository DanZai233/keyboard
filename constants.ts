import { KeyConfig } from './types';

// Helper to construct row logic easily
const createRow = (rowIdx: number, keys: Omit<KeyConfig, 'row' | 'x'>[]): KeyConfig[] => {
  let currentX = 0;
  return keys.map(k => {
    const key: KeyConfig = { ...k, row: rowIdx, x: currentX };
    currentX += k.width;
    return key;
  });
};

// Standard ANSI 60% Layout
// Total Width: 15u
export const KEY_LAYOUT: KeyConfig[][] = [
  // Row 1 (Numbers)
  createRow(0, [
    { id: 'esc', label: 'ESC', code: 'Escape', width: 1, col: 0 },
    { id: '1', label: '1', code: 'Digit1', width: 1, col: 1 },
    { id: '2', label: '2', code: 'Digit2', width: 1, col: 2 },
    { id: '3', label: '3', code: 'Digit3', width: 1, col: 3 },
    { id: '4', label: '4', code: 'Digit4', width: 1, col: 4 },
    { id: '5', label: '5', code: 'Digit5', width: 1, col: 5 },
    { id: '6', label: '6', code: 'Digit6', width: 1, col: 6 },
    { id: '7', label: '7', code: 'Digit7', width: 1, col: 7 },
    { id: '8', label: '8', code: 'Digit8', width: 1, col: 8 },
    { id: '9', label: '9', code: 'Digit9', width: 1, col: 9 },
    { id: '0', label: '0', code: 'Digit0', width: 1, col: 10 },
    { id: '-', label: '-', code: 'Minus', width: 1, col: 11 },
    { id: '=', label: '=', code: 'Equal', width: 1, col: 12 },
    { id: 'bksp', label: 'BACK', code: 'Backspace', width: 2, col: 13 },
  ]),
  // Row 2 (QWERTY)
  createRow(1, [
    { id: 'tab', label: 'TAB', code: 'Tab', width: 1.5, col: 0 },
    { id: 'q', label: 'Q', code: 'KeyQ', width: 1, col: 1 },
    { id: 'w', label: 'W', code: 'KeyW', width: 1, col: 2 },
    { id: 'e', label: 'E', code: 'KeyE', width: 1, col: 3 },
    { id: 'r', label: 'R', code: 'KeyR', width: 1, col: 4 },
    { id: 't', label: 'T', code: 'KeyT', width: 1, col: 5 },
    { id: 'y', label: 'Y', code: 'KeyY', width: 1, col: 6 },
    { id: 'u', label: 'U', code: 'KeyU', width: 1, col: 7 },
    { id: 'i', label: 'I', code: 'KeyI', width: 1, col: 8 },
    { id: 'o', label: 'O', code: 'KeyO', width: 1, col: 9 },
    { id: 'p', label: 'P', code: 'KeyP', width: 1, col: 10 },
    { id: '[', label: '[', code: 'BracketLeft', width: 1, col: 11 },
    { id: ']', label: ']', code: 'BracketRight', width: 1, col: 12 },
    { id: '\\', label: '\\', code: 'Backslash', width: 1.5, col: 13 },
  ]),
  // Row 3 (ASDF)
  createRow(2, [
    { id: 'caps', label: 'CAPS', code: 'CapsLock', width: 1.75, col: 0 },
    { id: 'a', label: 'A', code: 'KeyA', width: 1, col: 1 },
    { id: 's', label: 'S', code: 'KeyS', width: 1, col: 2 },
    { id: 'd', label: 'D', code: 'KeyD', width: 1, col: 3 },
    { id: 'f', label: 'F', code: 'KeyF', width: 1, col: 4 },
    { id: 'g', label: 'G', code: 'KeyG', width: 1, col: 5 },
    { id: 'h', label: 'H', code: 'KeyH', width: 1, col: 6 },
    { id: 'j', label: 'J', code: 'KeyJ', width: 1, col: 7 },
    { id: 'k', label: 'K', code: 'KeyK', width: 1, col: 8 },
    { id: 'l', label: 'L', code: 'KeyL', width: 1, col: 9 },
    { id: ';', label: ';', code: 'Semicolon', width: 1, col: 10 },
    { id: "'", label: "'", code: 'Quote', width: 1, col: 11 },
    { id: 'enter', label: 'ENTER', code: 'Enter', width: 2.25, col: 12 },
  ]),
  // Row 4 (ZXCV)
  createRow(3, [
    { id: 'shift_l', label: 'SHIFT', code: 'ShiftLeft', width: 2.25, col: 0 },
    { id: 'z', label: 'Z', code: 'KeyZ', width: 1, col: 1 },
    { id: 'x', label: 'X', code: 'KeyX', width: 1, col: 2 },
    { id: 'c', label: 'C', code: 'KeyC', width: 1, col: 3 },
    { id: 'v', label: 'V', code: 'KeyV', width: 1, col: 4 },
    { id: 'b', label: 'B', code: 'KeyB', width: 1, col: 5 },
    { id: 'n', label: 'N', code: 'KeyN', width: 1, col: 6 },
    { id: 'm', label: 'M', code: 'KeyM', width: 1, col: 7 },
    { id: ',', label: ',', code: 'Comma', width: 1, col: 8 },
    { id: '.', label: '.', code: 'Period', width: 1, col: 9 },
    { id: '/', label: '/', code: 'Slash', width: 1, col: 10 },
    { id: 'shift_r', label: 'SHIFT', code: 'ShiftRight', width: 2.75, col: 11 },
  ]),
  // Row 5 (Mods & Space)
  createRow(4, [
    { id: 'ctrl_l', label: 'CTRL', code: 'ControlLeft', width: 1.25, col: 0 },
    { id: 'win_l', label: 'WIN', code: 'MetaLeft', width: 1.25, col: 1 },
    { id: 'alt_l', label: 'ALT', code: 'AltLeft', width: 1.25, col: 2 },
    { id: 'space', label: '', code: 'Space', width: 6.25, col: 3, type: 'space' },
    { id: 'alt_r', label: 'ALT', code: 'AltRight', width: 1.25, col: 4 },
    { id: 'win_r', label: 'FN', code: 'ContextMenu', width: 1.25, col: 5 },
    { id: 'menu', label: 'MENU', code: 'ControlRight', width: 1.25, col: 6 },
    { id: 'ctrl_r', label: 'CTRL', code: 'ControlRight', width: 1.25, col: 7 }, // Using ControlRight again for simplicity or standard code
  ])
];

// Piano Mapping
export const PIANO_MAP: Record<string, string> = {
  'KeyA': 'C4',
  'KeyW': 'C#4',
  'KeyS': 'D4',
  'KeyE': 'D#4',
  'KeyD': 'E4',
  'KeyF': 'F4',
  'KeyT': 'F#4',
  'KeyG': 'G4',
  'KeyY': 'G#4',
  'KeyH': 'A4',
  'KeyU': 'A#4',
  'KeyJ': 'B4',
  'KeyK': 'C5',
  'KeyO': 'C#5',
  'KeyL': 'D5',
  'KeyP': 'D#5',
  'Semicolon': 'E5',
  'Quote': 'F5',
};

// Simple Typing Test Words
export const TYPING_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "i", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life",