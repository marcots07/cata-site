import type { CSSProperties, ReactNode } from "react";

import { StatusIcons } from "./icons";

/** iPhone 15 Pro at true proportions, drawn in points and scaled with `--s`. */
export function Phone({
  children,
  className = "",
  style,
  statusTone = "light",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  statusTone?: "light" | "dark";
}) {
  return (
    <div className={`phone ${className}`} style={style}>
      <div className="phone-device">
        <span className="phone-button phone-button-action" />
        <span className="phone-button phone-button-up" />
        <span className="phone-button phone-button-down" />
        <span className="phone-button phone-button-side" />
        <div className="phone-bezel" />
        <div className="phone-display">
          <div className="app-ui phone-screen">{children}</div>
          <div className={`ui-status ${statusTone === "light" ? "text-white" : "text-ink"}`}>
            <span className="ui-status-time">9:41</span>
            <span className="ui-status-icons">
              <StatusIcons />
            </span>
          </div>
          <div className="phone-island" />
          <div className={`phone-home ${statusTone === "light" ? "bg-white" : "bg-ink"}`} />
          <div className="phone-glare" />
        </div>
      </div>
    </div>
  );
}
