export interface TradesData {
        date: Date,
        tid: Number,
        price: Number,
        type: Number,
        amount: Number
};
export interface Trades {
    btcusd : Array<TradesData>,
    btceur : Array<TradesData>,
    eurusd : Array<TradesData>,
    xrpusd : Array<TradesData>,
    xrpeur : Array<TradesData>,
    xrpbtc : Array<TradesData>,
    ltcusd : Array<TradesData>,
    ltceur : Array<TradesData>,
    ltcbtc : Array<TradesData>,
    ethusd : Array<TradesData>,
    etheur : Array<TradesData>,
    ethbtc : Array<TradesData>,
    bchusd : Array<TradesData>,
    bcheur : Array<TradesData>,
    bchbtc : Array<TradesData>
}