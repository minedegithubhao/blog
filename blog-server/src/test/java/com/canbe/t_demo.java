package com.canbe;

public class t_demo {

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        long count = 0;
        for (int i = 0; i < 100_000_000; i++) {
            count+=i;
        }
        System.out.println("Time taken: " + (System.currentTimeMillis() - start) + "ms");
    }
}
