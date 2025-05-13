import { User } from '../types';

export interface SavedCard {
    _id: string;
    userId: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    isDefault: boolean;
}

// Get saved cards for a user
export const getSavedCards = (userId: string): SavedCard[] => {
    const cards = localStorage.getItem(`cards_${userId}`);
    return cards ? JSON.parse(cards) : [];
};

// Save a new card
export const saveCard = (userId: string, cardData: Omit<SavedCard, '_id' | 'userId'>): SavedCard => {
    const cards = getSavedCards(userId);

    // Generate a unique ID
    const _id = Date.now().toString();

    const newCard: SavedCard = {
        _id,
        userId,
        ...cardData
    };

    // If this is the first card, make it default
    if (cards.length === 0) {
        newCard.isDefault = true;
    }

    cards.push(newCard);
    localStorage.setItem(`cards_${userId}`, JSON.stringify(cards));

    return newCard;
};

// Set a card as default
export const setDefaultCard = (userId: string, cardId: string): void => {
    const cards = getSavedCards(userId);

    const updatedCards = cards.map(card => ({
        ...card,
        isDefault: card._id === cardId
    }));

    localStorage.setItem(`cards_${userId}`, JSON.stringify(updatedCards));
};

// Delete a saved card
export const deleteCard = (userId: string, cardId: string): void => {
    const cards = getSavedCards(userId);
    const filteredCards = cards.filter(card => card._id !== cardId);

    // If we deleted the default card and there are other cards, make the first one default
    if (cards.find(card => card._id === cardId)?.isDefault && filteredCards.length > 0) {
        filteredCards[0].isDefault = true;
    }

    localStorage.setItem(`cards_${userId}`, JSON.stringify(filteredCards));
};

// Get the default card for a user
export const getDefaultCard = (userId: string): SavedCard | null => {
    const cards = getSavedCards(userId);
    return cards.find(card => card.isDefault) || null;
}; 