import { Provider } from './context/Context'

// import Prototype from './prototypes/Prototype'
import World from './components/World'

function App() {
  return (
    // <Prototype />
    <Provider>
      <World />
    </Provider>
  );
}

export default App;
