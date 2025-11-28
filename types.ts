import { ThreeElements } from '@react-three/fiber';

export interface KeyConfig {
  id: string;
  label: string;
  subLabel?: string;
  code: string; // JS Event Code (e.g., KeyA)
  width: number; // Width in units (1u)
  x: number; // X position in units (from left)
  row: number;
  col: number;
  type?: 'normal' | 'iso-enter' | 'space';
}

export interface KeyMap {
  [keyCode: string]: {
    mappedTo: string;
    label: string;
    action?: string;
  };
}

export enum AppMode {
  VISUALIZER = 'VISUALIZER',
  PIANO = 'PIANO',
  MAPPER = 'MAPPER',
  TYPING = 'TYPING',
}

export interface PianoNote {
  note: string;
  octave: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}