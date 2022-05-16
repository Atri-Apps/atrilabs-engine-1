import type { ReactNode } from "react";
import { Container } from "@atrilabs/core";
import { Canvas } from "./Canvas";

type CanvasRuntimeProps = {
  // layers are children of runtime
  children: ReactNode | ReactNode[];
};

const CanvasRuntime: React.FC<CanvasRuntimeProps> = (props) => {
  return (
    <>
      {props.children}
      <Container name="Canvas">
        <Canvas />
      </Container>
    </>
  );
};

export default CanvasRuntime;