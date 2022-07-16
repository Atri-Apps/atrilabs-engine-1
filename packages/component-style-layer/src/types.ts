import { UploadMode } from "@atrilabs/shared-layer-lib";
import React from "react";

export type CssProprtyComponentType = {
  styles: React.CSSProperties;
  patchCb: (slice: any) => void;
  openAssetManager: (
    modes: UploadMode[],
    styleItem: keyof React.CSSProperties
  ) => void;
};
