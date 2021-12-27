import axios from 'axios';
import { CoinList, Coin } from '../interfaces/coinmarket-interface';

class CoinAPI {
    async getCryptoList() {
        const list = await axios
            .get<{ data: CoinList[] }>(process.env.COIN_MARKET_URL!, {
            params: {
                limit: 20,
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COIN_KEY!,
            },
        })
            .then((res) => res.data.data)
            .catch((err: Error) => console.log(err.message));

        return list as CoinList[];
    }

    async getCryptoBySymbol(symbol: string) {
        const crypto = await axios
            .get<{ data: Coin }>(process.env.COIN_MARKET_SINGLE!, {
            params: {
                symbol,
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COIN_KEY!,
            },
        })
            .then((res) => res.data.data)
            .catch((err: Error) => console.log(err.message));

        return crypto as Coin;
    }
}

export { CoinAPI };
