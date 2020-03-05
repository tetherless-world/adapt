package utils;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.CompletableFuture;

import java.util.function.Supplier;

public class AsyncRunner {

    private static final int threadCount = 8;

    private static final ExecutorService executor = Executors.newFixedThreadPool(threadCount);
    
    public static CompletableFuture<Void> run(Runnable runnable) {
        return CompletableFuture.runAsync(runnable, executor);
    }

    public static <T> CompletableFuture<T> get(Supplier<T> supplier) {
        return CompletableFuture.supplyAsync(supplier, executor);
    }
}