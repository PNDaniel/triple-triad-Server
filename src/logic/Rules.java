package logic;

import java.util.Scanner;

/*
My idea behind this class is its reusability in both sides, Client and Server.
 Not sure if its the best idea and/or if it will work
 */
public class Rules {

    public Rules() {

    }

    // method to determine each classes sides
    public boolean checkVicinity(Card[] cards, Card cardPlaced) {
        return true;
    }

    // Method that verifies if the card is being inserted into the correct position
    public int checkCardIntoBoardPosition(char player) {
        int position = 0;
        Scanner input;
        System.out.println("cenas again " + position);
        while (position <= 0 && position >= 10) {
            System.out.print(player + " - Choose Position: ");
            input = new Scanner(System.in);
            position = input.nextInt();
        }
        System.out.println("cenas wtf " + position);
        return position;
    }
}
