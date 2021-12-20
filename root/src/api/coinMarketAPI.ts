import axios from "axios";
import { CoinList, Coin } from "../interfaces/coinmarket-interface";

class CoinAPI {
  async getCryptoList() {
    const list = await axios
      .get(process.env.COIN_MARKET_URL!, {
        params: {
          limit: 20,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_KEY!,
        },
      })
      .then((res: { data: { data: CoinList[] } }) => res.data.data)
      .catch((err: Error) => console.log(err.message));

    return list as CoinList[];
  }

  async getCryptoBySymbol(symbol: string) {
    const crypto = await axios
      .get(process.env.COIN_MARKET_SINGLE!, {
        params: {
          symbol,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_KEY!,
        },
      })
      .then((res: { data: { data: Coin } }) => res.data.data)
      .catch((err: Error) => console.log(err.message));

    return crypto as Coin;
  }

  async getFollowingCurrencies(symbol: string) {
    const followList = await axios
      .get(process.env.COIN_MARKET_SINGLE!, {
        params: {
          symbol,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_KEY!,
        },
      })
      .then((res: { data: { data: Coin } }) => res.data.data)
      .catch((err: Error) => console.log(err.message));

    return followList as Coin;
  }
}

export { CoinAPI };
