import logic.Board;
import logic.Card;
import logic.Rules;

import java.util.ArrayList;
import java.util.Scanner;


// Just using this main class to test and debug stuff.
public class Main {

    public static void main(String args[]) {

        ArrayList<Card> playerAHand = new ArrayList<Card>();
        ArrayList<Card> playerBHand = new ArrayList<Card>();
        //Board board = new Board();
        Board board = new Board(true);

        Card card1 = new Card(1, "Geezard", new int[]{1, 4, 1, 5});
        Card card2 = new Card(2, "Funguar", new int[]{5, 1, 1, 3});
        Card card3 = new Card(3, "Bite Bug", new int[]{1, 3, 3, 5});
        Card card4 = new Card(4, "Red Bat", new int[]{6, 1, 1, 2});
        Card card5 = new Card(5, "Blobra", new int[]{2, 3, 1, 5});
        Card card6 = new Card(6, "Gayla", new int[]{2, 1, 4, 4});
        Card card7 = new Card(7, "Gesper", new int[]{1, 5, 4, 1});
        Card card8 = new Card(8, "Fastitocalon-F", new int[]{3, 5, 2, 1});
        Card card9 = new Card(9, "Blood Soul", new int[]{2, 1, 6, 1});
        Card card10 = new Card(10, "Caterchipillar", new int[]{4, 2, 4, 3});

        playerAHand.add(card1);
        playerAHand.add(card2);
        playerAHand.add(card3);
        playerAHand.add(card4);
        playerAHand.add(card5);
        playerBHand.add(card6);
        playerBHand.add(card7);
        playerBHand.add(card8);
        playerBHand.add(card9);
        playerBHand.add(card10);

        while (playerAHand.size() != 0 || playerBHand.size() != 0) {
            int cardNo;
            int colPos, rowPos;
            for (int i = 0; i < playerAHand.size(); i++) {
                System.out.print(" || " + (i + 1) + " : " + playerAHand.get(i).getCardName() + " || ");
            }
            System.out.print("A - Play card: ");
            Scanner input = new Scanner(System.in);
            cardNo = input.nextInt();
            board.printBoard2();
            System.out.print("A - Choose Column Number: ");
            input = new Scanner(System.in);
            colPos = input.nextInt();
            System.out.print("A - Choose Row Number: ");
            input = new Scanner(System.in);
            rowPos = input.nextInt();
            board.addCardToBoard2(playerAHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
            board.printBoard2();

            for (int i = 0; i < playerBHand.size(); i++) {
                System.out.print(" || " + (i + 1) + " : " + playerBHand.get(i).getCardName() + " || ");
            }
            System.out.print("B - Play card: ");
            input = new Scanner(System.in);
            cardNo = input.nextInt();
            System.out.print("B - Choose Column Number: ");
            input = new Scanner(System.in);
            colPos = input.nextInt();
            System.out.print("B - Choose Row Number: ");
            input = new Scanner(System.in);
            rowPos = input.nextInt();
            board.addCardToBoard2(playerBHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
            board.printBoard2();
        }

        /*while (playerAHand.size() != 0 || playerBHand.size() != 0) {
            int cardNo;
            int colPos, rowPos;
            for (int i = 0; i < playerAHand.size(); i++) {
                System.out.print(" || " + (i + 1) + " : " + playerAHand.get(i).getCardName() + " || ");
            }
            System.out.print("A - Play card: ");
            Scanner input = new Scanner(System.in);
            cardNo = input.nextInt();
            /*position = new Rules().checkCardIntoBoardPosition('A');
            System.out.println("cenas" + position);*/
           /* System.out.print("A - Choose Column Number: ");
            input = new Scanner(System.in);
            colPos = input.nextInt();
            System.out.print("A - Choose Row Number: ");
            input = new Scanner(System.in);
            rowPos = input.nextInt();
            board.addCardToBoard(playerAHand.get(cardNo - 1), (colPos - 1));
            board.printBoard();

            /*if(new Rules().checkVicinity(,playerAHand.get(cardNo-1)))

            else
            {
                System.out.print("A - Choose Position: ");
                input = new Scanner(System.in);
                position = input.nextInt();
            }

            for (int i = 0; i < playerBHand.size(); i++) {
                System.out.print(" || " + (i + 1) + " : " + playerBHand.get(i).getCardName() + " || ");
            }
            System.out.print("B - Play card: ");
            input = new Scanner(System.in);
            cardNo = input.nextInt();
            //position = new Rules().checkCardIntoBoardPosition('B');
            System.out.print("B - Choose Column Number: ");
            input = new Scanner(System.in);
            colPos = input.nextInt();
            System.out.print("B - Choose Row Number: ");
            input = new Scanner(System.in);
            rowPos = input.nextInt();
            board.addCardToBoard(playerBHand.get(cardNo - 1), colPos);
            board.printBoard();
        }*/
    }
}
