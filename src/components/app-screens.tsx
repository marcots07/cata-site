import Image from "next/image";

import {
  Chat,
  ChevronDown,
  Flash,
  Grid,
  Home,
  Images,
  Pencil,
  ScanFrame,
  Search,
  Sort,
  Sparkle,
  Utensils,
  WineBottle,
  ArrowRight,
  ArrowUp,
} from "./icons";

const TASTE = [
  { label: "Body", value: 4 },
  { label: "Acidity", value: 3 },
  { label: "Tannin", value: 3 },
  { label: "Sweetness", value: 1 },
] as const;

const ESTIMATE_NOTE = "Estimated by Cata from the label. Not verified against a critic database.";

function TabBar({ tone }: { tone: "dark" | "light" }) {
  return (
    <div className={`ui-tabbar ${tone === "light" ? "is-light" : ""}`}>
      <div className="ui-tabrow">
        <div className="ui-tab">
          <Home size={22} />
          <span className="ui-tab-label">Home</span>
        </div>
        <div className="ui-tab">
          <Chat size={22} />
          <span className="ui-tab-label">Ask</span>
        </div>
        <div className="ui-tab" />
        <div className="ui-tab">
          <Utensils size={22} />
          <span className="ui-tab-label">Pair</span>
        </div>
        <div className="ui-tab">
          <WineBottle size={22} />
          <span className="ui-tab-label">Cellar</span>
        </div>
      </div>
      <div className="ui-scanbtn-wrap">
        <div className="ui-scanbtn">
          <ScanFrame size={28} strokeWidth={1.7} />
        </div>
      </div>
    </div>
  );
}

/** The Scan tab: live camera with the bottle already found. */
export function ScanCameraScreen() {
  return (
    <div className="ui-tab-screen">
      <div className="ui-cam">
        <div className="ui-feed">
          <Image src="/app/hermelinda-camera.jpg" alt="" fill sizes="300px" />
          <div className="ui-livebox" />
        </div>
        <div className="ui-overlay">
          <div className="ui-ov-top" />
          <div className="ui-ov-mid">
            <div className="ui-ov-side" />
            <div className="ui-vf">
              <div className="ui-vf-status">
                <div className="ui-pill">
                  <span className="ui-dot" />
                  <span>Bottle found</span>
                </div>
              </div>
              <i className="ui-corner ui-corner-tl" />
              <i className="ui-corner ui-corner-tr" />
              <i className="ui-corner ui-corner-bl" />
              <i className="ui-corner ui-corner-br" />
            </div>
            <div className="ui-ov-side" />
          </div>
          <div className="ui-ov-bottom">
            <div className="ui-instruction">Point at a wine label</div>
            <div className="ui-modes">
              <div className="ui-mode is-on">
                <ScanFrame size={15} />
                One bottle
              </div>
              <div className="ui-mode">
                <Grid size={15} />
                Many bottles
              </div>
            </div>
            <div className="ui-shutter-row">
              <div className="ui-side-btn">
                <Images size={20} />
              </div>
              <div className="ui-capture">
                <div className="ui-capture-inner" />
              </div>
              <div className="ui-side-btn">
                <Flash size={19} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabBar tone="dark" />
    </div>
  );
}

