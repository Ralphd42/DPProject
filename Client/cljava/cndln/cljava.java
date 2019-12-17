 
import java.util.Scanner;

public class cljava{
    public static void main(String[] args) {

        SockManagement sm = new SockManagement();
        sm.PROCINPUT();

        Scanner in = new Scanner(System.in);
        String s = in.nextLine();
        System.out.println("You entered string "+s);
        int a = in.nextInt();
        System.out.println("You entered integer "+a);
        float b = in.nextFloat();
        System.out.println("You entered float "+b);



}
 
}

