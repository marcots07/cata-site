import Image from "next/image";

import type { Dictionary } from "@/i18n/dictionary";

import {
  ArrowRight,
  ArrowUp,
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
} from "./icons";

const TASTE = [4, 3, 3, 1] as const;

type Ui = Dictionary["ui"];

function withWine(template: string, wine: string) {
  const [before, after = ""] = template.split("{wine}");
  return (
    <>
      {before}
      <b>{wine}</b>
      {after}
    </>
  );
}

function TabBar({ tone, copy }: { tone: "dark" | "light"; copy: Ui["tabs"] }) {
  return (
    <div className={`ui-tabbar ${tone === "light" ? "is-light" : ""}`}>
      <div className="ui-tabrow">
        <div className="ui-tab">
          <Home size={22} />
          <span className="ui-tab-label">{copy.home}</span>
        </div>
        <div className="ui-tab">
          <Chat size={22} />
          <span className="ui-tab-label">{copy.ask}</span>
        </div>
        <div className="ui-tab" />
        <div className="ui-tab">
          <Utensils size={22} />
          <span className="ui-tab-label">{copy.pair}</span>
        </div>
        <div className="ui-tab">
          <WineBottle size={22} />
          <span className="ui-tab-label">{copy.cellar}</span>
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
export function ScanCameraScreen({ copy }: { copy: Ui }) {
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
                  <span>{copy.camera.found}</span>
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
            <div className="ui-instruction">{copy.camera.instruction}</div>
            <div className="ui-modes">
              <div className="ui-mode is-on">
                <ScanFrame size={15} />
                {copy.camera.one}
              </div>
              <div className="ui-mode">
                <Grid size={15} />
                {copy.camera.many}
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
      <TabBar tone="dark" copy={copy.tabs} />
    </div>
  );
}

/** scan-result, presented as a page sheet over the camera. */
export function ScanResultScreen({ copy }: { copy: Ui }) {
  return (
    <div className="ui-sheet-screen">
      <div className="ui-sheet-behind" />
      <div className="ui-page">
        <div className="ui-page-head">
          <span className="ui-page-side">
            <ChevronDown size={26} strokeWidth={2} />
          </span>
          <div className="ui-page-title">{copy.result.title}</div>
          <span className="ui-page-side" />
        </div>
        <div className="ui-page-content">
          <div className="ui-result-photo">
            <Image src="/app/hermelinda-camera.jpg" alt="" fill sizes="260px" />
          </div>
          <div className="ui-stack-4">
            <div className="ui-title-22">Hermelinda</div>
            <div className="ui-sub">CR Vinos</div>
            <div className="ui-sub">{copy.result.region}</div>
          </div>
          <div className="ui-link-row">
            <Pencil size={14} />
            {copy.result.fix}
          </div>
          <div className="ui-card">
            <div className="ui-card-title">{copy.result.taste}</div>
            <div className="ui-bars">
              {TASTE.map((value, index) => (
                <div key={copy.result.tasteLabels[index]} className="ui-bar">
                  <span className="ui-bar-label">{copy.result.tasteLabels[index]}</span>
                  <div className="ui-segs">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <i key={i} className={`ui-seg ${i < value ? "is-on" : ""}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="ui-foot">{copy.result.estimate}</div>
          </div>
          <div className="ui-card">
            <div className="ui-card-title">{copy.result.notesTitle}</div>
            <div className="ui-body">{copy.result.notes}</div>
            <div className="ui-foot">{copy.result.estimate}</div>
          </div>
          <div className="ui-card">
            <div className="ui-card-title">{copy.result.pairs}</div>
            <div className="ui-chips">
              {copy.result.chips.map((chip) => (
                <span key={chip} className="ui-chip">
                  {chip}
                </span>
              ))}
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
export function PairPreview({ copy }: { copy: Ui }) {
  return (
    <div className="app-ui ui-surface ui-pair">
      <div className="ui-stack-4">
        <div className="ui-title-22">{copy.pair.dish}</div>
        <div className="ui-sub">{copy.pair.vibe}</div>
      </div>
      <div className="ui-stack-8">
        <div className="ui-section-title">{copy.pair.open}</div>
        <WineRow image="/app/thumb-hermelinda.jpg" name="Hermelinda" sub="CR Vinos · Valle de Guadalupe" />
        <div className="ui-reason">{copy.pair.reason}</div>
      </div>
      <div className="ui-stack-8">
        <div className="ui-section-title">{copy.pair.saw}</div>
        <div className="ui-chips">
          {copy.pair.chips.map((chip) => (
            <span key={chip} className="ui-chip is-neutral">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The Ask tab: the one input in ask mode, and the inline answer it produced. */
export function AskPreview({ copy }: { copy: Ui }) {
  return (
    <div className="app-ui ui-ask-wrap">
      <div className="ui-ask-input">
        <Sparkle size={18} strokeWidth={2} className="ui-ask-input-icon" />
        <span className="ui-ask-input-text">
          {copy.ask.question}
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
        <div className="ui-ask-question">{copy.ask.question}</div>
        <div className="ui-ask-answer">{withWine(copy.ask.answer, "Hermelinda")}</div>
        <WineRow image="/app/thumb-hermelinda.jpg" name="Hermelinda" sub="CR Vinos · Valle de Guadalupe" />
        <div className="ui-chips">
          {copy.ask.follows.map((follow) => (
            <span key={follow} className="ui-follow">
              {follow}
            </span>
          ))}
        </div>
        <div className="ui-ask-continue">
          {copy.ask.continue}
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

/** My Cellar, All Wines. */
export function CellarPreview({ copy }: { copy: Ui }) {
  return (
    <div className="app-ui ui-surface ui-cellar">
      <div className="ui-seg-track">
        <div className="ui-seg-item is-on">{copy.cellar.all}</div>
        <div className="ui-seg-item">{copy.cellar.folders}</div>
      </div>
      <div className="ui-search">
        <Search size={18} />
        <span>{copy.cellar.search}</span>
      </div>
      <div className="ui-results-bar">
        <span>{copy.cellar.count}</span>
        <span className="ui-sort">
          <Sort size={15} />
          {copy.cellar.sort}
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
