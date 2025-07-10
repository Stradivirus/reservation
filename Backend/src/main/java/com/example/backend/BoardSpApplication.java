package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication
@EnableScheduling
public class BoardSpApplication {

    public static void main(String[] args) {
        SpringApplication.run(BoardSpApplication.class, args);
    }

    // 데이터베이스 연결
    @Bean
    public CommandLineRunner testDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                if (connection.isValid(1)) {
                    System.out.println("데이터베이스에 성공적으로 연결되었습니다.");
                }
            } catch (SQLException e) {
                System.err.println("데이터베이스 연결에 실패했습니다: " + e.getMessage());
            }
        };
    }
}