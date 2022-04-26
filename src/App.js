import { DataProvider } from './context/DataContext'
import { NotificationProvider } from './context/NotificationContext';

// import Prototype from './prototypes/Prototype'
import World from './components/World'

/**
 * TODO:
 * [ ] OPTIMIZE CANVAS (Google how to)
 * [✓] Fix palette first cell delete when second cell is step cell 
 * [x] Add border-radius to palette cells 
 *     * Not possible to add border radius to border image
 * [✓] Implement textfields of palette cells
 * [ ] Add limits to palette cells
 * [ ] Add Next as right click of Play/Pause
 * [✓] Add wrap to grid 
 * [ ] Add trailing palette (Start palette once cell dies to black)
 * [ ] Divide grid into different rules
 *     [ ] Add different colors for different rules
 * [✓] Add background image / gradient and alive cells are transparent / dead cells are black (better perormance) 
 * [✓] Option to 'Keep' earlier iterations in grid (Dont clear canvas)
 *     [✓] Maybe "clear" the rect with rgba(0, 0, 0, .1) each draw cycle? (or some smaller a;)
 * [ ] Add X, Y offsets to all fillers (like Cross)
 * [ ] Replace LMB and RMB with icons
 * [ ] Improve cross browser compatibility with line-height: 1 (see md-con and children in palette.css)
 * [ ] Add rotate on right mouse click to placable patterns
 * [ ] Add change shapes on mouse wheel
 * [-] Add fullscreen
 *     * Done only on key press
 * [✓] Add notifications on key pressess
 */

function App() {
  return (
    // <Prototype />
    <DataProvider>
      <NotificationProvider>
        <World />
      </NotificationProvider>
    </DataProvider>
  );
}

export default App;
