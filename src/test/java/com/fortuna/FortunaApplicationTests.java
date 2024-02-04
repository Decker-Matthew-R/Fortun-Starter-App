package com.fortuna;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(
        properties = {
            "spring.security.oauth2.client.registration.google.client-id=test-client-id",
            "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
        })
class AtlasApplicationTests {

    @Test
    void contextLoads() {}

    @Test
    void mainMethodTest() {
        FortunaApplication.main(new String[] {});
    }
}
