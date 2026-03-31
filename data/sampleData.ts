export interface SentinelData {
  meta: {
    generated_at: string;
    war_day: number;
    situation: string;
    severity: 'low' | 'elevated' | 'high' | 'critical' | 'severe';
  };
  energy: {
    brent: { price: number; change_pct: number; note: string };
    lpg: { official_price: number; deficit_pct: number; black_market_low: number; black_market_high: number; reserves_days: number };
    petrol: { price: number; city: string; status: string };
    diesel: { price: number; city: string; status: string };
    natural_gas: { status: string };
  };
  supply_chain: {
    hormuz_status: string;
    stranded_vessels: number;
    stranded_tonnage: number;
    insurance_surge_pct: number;
    alternative_routes: string[];
    key_developments: string[];
  };
  prices: {
    food: { item: string; price: number; trend: 'up' | 'down' | 'flat' }[];
    gold: { price_per_10g: number; trend: string };
    forex: { inr_usd: number; note: string };
    urea: { change_pct: number; trend: string };
    food_inflation: number;
  };
  markets: {
    nifty: { value: number; change_pct: number; note: string };
    sensex: { value: number; change_pct: number };
    fii_flows: { amount_crore: number; period: string };
    dii_flows: { note: string };
  };
  political_signals: {
    date: string;
    speaker: string;
    venue: string;
    quote: string;
    analysis: string;
  }[];
  actions: {
    type: 'BUY' | 'PREPARE' | 'WATCH';
    item: string;
    done: boolean;
    detail: string;
  }[];
  risks: {
    level: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }[];
  timeline: {
    date: string;
    day: number;
    events: { tag: string; text: string }[];
  }[];
  daily_life: string[];
  stock_radar: {
    name: string;
    price: string;
    category: string;
    status: string;
  }[];
}

