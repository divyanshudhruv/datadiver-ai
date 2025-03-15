import Image from "next/image";
import { Navbar } from "./../my-ui/navbar";
import { Text } from "./../my-ui/text";
import { useEffect } from "react";

import "./style.css";
export default function Home() {
  return (
    <>
      <div className="containerMax">
        <Navbar />
        <Text/>
      </div>
    </>
  );
}
