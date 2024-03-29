import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './utils/helpers'
import { DataProvider } from './context/DataContext'
import { NotificationProvider } from './context/NotificationContext';
import Prototype from './prototypes/Prototype'
import World from './components/World'

/**
 * TODO:
 * [ ] OPTIMIZE CANVAS (Google how to)
 * [ ] Disable key controls on input focus
 * [ ] Add limits to palette cells
 * [ ] Add Next as right click of Play/Pause
 * [ ] Add trailing palette (Start palette once cell dies to black)
 * [ ] Divide grid into different rules
 *     [ ] Add different colors for different rules
 * [ ] Add X, Y offsets to all fillers (like Cross)
 * [ ] Replace LMB and RMB with icons
 * [ ] Improve cross browser compatibility with line-height: 1 (see md-con and children in palette.css)
 * [ ] Add rotate on right mouse click to placable patterns
 * [ ] Add change shapes on mouse wheel
 * [ ] Age Based loop from a different index (currently from 0)
 * [ ] Add dynamic rules on brush off
 * [ ] Add recents to palette
 * [ ] Save age based shades (not sure where to fit this)
 * [ ] Add shadows to each generation of mono color on trails aplha = 0
 * [-] Add fullscreen
 *     * Done only on key press
 * [✓] FIX FLICKERING ON LOOPED PALETTE
 * [✓] Fix palette first cell delete when second cell is step cell 
 * [✓] Implement textfields of palette cells
 * [✓] Add wrap to grid 
 * [✓] Add background image / gradient and alive cells are transparent / dead cells are black (better perormance) 
 * [✓] Option to 'Keep' earlier iterations in grid (Dont clear canvas)
 *     [✓] Maybe "clear" the rect with rgba(0, 0, 0, .1) each draw cycle? (or some smaller a;)
 * [✓] Add notifications on key pressess
 * [✓] Add Cellular Automata as starting shape
 * [x] Add border-radius to palette cells 
 *     * Not possible to add border radius to border image
 */

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path='/Prototype' element={<Prototype />} />
      </Routes>
    </BrowserRouter>
  );
}

const Main = () => (
  <DataProvider>
    <NotificationProvider>
      <World />
    </NotificationProvider>
  </DataProvider>
)

export default App;
