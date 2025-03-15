import {
  BookAudio,
  ContainerIcon,
 
  Home,
  SquareActivityIcon,
} from "lucide-react";
import "./navbar.css";

export function Navbar() {
  return (
    <div className="container">
        <a href="/" className="item active" style={{ marginRight: "4px !important" }}>
          <Home size={16} />
        </a>
      <div className="seperator"></div>
      <a href="https://github.com/divyanshudhruv/datadiver-ai/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="item" style={{ marginRight: "6px !important", marginLeft: "4px !important" }}>
        <SquareActivityIcon size={16} />
        <div className="text">How</div>
      </a>
      
      <a href="https://github.com/divyanshudhruv/datadiver-ai/blob/main/examples" target="_blank" rel="noopener noreferrer" className="item" style={{ marginRight: "6px !important" }}>
        <BookAudio size={15} />
        <div className="text">Examples</div>{" "}
      </a>
        <a href="https://github.com/divyanshudhruv/datadiver-ai" target="_blank" rel="noopener noreferrer" className="item">
          <ContainerIcon size={15} />
          <div className="text">Github</div>{" "}
        </a>
    </div>
  );
}
