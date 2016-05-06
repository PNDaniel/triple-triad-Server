package logic;

import misc.Support;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class Board {
    private int MAX_ROW = 3;
    private int MAX_COL = 3;
    private ArrayList<Card> playerHand = new ArrayList<Card>();
    private ArrayList<Card> boardGrid;
    private Card[][] boardGrid2;

    public Board() {
        boardGrid = new ArrayList<Card>(9);
        Card card = new Card();
        for (int i = 0; i < 9; i++) {
            boardGrid.add(card);
        }
    }

    // ----------------------------------------------------------------------------------------------------
    public Board(boolean placeHolder) {
        this.boardGrid2 = new Card[MAX_ROW][MAX_COL];
        for (int i = 0; i < MAX_ROW; i++)
            for (int j = 0; j < MAX_COL; j++)
                boardGrid2[i][j] = new Card();
    }

    public Card[][] getBoardGrid2() {
        return boardGrid2;
    }

    public void setBoardGrid2(Card[][] boardGrid2) {
        this.boardGrid2 = boardGrid2;
    }

    public void addCardToBoard2(Card card, int colPos, int rowPos) {
        boardGrid2[rowPos][colPos] = card;
    }

    public void printBoard2() {
        System.out.println("||-----------------------------||");
        for (int i = 0; i < MAX_ROW; i++) {
            System.out.print("|| ");
            for (int j = 0; j < MAX_COL; j++) {
                System.out.print(boardGrid2[i][j].getCardName() + " || ");
            }
            System.out.print("\n");
        }
        System.out.print("\n");
        System.out.println("||-----------------------------||");
    }

    // ----------------------------------------------------------------------------------------------------
    public ArrayList<Card> getBoardGrid() {
        return boardGrid;
    }

    public void setBoardGrid(ArrayList<Card> boardGrid) {
        this.boardGrid = boardGrid;
    }

    public void addCardToBoard(Card card, int position) {
        boardGrid.set(position, card);
    }

    public void printBoard() {
        System.out.println("||-----------------------------||");
        for (int i = 0; i < boardGrid.size(); i++) {

            System.out.print(boardGrid.get(i).getCardName() + " |=| ");

            /*if ((i%3) == 0)
                System.out.print("Number = " + boardGrid.get(i).getCardName());
            else System.out.println("Number = " + boardGrid.get(i).getCardName());*/
        }
        System.out.print("\n");
        System.out.println("||-----------------------------||");
    }
}

