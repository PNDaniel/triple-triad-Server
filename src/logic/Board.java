package logic;

import misc.Support;

import java.util.ArrayList;

public class Board {

    private ArrayList<Card> playerHand = new ArrayList<Card>();
    private Card[][] boardGrid;

    public Board(boolean placeHolder) {
        this.boardGrid = new Card[Support.MAX_ROW][Support.MAX_COL];
        for (int i = 0; i < Support.MAX_ROW; i++)
            for (int j = 0; j < Support.MAX_COL; j++)
                boardGrid[i][j] = new Card();
    }

    public Card[][] getBoardGrid() {
        return boardGrid;
    }

    public void setBoardGrid(Card[][] boardGrid) {
        this.boardGrid = boardGrid;
    }

    public void addCardToBoard(Card card, int colPos, int rowPos) {
        boardGrid[rowPos][colPos] = card;
    }

    public void printBoard() {
        System.out.println("||-----------------------------||");
        for (int i = 0; i < Support.MAX_ROW; i++) {
            System.out.print("|| ");
            for (int j = 0; j < Support.MAX_COL; j++) {
                System.out.print(boardGrid[i][j].getCardName() + " || ");
            }
            System.out.print("\n");
        }
        System.out.print("\n");
        System.out.println("||-----------------------------||");
    }

    /* ----------------------------------------------------------------------------------------------------
     Deprecated structure to impletment the Board (It's just here in case we need to revert, it still needs lot's of tweaks
    ----------------------------------------------------------------------------------------------------  */
    /*
       private ArrayList<Card> boardGrid2;

       public Board() {
       boardGrid2 = new ArrayList<Card>(9);
       Card card = new Card();
       for (int i = 0; i < 9; i++) {
           boardGrid2.add(card);
       }
   }
    public ArrayList<Card> getBoardGrid2() {
        return boardGrid2;
    }

    public void setBoardGrid2(ArrayList<Card> boardGrid2) {
        this.boardGrid = boardGrid;
    }

    public void addCardToBoard2(Card card, int position) {
        boardGrid2.set(position, card);
    }

    public void printBoard2() {
        System.out.println("||-----------------------------||");
        for (int i = 0; i < boardGrid2.size(); i++) {
            System.out.print(boardGrid2.get(i).getCardName() + " |=| ");
        }
        System.out.print("\n");
        System.out.println("||-----------------------------||");
    }*/
}

