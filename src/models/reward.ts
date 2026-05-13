import { CardInstance } from './card';
import { CurrencyAmount } from './currency';

export interface RewardBundle {
  cards: CardReward[];
  currencies: CurrencyAmount[];
}

export interface CardReward {
  instance: CardInstance;
}