/** scan-result, presented as a page sheet over the camera. */
export function ScanResultScreen() {
  return (
    <div className="ui-sheet-screen">
      <div className="ui-sheet-behind" />
      <div className="ui-page">
        <div className="ui-page-head">
          <span className="ui-page-side">
            <ChevronDown size={26} strokeWidth={2} />
          </span>
          <div className="ui-page-title">Wine identified</div>
          <span className="ui-page-side" />
        </div>
        <div className="ui-page-content">
          <div className="ui-result-photo">
            <Image src="/app/hermelinda-camera.jpg" alt="" fill sizes="260px" />
          </div>
          <div className="ui-stack-4">
            <div className="ui-title-22">Hermelinda</div>
            <div className="ui-sub">CR Vinos</div>
            <div className="ui-sub">Valle de Guadalupe, Baja California, Mexico</div>
          </div>
          <div className="ui-link-row">
            <Pencil size={14} />
            Not right? Fix the details
          </div>
          <div className="ui-card">
            <div className="ui-card-title">Taste profile</div>
            <div className="ui-bars">
              {TASTE.map((row) => (
                <div key={row.label} className="ui-bar">
                  <span className="ui-bar-label">{row.label}</span>
                  <div className="ui-segs">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <i key={i} className={`ui-seg ${i < row.value ? "is-on" : ""}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="ui-foot">{ESTIMATE_NOTE}</div>
          </div>
          <div className="ui-card">
            <div className="ui-card-title">Tasting notes</div>
            <div className="ui-body">
              Blackberry and black currant up front, then violet, black pepper and a touch of vanilla
              from 12 months in American oak.
            </div>
            <div className="ui-foot">{ESTIMATE_NOTE}</div>
          </div>
          <div className="ui-card">
            <div className="ui-card-title">Pairs well with</div>
            <div className="ui-chips">
              <span className="ui-chip">Grilled steak</span>
              <span className="ui-chip">Tacos al pastor</span>
              <span className="ui-chip">BBQ ribs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WineRow({
  image,
  name,
  sub,
  badge,
}: {
  image: string;
  name: string;
  sub: string;
  badge?: string;
}) {
  return (
    <div className="ui-wine">
      <Image src={image} alt="" width={72} height={72} sizes="72px" />
      <div className="ui-wine-info">
        <div className="ui-wine-name">{name}</div>
        <div className="ui-wine-sub">{sub}</div>
        {badge ? <span className="ui-badge">{badge}</span> : null}
      </div>
    </div>
  );
}

/** pair/result: the dish Cata saw and the bottle it picked from the cellar. */
export function PairPreview() {
  return (
    <div className="app-ui ui-surface ui-pair">
      <div className="ui-stack-4">
        <div className="ui-title-22">Steak frites</div>
        <div className="ui-sub">Grilled · Rich, savory, buttery</div>
      </div>
      <div className="ui-stack-8">
        <div className="ui-section-title">Open from your cellar</div>
        <WineRow image="/app/thumb-hermelinda.jpg" name="Hermelinda" sub="CR Vinos · Valle de Guadalupe" />
        <div className="ui-reason">
          Its blackberry and black pepper match the char on the steak, and the tannin cuts through the
          herb butter and the fries.
        </div>
      </div>
      <div className="ui-stack-8">
        <div className="ui-section-title">What Cata saw</div>
        <div className="ui-chips">
          <span className="ui-chip is-neutral">Grilled steak</span>
          <span className="ui-chip is-neutral">Herb butter</span>
          <span className="ui-chip is-neutral">Fries</span>
          <span className="ui-chip is-neutral">Chives</span>
        </div>
      </div>
    </div>
  );
}

/** The Ask tab: the one input in ask mode, and the inline answer it produced. */
export function AskPreview() {
  return (
    <div className="app-ui ui-ask-wrap">
      <div className="ui-ask-input">
        <Sparkle size={18} strokeWidth={2} className="ui-ask-input-icon" />
        <span className="ui-ask-input-text">
          What should I open tonight?
          <i className="ui-caret" />
        </span>
        <span className="ui-ask-send">
          <ArrowUp size={16} strokeWidth={2.2} />
        </span>
      </div>
      <div className="ui-ask">
        <div className="ui-ask-head">
          <span className="ui-ask-badge">
            <Sparkle size={13} strokeWidth={2} />
            Cata
          </span>
        </div>
        <div className="ui-ask-question">What should I open tonight?</div>
        <div className="ui-ask-answer">
          Open the <b>Hermelinda</b> tonight. It’s drinking well now, and its blackberry and black
          pepper are made for a seared steak.
        </div>
        <WineRow image="/app/thumb-hermelinda.jpg" name="Hermelinda" sub="CR Vinos · Valle de Guadalupe" />
        <div className="ui-chips">
          <span className="ui-follow">What else pairs with it?</span>
          <span className="ui-follow">When should I open the Malbec?</span>
        </div>
        <div className="ui-ask-continue">
          Continue in chat
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

/** My Cellar, All Wines. */
export function CellarPreview() {
  return (
    <div className="app-ui ui-surface ui-cellar">
      <div className="ui-seg-track">
        <div className="ui-seg-item is-on">All Wines</div>
        <div className="ui-seg-item">Folders</div>
      </div>
      <div className="ui-search">
        <Search size={18} />
        <span>Search your cellar</span>
      </div>
      <div className="ui-results-bar">
        <span>3 wines</span>
        <span className="ui-sort">
          <Sort size={15} />
          Recently added
        </span>
      </div>
      <div className="ui-stack-12">
        <WineRow image="/app/thumb-hermelinda.jpg" name="Hermelinda" sub="CR Vinos · Valle de Guadalupe" />
        <WineRow image="/app/thumb-dbc-cabernet.jpg" name="Cabernet Franc y Cabernet Sauvignon" sub="DBC" />
        <WineRow image="/app/thumb-dbc-malbec.jpg" name="Malbec" sub="DBC" badge="×2" />
      </div>
    </div>
  );
}
