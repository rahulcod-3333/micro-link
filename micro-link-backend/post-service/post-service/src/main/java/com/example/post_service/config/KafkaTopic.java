package com.example.post_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopic {

    @Bean
    public NewTopic postCreateTopic(){
        return new NewTopic("post-created-topic" , 3 , (short)1);

    }
    @Bean
    public NewTopic postLikeTopic(){
        return new NewTopic("post-liked-topic", 3,  (short) 1);
    }
}
