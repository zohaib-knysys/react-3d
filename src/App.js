import "./styles.css";
import { StlViewer } from "./stl-viewer";
import { C2dViewer } from "./2dViewer";


export default function App() {
  return (
    <div className="App" style={{display:'flex', width:'100%', justifyContent:'space-between'}}>
      <C2dViewer />
      <StlViewer />
    </div>
  );
}
