package com.example.connection_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic sendRequestEvent(){
        return new NewTopic("send-request-event", 3, (short)1);
    }
    @Bean
    public NewTopic acceptRequest(){
        return new NewTopic("accept-request-event", 3 ,(short)1 );
    }

}
