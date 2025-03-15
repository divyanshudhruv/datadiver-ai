import {
  BookAudio,
  ChartNoAxesColumn,
  ContainerIcon,
  DraftingCompass,
  GitBranchPlusIcon,
  Github,
  Home,
  SquareActivityIcon,
  User,
} from "lucide-react";
import "./navbar.css";

export function Navbar() {
  return (
    <div className="container">
      <div className="item active" style={{ marginRight: "4px !important" }}>
        <Home size={16} />
      </div>
      <div className="seperator"></div>
      <div
        className="item"
        style={{ marginRight: "6px !important", marginLeft: "4px !important" }}
      >
        <SquareActivityIcon size={16} />
        <div className="text">How</div>
      </div>
      <div className="item" style={{ marginRight: "6px !important" }}>
        <BookAudio size={15} />
        <div className="text">Analytics</div>{" "}
      </div>
      <div className="item">
        <ContainerIcon size={15} />
        <div className="text">Github</div>{" "}
      </div>
    </div>
  );
}
