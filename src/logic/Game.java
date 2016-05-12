package logic;

import misc.Support;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Random;

public class Game {
    private ArrayList<Card> playerAHand = new ArrayList<Card>();
    private ArrayList<Card> playerBHand = new ArrayList<Card>();
    private Board gameBoard = new Board(true);


    public Game(ArrayList<Card> playerAHand, ArrayList<Card> playerBHand) {
        this.playerAHand = playerAHand;
        this.playerBHand = playerBHand;
        this.gameBoard = new Board(true);
    }

    public ArrayList<Card> getPlayerAHand() {
        return playerAHand;
    }

    public ArrayList<Card> getPlayerBHand() {
        return playerBHand;
    }

    public Board getGameBoard() {
        return gameBoard;
    }

    public boolean coinToss() {
        Random randomNum = new Random();
        int result = randomNum.nextInt(2);
        // 0 = Heads = Player A starting
        if (result == 0)
            return true;
        else return false;
    }

    /*  This method is needed server side to prevent card hand manipulation
        Using cardID to compare both cards because the ID is unique.
        The return might be changed to provide more information about the success/failure of the method
    */
    public boolean validateCardPicked(Card card, int player) {
        if (player == 1)
            for (int i = 0; i < playerAHand.size(); i++)
                if (playerAHand.get(i).getCardID() == card.getCardID())
                    return true;
                else for (i = 0; i < playerBHand.size(); i++)
                    if (playerBHand.get(i).getCardID() == card.getCardID())
                        return true;
        return false;
    }

    /*  Verifies if the chosen position is empty
        Returns true if the position is empty (has a "card" named "null" in it), returns false otherwise
     */
    public boolean validateBoardPosition(Card card, int rowPos, int colPos) {
        for (int row = 0; row < Support.MAX_ROW; row++)
            for (int col = 0; col < Support.MAX_COL; col++)
                if ((rowPos == row) && (colPos == col))
                    if (gameBoard.getBoardGrid()[row][col].getCardName() == null)
                        return true;
        return false;
    }

    public boolean removeCardFromHand(Card card) {
        // TODO complete remove card from hand, should we add a "null" to the hand, so that the size may remain 5? Just straightforward remove it?
        /*  return might be changed depending on "error". The method can be successful or unsuccessful (Card isn't in hand (although validateCardPicked might take care of this)
        */
        return true;
    }

    public boolean gameStartToServer() {
        // TODO send a messege to the server with both Players Hands
        // RETURN: boolean true, if correctly sent, false if the messege wasn't sent, or an OK messege wasn't received (ie. Server Down)
        return true;
    }

    public void checkScore() {
        // TODO Still needs more, atm only verifies colour of cards on Board, but colour on hand also matters Need testing
        int pink = 0; // player A
        int blue = 0; // player B
        for (int row = 0; row < Support.MAX_ROW; row++)
            for (int col = 0; col < Support.MAX_COL; col++)
                if (gameBoard.getBoardGrid()[row][col].getCardColour() == 1)
                    pink++;
                else if (gameBoard.getBoardGrid()[row][col].getCardColour() == 2)
                    blue++;
        for (int i = 0; i < Support.PLAYER_HAND; i++) {
            if (playerAHand.get(i).getCardColour() == 1) {
                pink++;
            }
            if (playerBHand.get(i).getCardColour() == 2) {
                blue++;
            }
        }
    }
}
