import { useCallback, useRef, MouseEvent, useEffect } from "react";
import {
  getMachineState,
  sendClosedNodeEvent,
  sendMouseDownEvent,
  sendMouseMoveEvent,
  sendMouseUpEvent,
  subscribeWait,
  waitingForNodesToClose,
} from "../dragDropMachine";
import { NavigatorNode } from "../types";
import { flattenRootNavigatorNode, getHoverIndex } from "../utils";
import { TabbedContent } from "./TabbedContent";

export type ComponentNavigatorProps = {
  rootNode: NavigatorNode;
  // Call onChange everytime the selected node is repositioned
  onChange?: (change: { id: string; parentId: string; index: number }) => void;
  // Call onHover everytime user hovers over a component
  onHover?: (id: string) => void;
  // Call onSelect everytime user clicks on a component
  onSelect?: (id: string) => void;
  // Call onDragStart whenever the drag process starts
  onDragStart?: (id: string) => void;
  // Call onDragEnd whenever the drag process stops
  onDragEnd?: (id: string) => void;
  // Open or close a subtree
  onToggleOpen?: (id: string) => void;
};

export const ComponentNavigator: React.FC<ComponentNavigatorProps> = (
  props
) => {
  // TODO: maybe sub-optimal to keep this function call outside
  const flattenedNodes = flattenRootNavigatorNode(props.rootNode, true);

  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (ref.current) {
        const { y } = ref.current.getBoundingClientRect();
        const netY = event.clientY - y + ref.current.scrollTop;
        const hoverIndex = Math.floor(netY / 24);
        if (hoverIndex < flattenedNodes.length && hoverIndex >= 0) {
          props.onHover?.(flattenedNodes[hoverIndex].id);
        }
        sendMouseMoveEvent(event);
      }
    },
    [props, flattenedNodes]
  );
  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      sendMouseDownEvent(props.rootNode, flattenedNodes, event, ref);
    },
    [props.rootNode, flattenedNodes]
  );

  const onMouseUp = useCallback((event: MouseEvent) => {
    sendMouseUpEvent();
  }, []);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current) {
        const hoverIndex = getHoverIndex(ref, event);
        if (hoverIndex !== undefined && hoverIndex < flattenedNodes.length) {
          props.onSelect?.(flattenedNodes[hoverIndex].id);
        }
      }
    },
    [props, flattenedNodes]
  );

  const machineState = getMachineState();
  if (machineState.value === waitingForNodesToClose) {
    const { draggedNode, draggedNodeIndexInFlattenedArray } =
      machineState.context;
    if (draggedNode?.open) {
      props.onToggleOpen?.(draggedNode.id);
    } else {
      sendClosedNodeEvent(
        props.rootNode,
        flattenedNodes,
        draggedNodeIndexInFlattenedArray!,
        ref
      );
    }
  }

  useEffect(() => {
    subscribeWait((context) => {
      const { draggedNode } = context;
      if (draggedNode?.open) {
        props.onToggleOpen?.(draggedNode.id);
      }
    });
  }, [props]);

  return (
    <div
      onMouseMove={onMouseMove}
      onClick={onClick}
      ref={ref}
      style={{ overflow: "auto", boxSizing: "border-box" }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {flattenedNodes.map((node) => {
        const showCaret = node.type === "acceptsChild";
        return (
          <TabbedContent
            key={node.id}
            id={node.id}
            name={node.name}
            tabs={node.depth}
            showDownCaret={showCaret ? node.open : undefined}
            showRightCaret={showCaret ? !node.open : undefined}
            onCaretClicked={(id) => {
              props.onToggleOpen?.(id);
            }}
          />
        );
      })}
    </div>
  );
};
