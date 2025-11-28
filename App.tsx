import React, { useState, useEffect, useCallback } from 'react';
import KeyboardCanvas from './components/KeyboardCanvas';
import { AppMode, KeyMap, PianoNote } from './types';
import { PIANO_MAP, KEY_LAYOUT } from './constants';
import { audioService } from './services/audioService';
import { Keyboard, Music, Palette, Settings, Command } from 'lucide-react';

const App: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<AppMode>(AppMode.VISUALIZER);
  const [rgbMode, setRgbMode] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<string>('#00d8ff'); // Cyan default
  const [selectedKey, setSelectedKey] = useState<string | null>(null); // For mapper

  // Init audio on first interaction
  useEffect(() => {
    const initAudio = () => audioService.init();
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default for some keys if needed, but usually we want browser shortcuts to work unless fully capturing
    if (mode === AppMode.PIANO && PIANO_MAP[e.code]) {
      e.preventDefault(); // Stop scrolling etc when playing piano
      audioService.playNote(PIANO_MAP[e.code]);
    } else {
        audioService.playClick();
    }
    
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.add(e.code);
      return newSet;
    });
  }, [mode]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (mode === AppMode.PIANO && PIANO_MAP[e.code]) {
      audioService.stopNote(PIANO_MAP[e.code]);
    }

    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
  }, [mode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Handle 3D Key Click (Mapper Mode)
  const handleVirtualKeyClick = (code: string) => {
    if (mode === AppMode.MAPPER) {
      setSelectedKey(code);
    } else {
      // Trigger visual feedback manually
      setActiveKeys(prev => {
          const s = new Set(prev);
          s.add(code);
          setTimeout(() => setActiveKeys(p => {
              const next = new Set(p);
              next.delete(code);
              return next;
          }), 150);
          return s;
      });
      // Play sound
      if(mode === AppMode.PIANO && PIANO_MAP[code]) {
          audioService.playNote(PIANO_MAP[code]);
          setTimeout(() => audioService.stopNote(PIANO_MAP[code]), 200);
      } else {
          audioService.playClick();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f0f11] text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141416] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CrystalKey <span className="text-white/40 font-normal text-sm ml-2">v1.0</span></h1>
        </div>

        <nav className="flex gap-1 bg-white/5 p-1 rounded-full">
          <button
            onClick={() => setMode(AppMode.VISUALIZER)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-all ${
              mode === AppMode.VISUALIZER ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Visualizer
          </button>
          <button
            onClick={() => setMode(AppMode.PIANO)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-all ${
              mode === AppMode.PIANO ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-white/40 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" /> Piano Mode
          </button>
          <button
            onClick={() => setMode(AppMode.MAPPER)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-all ${
              mode === AppMode.MAPPER ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-white/40 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Remap
          </button>
        </nav>

        <div className="flex items-center gap-4">
            {/* Simple Volume / Connection indicator could go here */}
            <div className="flex items-center gap-2 text-xs text-white/50">
                <div className={`w-2 h-2 rounded-full ${activeKeys.size > 0 ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
                {activeKeys.size > 0 ? 'Active Input' : 'Idle'}
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex">
        {/* Left Control Panel (Visible in Visualizer/Mapper) */}
        <div className="w-80 bg-[#141416] border-r border-white/10 p-6 flex flex-col gap-6 z-10 overflow-y-auto custom-scrollbar">
          
          {mode === AppMode.VISUALIZER && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div>
                <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Lighting
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">RGB Wave</span>
                    <button 
                        onClick={() => setRgbMode(!rgbMode)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${rgbMode ? 'bg-purple-600' : 'bg-white/20'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${rgbMode ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {!rgbMode && (
                      <div className="space-y-2">
                          <span className="text-sm text-white/60">Static Color</span>
                          <div className="flex gap-2 flex-wrap">
                            {['#00d8ff', '#ff0055', '#ccff00', '#ffffff', '#aa00ff'].map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setAccentColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === c ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                          </div>
                      </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-2xl font-light">{activeKeys.size}</div>
                        <div className="text-xs text-white/40">Keys Pressed</div>
                    </div>
                     <div>
                        <div className="text-2xl font-light">60%</div>
                        <div className="text-xs text-white/40">Layout</div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {mode === AppMode.PIANO && (
               <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                   <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                       <h3 className="font-semibold mb-2">Piano Active</h3>
                       <p className="text-xs opacity-70 leading-relaxed">
                           Use your keyboard's home row (ASDF...) to play notes. 
                           <br/><br/>
                           Mapped Keys:<br/>
                           <span className="font-mono bg-black/20 px-1 rounded">A</span> → C4<br/>
                           <span className="font-mono bg-black/20 px-1 rounded">S</span> → D4<br/>
                           <span className="font-mono bg-black/20 px-1 rounded">D</span> → E4<br/>
                           <span className="font-mono bg-black/20 px-1 rounded">F</span> → F4<br/>
                           ...and so on.
                       </p>
                   </div>
                   
                   <div>
                       <h3 className="text-sm font-semibold text-white/70 mb-3">Synth Settings</h3>
                       <div className="text-xs text-white/30 italic">
                           Oscillator: Triangle<br/>
                           Effects: Reverb (Wet 0.3)
                       </div>
                   </div>
               </div>
          )}

          {mode === AppMode.MAPPER && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <h3 className="text-emerald-300 font-semibold mb-1">Key Remapping</h3>
                      <p className="text-xs text-emerald-200/60">
                          Select a key on the 3D model to reconfigure its bindings.
                      </p>
                  </div>

                  {selectedKey ? (
                      <div className="space-y-4 border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between">
                              <span className="text-sm text-white/60">Selected Key</span>
                              <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono border border-white/10">{selectedKey}</span>
                          </div>
                          
                          <div className="space-y-2">
                              <label className="text-xs text-white/40 uppercase font-bold">Map To</label>
                              <select className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-emerald-500">
                                  <option>Default ({selectedKey})</option>
                                  <option>Macro 1</option>
                                  <option>Volume Up</option>
                                  <option>Volume Down</option>
                                  <option>Play/Pause</option>
                              </select>
                          </div>
                      </div>
                  ) : (
                      <div className="text-center py-8 text-white/20 text-sm">
                          No key selected
                      </div>
                  )}
              </div>
          )}

        </div>

        {/* 3D Canvas Container */}
        <div className="flex-1 h-full relative cursor-move">
            <KeyboardCanvas 
                activeKeys={activeKeys} 
                activeColor={accentColor}
                rgbMode={rgbMode}
                onKeyClick={handleVirtualKeyClick}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
