package logic;

import misc.Support;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class Board {

    private ArrayList<Card> playerHand = new ArrayList<Card>();
    private ArrayList<Card> boardGrid;

    public Board() {
        boardGrid = new ArrayList<Card>(9);
        Card card = new Card();
        for (int i = 0; i < 9; i++) {
            boardGrid.add(card);
        }
    }

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

