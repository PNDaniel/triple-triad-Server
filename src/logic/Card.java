package logic;

import misc.Support;

public class Card {

    private int cardID;
    private String cardName;
    private int cardLevel; // levels 1 through 10. Levels 8,9,10 are the rarest and stronger cards
    private String cardImage;
    private int[] cardRanks = new int[4]; // Each card has four numbers (known as ranks); each number corresponds to one of the four sides of the card,
    private Support.Elements cardElements;

    // Em baixo estão algumas "varíáveis" que encontrei na wiki deles, not sure se deviam ficar nesta classe
    private int numberOfCopies;
    private int cardColour; // 0 - pink card = opponent; 1- blue card = player

    public Card() {
        cardName = "null";
    }

    // Constructor mainly for testing
    public Card(int cardID, String cardName, int[] cardRanks) {
        this.cardID = cardID;
        this.cardName = cardName;
        this.cardRanks = cardRanks;
    }

    public Card(int cardID, String cardName, int cardLevel, String cardImage, Support.Elements cardElements, int[] cardRanks) {
        this.cardID = cardID;
        this.cardName = cardName;
        this.cardLevel = cardLevel;
        this.cardImage = cardImage;
        this.cardElements = cardElements;
        this.cardRanks = cardRanks;
    }

    public int getCardID() {
        return cardID;
    }

    public String getCardName() {
        return cardName;
    }

    public int getCardLevel() {
        return cardLevel;
    }

    public String getCardImage() {
        return cardImage;
    }

    public int[] getCardRanks() {
        return cardRanks;
    }

    public Support.Elements getCardElements() {
        return cardElements;
    }

    public void setCardID(int cardID) {
        this.cardID = cardID;
    }

    public void setCardName(String cardName) {
        this.cardName = cardName;
    }

    public void setCardLevel(int cardLevel) {
        this.cardLevel = cardLevel;
    }

    public void setCardImage(String cardImage) {
        this.cardImage = cardImage;
    }

    public void setCardRanks(int[] cardRanks) {
        this.cardRanks = cardRanks;
    }

    public void setCardElements(Support.Elements cardElements) {
        this.cardElements = cardElements;
    }
}
