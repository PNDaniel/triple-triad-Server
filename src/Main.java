import logic.Board;
import logic.Card;
import logic.Game;

import java.util.ArrayList;
import java.util.Scanner;

/* TODO:
    - Retirar carta da mão
    - Verificar vizinhança das cartas no tabuleiro
    - Determinar cor das cartas (no momento da atribuição das cartas aos jogadores alterar as cores delas
    - Fazer testes no Main
  */

// Just using this main class to test and debug stuff.
public class Main {

    public static void main(String args[]) {

        Game game;
        boolean isPlayerAStarter;

        // TESTING - (lines 23-46) : declaring variables for tests porpuses
        ArrayList<Card> playerAHand = new ArrayList<Card>();
        ArrayList<Card> playerBHand = new ArrayList<Card>();

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

        game = new Game(playerAHand, playerBHand);
        isPlayerAStarter = game.coinToss();
        if (isPlayerAStarter == true) {
            System.out.println("Player A starting");
        } else System.out.println("Player B starting");

        while (game.getPlayerAHand().size() != 0 || game.getPlayerBHand().size() != 0) {
            int cardNo;
            int colPos, rowPos;
            Scanner input;

            if (isPlayerAStarter == true) {
                for (int i = 0; i < playerAHand.size(); i++) {
                    System.out.print(" || " + (i + 1) + " : " + playerAHand.get(i).getCardName() + " || ");
                }
                System.out.print("A - Play card: ");
                input = new Scanner(System.in);
                cardNo = input.nextInt();
                System.out.print("A - Choose Column Number: ");
                input = new Scanner(System.in);
                colPos = input.nextInt();
                System.out.print("A - Choose Row Number: ");
                input = new Scanner(System.in);
                rowPos = input.nextInt();

                game.getGameBoard().addCardToBoard(playerAHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
                game.getGameBoard().printBoard();

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

                game.getGameBoard().addCardToBoard(playerBHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
                game.getGameBoard().printBoard();
            } else {
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

                game.getGameBoard().addCardToBoard(playerBHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
                game.getGameBoard().printBoard();

                for (int i = 0; i < playerAHand.size(); i++) {
                    System.out.print(" || " + (i + 1) + " : " + playerAHand.get(i).getCardName() + " || ");
                }
                System.out.print("A - Play card: ");
                input = new Scanner(System.in);
                cardNo = input.nextInt();
                System.out.print("A - Choose Column Number: ");
                input = new Scanner(System.in);
                colPos = input.nextInt();
                System.out.print("A - Choose Row Number: ");
                input = new Scanner(System.in);
                rowPos = input.nextInt();

                game.getGameBoard().addCardToBoard(playerAHand.get(cardNo - 1), (colPos - 1), (rowPos - 1));
                game.getGameBoard().printBoard();
            }
        }
    }
}