export const SAMPLE_DATA: SentinelData = {
  meta: {
    generated_at: "2026-04-01T01:30:00+05:30",
    war_day: 32,
    situation: "Day 32. Reports of Iran striking Saudi, UAE, Qatar simultaneously. Ras Tanura refinery shut, Qatar LNG halted. NEEDS VERIFICATION. Brent dropped to $106-113 which contradicts mass escalation.",
    severity: "critical",
  },
  energy: {
    brent: { price: 110.0, change_pct: -4.5, note: "VOLATILE: dropped from $115 to $106-113 range" },
    lpg: { official_price: 915.5, deficit_pct: 44, black_market_low: 2000, black_market_high: 6000, reserves_days: 60 },
    petrol: { price: 102.96, city: "Bangalore", status: "+\u20B98.19 vs baseline. No change." },
    diesel: { price: 90.99, city: "Bangalore", status: "+\u20B98.49 vs baseline. No change." },
    natural_gas: { status: "Yelahanka 370MW shut. Emergency kerosene via PDS. LPG supply 44% short. Two tankers arriving today/tomorrow." },
  },
  supply_chain: {
    hormuz_status: "selective",
    stranded_vessels: 22,
    stranded_tonnage: 320000,
    insurance_surge_pct: 300,
    alternative_routes: ["Cape of Good Hope (+10-14 days)"],
    key_developments: [
      "Iranian drone hit tanker Al Salmi at Dubai port anchorage (31nm from Dubai). War zone extends beyond Hormuz.",
      "E-3 Sentry AWACS confirmed DESTROYED at Saudi base (~$270M). US air superiority degraded.",
      "Iranian parliament approved Hormuz ban bill. Needs full vote. Legislative escalation.",
      "Houthis advancing to Bab al-Mandeb launch positions. Saudi's 5M bbl/day Red Sea reroute now exposed.",
      "Iran struck US base in Saudi Arabia \u2014 20 US personnel wounded, 2 E-3 Sentry radar planes damaged.",
      "Pentagon preparing ground operations \u2014 Kharg Island raids + Hormuz coastal sites. 82nd Airborne readied.",
      "Two Indian LPG tankers (94K tonnes) arriving: BW Tyr Mumbai today, BW Elm New Mangalore Apr 1.",
      "Govt rolling out emergency kerosene via PDS \u2014 60-day measure.",
    ],
  },
  prices: {
    food: [
      { item: "Rice 5kg", price: 332, trend: "up" },
      { item: "Cooking Oil 4.35kg", price: 918, trend: "down" },
      { item: "Dal 5kg", price: 999, trend: "flat" },
      { item: "LPG Cylinder 14.2kg", price: 915, trend: "up" },
    ],
    gold: { price_per_10g: 148260, trend: "up" },
    forex: { inr_usd: 94.35, note: "Strengthened from \u20B995.07 to ~\u20B994.35. Relief rally. But RBI still burning $27B/mo." },
    urea: { change_pct: 30, trend: "up" },
    food_inflation: 3.47,
  },
  markets: {
    nifty: { value: 22331, change_pct: -2.14, note: "CLOSED (Mahavir Jayanti). GIFT Nifty +0.37%. Asia: Kospi -4%, Nikkei -2.2%." },
    sensex: { value: 71948, change_pct: -2.22 },
    fii_flows: { amount_crore: -4367, period: "Mar 27. Monthly: ~\u20B91.14L Cr outflow in March." },
    dii_flows: { note: "+\u20B93,566 Cr net buy. SIPs steady \u20B930K Cr/mo." },
  },
  political_signals: [
    {
      date: "Mar 31 PM",
      speaker: "Govt of India",
      venue: "Policy",
      quote: "Kerosene revived under PDS \u2014 60 days. 21 states/UTs. Petrol pumps authorized to sell.",
      analysis: "Government planning for MONTHS of LPG disruption, not weeks. Bringing back a fuel India phased out years ago = crisis is worse than admitted publicly.",
    },
    {
      date: "Mar 31",
      speaker: "Trump",
      venue: "Escalation",
      quote: "Will 'completely obliterate' Iran's electric plants, oil wells, Kharg Island, AND 'possibly all desalination plants'.",
      analysis: "Adding WATER infrastructure = total war signaling. Most extreme threat yet. If acted on Apr 6, Brent $140+ instantly.",
    },
    {
      date: "Mar 31",
      speaker: "Iran VP Aref",
      venue: "Escalation",
      quote: "Trump can only decide about sending troops to Khark; bringing them back is no longer his decision. No-one returns from hell.",
      analysis: "Direct warning Kharg ground invasion would be a quagmire. Increases risk premium on ground operations.",
    },
    {
      date: "Mar 31",
      speaker: "Rubio / State Dept",
      venue: "Diplomatic",
      quote: "Trump prefers diplomacy. Direct talks through intermediaries. Pakistan offered to host.",
      analysis: "Contradicts obliteration threats. Classic good-cop-bad-cop. Gap remains wide.",
    },
    {
      date: "Mar 31",
      speaker: "Fed Chair Powell",
      venue: "Diplomatic",
      quote: "Inflation outlook 'in check.' Fed can 'wait and see' on Iran's economic impact.",
      analysis: "US Fed NOT hiking. Dollar may weaken \u2014 rupee breathing room. But RBI likely to hike at April 6-8 MPC.",
    },
  ],
  actions: [
    { type: "BUY", item: "Induction Cooktop", done: true, detail: "DONE Mar 25. You're covered." },
    { type: "BUY", item: "Gold 24K \u2014 \u20B914,929/g today", done: false, detail: "Delay cost growing daily. Wedding 50g = \u20B97,46,450. War expanding = gold will surge further." },
    { type: "BUY", item: "Fill XUV700 diesel tank", done: false, detail: "\u20B990.99/L. Excise at \u20B90. IOC absorbing ~\u20B930/L loss. Retail hike imminent. Fill before Apr 5." },
    { type: "PREPARE", item: "Stock staples (2 weeks) by Apr 4", done: false, detail: "Industrial diesel +25%. Veggie prices +8-12% expected. Govt rolling out emergency kerosene = things are worse." },
    { type: "PREPARE", item: "Review floating rate loans", done: false, detail: "RBI MPC Apr 6-8 likely to hike 25-50 bps. Per \u20B910L: +\u20B9380-460/mo." },
    { type: "WATCH", item: "Inverter + battery", done: false, detail: "In stock but delivery 10-12 Apr. Yelahanka 370MW down. Monitor Bangalore power cuts." },
    { type: "WATCH", item: "April 6 Trump deadline \u2014 6 days", done: false, detail: "50% escalation probability. Pentagon ground ops planned. Have essentials + full tank by Apr 4." },
    { type: "WATCH", item: "Wedding venue \u2014 lock soon", done: false, detail: "Hospitality costs +10-20%. Caterer prices following. Lock before inflation bakes in." },
  ],
  risks: [
    { level: "high", title: "April 6 Trump deadline (6 days)", description: "Trump threatens to 'obliterate' Iran. Pentagon planning ground ops. If executed: Brent $140+, rupee \u20B9100, fuel +\u20B910-15." },
    { level: "high", title: "Dubai port attack \u2014 war zone expanding", description: "Iran hit tanker 31nm from Dubai. If ports targeted: shipping insurance goes to war-exclusion levels." },
    { level: "high", title: "RBI rate hike Apr 6-8", description: "Goldman: 50 bps to 5.75%. EBLR EMIs up within 3 months. Per \u20B910L: +\u20B9380-460/mo." },
    { level: "high", title: "Diesel excise exhausted (\u20B90/L)", description: "Govt absorbing ~\u20B930/L loss. Unsustainable at Brent $115+. IOC retail hike \u20B93-5 likely within days." },
    { level: "medium", title: "Double chokepoint: Hormuz + Bab al-Mandeb", description: "Iran pressing Houthis to resume Red Sea attacks. Both blocked = 30% global containers, 22% oil disrupted." },
    { level: "medium", title: "Summer power crisis", description: "Yelahanka 370MW gone. Peak 270GW. Bangalore suburbs at risk of rolling outages." },
    { level: "medium", title: "Kharif fertilizer shortage", description: "25-35% global ammonia/urea via Hormuz. Crisis extends to Jun-Jul food production." },
    { level: "low", title: "Hegseth insider trading scandal", description: "FT report: tried to buy defense ETF pre-war. Could erode US war credibility." },
  ],
  timeline: [
    {
      date: "Mar 31 Night",
      day: 32,
      events: [
        { tag: "war", text: "Iran strikes across Gulf \u2014 Saudi Ras Tanura, UAE (intercepted), Qatar LNG. Needs AM verification." },
        { tag: "war", text: "Hegseth claims 'regime change has occurred' in Iran. Rubio: 'Hormuz will reopen one way or another.'" },
        { tag: "oil", text: "Brent dropped sharply: $115\u2192$106-113. CONTRADICTS escalation reports." },
      ],
    },
    {
      date: "Mar 31 PM",
      day: 31,
      events: [
        { tag: "war", text: "Iranian drone hit tanker Al Salmi at Dubai port anchorage. War zone extends beyond Hormuz." },
        { tag: "war", text: "E-3 AWACS confirmed DESTROYED at Saudi base (~$270M). US air superiority degraded." },
        { tag: "gov", text: "Kerosene PDS revived \u2014 21 states, petrol pump sales authorized. Govt planning for months." },
        { tag: "oil", text: "Gold rises to \u20B914,929/g (+\u20B9102). Wedding 50g = \u20B97,46,450." },
      ],
    },
    {
      date: "Mar 31",
      day: 31,
      events: [
        { tag: "war", text: "Iran strikes US base in Saudi Arabia \u2014 20 US personnel wounded, 2 E-3 damaged." },
        { tag: "war", text: "Trump: will 'obliterate' Iran incl. desalination plants. Pentagon preparing ground ops + 82nd Airborne." },
        { tag: "war", text: "Iran VP Aref: 'No one returns from hell' \u2014 warning on Kharg ground invasion." },
        { tag: "mkt", text: "Indian markets CLOSED (Mahavir Jayanti). Asia: Kospi -4%, Nikkei -2.2%." },
        { tag: "gov", text: "Emergency kerosene via PDS launched (60-day). Two LPG tankers arriving." },
        { tag: "oil", text: "Brent $115.17 (+2%). Rupee recovers to \u20B994.35 from \u20B995.07." },
      ],
    },
    {
      date: "Mar 30",
      day: 30,
      events: [
        { tag: "war", text: "Houthis fired ballistic + cruise missiles at Israel. Second attack within 24 hours." },
        { tag: "war", text: "Iran struck Kuwait power plant \u2014 Indian worker killed." },
        { tag: "mkt", text: "Nifty -2.14% to 22,331. Sensex -2.22%. Rupee hit \u20B995.07." },
        { tag: "oil", text: "Brent $116.23 high, settled ~$113. Monthly +55% record." },
      ],
    },
    {
      date: "Mar 29",
      day: 29,
      events: [
        { tag: "gov", text: "Modi Mann Ki Baat: 'resolutely facing challenges' \u2014 tone shift." },
        { tag: "oil", text: "Industrial diesel +25% (\u20B987.67\u2192\u20B9109.59)." },
        { tag: "war", text: "Houthis enter war \u2014 first ballistic missiles at Israel." },
      ],
    },
    {
      date: "Mar 27",
      day: 27,
      events: [
        { tag: "gov", text: "Excise cut \u20B910/L on petrol + diesel. Export levies imposed." },
        { tag: "war", text: "Israel strikes Yazd uranium facility. Commercial LPG raised to 70%." },
      ],
    },
    {
      date: "Apr 6",
      day: 37,
      events: [
        { tag: "war", text: "DEADLINE: Trump's strike pause expires 8PM ET. Ground ops possible." },
        { tag: "gov", text: "RBI MPC begins same day \u2014 rate hike decision expected." },
      ],
    },
  ],
  daily_life: [
    "LPG queues active across Karnataka.",
    "Restaurants: 7K cylinders/day statewide, 1K for restaurants. Swiggy/Zomato orders -50-60%. ~1Cr gig workers hit.",
    "Power: Yelahanka 370MW SHUT. BESCOM backup gone. Summer peak 270GW expected.",
    "Induction cooktops \u2014 6/10 listings 'Price N/A'. Demand stress persistent.",
    "Inverter batteries \u2014 delivery 10-12 Apr (normal 1-2 days).",
    "Black Mkt: LPG domestic \u20B92,000-3,000 (official \u20B9915). Commercial up to \u20B96,000.",
    "Indian worker killed in Kuwait strike (Mar 30). 1 Cr Indians in Gulf at risk.",
    "Cooking oil DROPPED: Fortune Sunlite \u20B9945\u2192\u20B9918 (-\u20B927). First price relief.",
    "Dhruv Rathee's crisis videos at 26M combined views \u2014 influencer-driven panic buying.",
  ],
  stock_radar: [
    { name: "IBELL 30YO 2000W", price: "N/A", category: "Induction", status: "DEMAND STRESS" },
    { name: "Cadlec CookEase 2000W", price: "\u20B93,149", category: "Induction", status: "SLOW DELIVERY" },
    { name: "Luminous Combo ~15K", price: "\u20B915,199", category: "Inverter", status: "SLOW DELIVERY" },
    { name: "Luminous Combo ~25K", price: "\u20B925,799", category: "Inverter", status: "SLOW DELIVERY" },
    { name: "Fortune Sunlite 4.35kg", price: "\u20B9918 (\u2193\u20B927)", category: "Oil", status: "PRICE DOWN" },
    { name: "India Gate Everyday 5kg", price: "\u20B9332", category: "Rice", status: "STABLE" },
  ],
};
